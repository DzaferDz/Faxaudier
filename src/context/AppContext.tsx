import React, { createContext, useContext, useState, useEffect } from 'react';
import { Subject, Flashcard, StudyFile, Folder, Language, FlashcardDifficulty } from '../types';
import { translations } from '../translations';
import { SAMPLE_SUBJECTS, SAMPLE_FOLDERS, SAMPLE_FLASHCARDS, SAMPLE_FILES } from '../sampleData';
import { StorageService } from '../services/storage';
import { calculateNextReview } from '../services/spacedRepetition';

interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: typeof translations['de'];
  subjects: Subject[];
  folders: Folder[];
  flashcards: Flashcard[];
  files: StudyFile[];
  
  // Subject actions
  addSubject: (subject: Omit<Subject, 'id' | 'createdAt'>) => Subject;
  updateSubject: (id: string, updates: Partial<Subject>) => void;
  deleteSubject: (id: string) => void;

  // Folder actions
  addFolder: (folder: Omit<Folder, 'id' | 'createdAt'>) => Folder;
  updateFolder: (id: string, updates: Partial<Folder>) => void;
  deleteFolder: (id: string) => void;

  // File actions
  uploadFile: (file: File, subjectId: string, folderId: string | null) => Promise<StudyFile>;
  updateFile: (id: string, updates: Partial<StudyFile>) => void;
  deleteFile: (id: string) => Promise<void>;
  markFileAccessed: (id: string) => void;
  getFileDataUrl: (id: string) => Promise<string | null>;

  // Flashcard actions
  addFlashcard: (card: Omit<Flashcard, 'id' | 'createdAt' | 'repetitions' | 'intervalDays' | 'easeFactor' | 'nextReviewDate'>) => Flashcard;
  updateFlashcard: (id: string, updates: Partial<Flashcard>) => void;
  deleteFlashcard: (id: string) => void;
  reviewFlashcard: (id: string, difficulty: FlashcardDifficulty) => void;

  // System & Backup
  exportWorkspaceJson: () => void;
  importWorkspaceJson: (jsonString: string) => boolean;
  resetToDefaultData: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

const STORAGE_KEYS = {
  LANG: 'faxaudier_lang',
  SUBJECTS: 'faxaudier_subjects',
  FOLDERS: 'faxaudier_folders',
  CARDS: 'faxaudier_cards',
  FILES: 'faxaudier_files_meta',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.LANG);
    return (saved as Language) || 'de';
  });

  const [subjects, setSubjects] = useState<Subject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return saved ? JSON.parse(saved) : SAMPLE_SUBJECTS;
  });

  const [folders, setFolders] = useState<Folder[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FOLDERS);
    return saved ? JSON.parse(saved) : SAMPLE_FOLDERS;
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CARDS);
    return saved ? JSON.parse(saved) : SAMPLE_FLASHCARDS;
  });

  const [files, setFiles] = useState<StudyFile[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.FILES);
    return saved ? JSON.parse(saved) : SAMPLE_FILES;
  });

  // Sync state to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LANG, language);
  }, [language]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FOLDERS, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CARDS, JSON.stringify(flashcards));
  }, [flashcards]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.FILES, JSON.stringify(files));
  }, [files]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language] || translations.de;

  // --- SUBJECT ACTIONS ---
  const addSubject = (data: Omit<Subject, 'id' | 'createdAt'>): Subject => {
    const newSub: Subject = {
      ...data,
      id: 'sub-' + Date.now(),
      createdAt: Date.now(),
    };
    setSubjects(prev => [newSub, ...prev]);
    return newSub;
  };

  const updateSubject = (id: string, updates: Partial<Subject>) => {
    setSubjects(prev => prev.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteSubject = (id: string) => {
    setSubjects(prev => prev.filter(s => s.id !== id));
    // Cascade delete folders, files, and flashcards belonging to subject
    setFolders(prev => prev.filter(f => f.subjectId !== id));
    setFiles(prev => prev.filter(f => f.subjectId !== id));
    setFlashcards(prev => prev.filter(c => c.subjectId !== id));
  };

  // --- FOLDER ACTIONS ---
  const addFolder = (data: Omit<Folder, 'id' | 'createdAt'>): Folder => {
    const newFolder: Folder = {
      ...data,
      id: 'f-' + Date.now(),
      createdAt: Date.now(),
    };
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  };

  const updateFolder = (id: string, updates: Partial<Folder>) => {
    setFolders(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFolder = (id: string) => {
    setFolders(prev => prev.filter(f => f.id !== id));
    // Move contained files to root (folderId: null)
    setFiles(prev => prev.map(f => f.folderId === id ? { ...f, folderId: null } : f));
  };

  // --- FILE ACTIONS ---
  const uploadFile = async (rawFile: File, subjectId: string, folderId: string | null): Promise<StudyFile> => {
    const id = 'file-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7);
    const ext = rawFile.name.split('.').pop()?.toLowerCase() || '';

    // Convert file to base64 DataURL
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(rawFile);
    });

    // Save large payload to IndexedDB
    await StorageService.saveFileData(id, dataUrl);

    const studyFile: StudyFile = {
      id,
      subjectId,
      folderId,
      name: rawFile.name,
      size: rawFile.size,
      type: rawFile.type,
      extension: ext,
      lastAccessed: Date.now(),
      createdAt: Date.now(),
    };

    setFiles(prev => [studyFile, ...prev]);
    return studyFile;
  };

  const updateFile = (id: string, updates: Partial<StudyFile>) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, ...updates } : f));
  };

  const deleteFile = async (id: string) => {
    await StorageService.deleteFileData(id);
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const markFileAccessed = (id: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, lastAccessed: Date.now() } : f));
  };

  const getFileDataUrl = async (id: string): Promise<string | null> => {
    // Check if in sampleData inline
    const fileMeta = files.find(f => f.id === id);
    if (fileMeta?.dataUrl) return fileMeta.dataUrl;
    return await StorageService.getFileData(id);
  };

  // --- FLASHCARD ACTIONS ---
  const addFlashcard = (data: Omit<Flashcard, 'id' | 'createdAt' | 'repetitions' | 'intervalDays' | 'easeFactor' | 'nextReviewDate'>): Flashcard => {
    const newCard: Flashcard = {
      ...data,
      id: 'card-' + Date.now(),
      repetitions: 0,
      intervalDays: 0,
      easeFactor: 2.5,
      nextReviewDate: Date.now(), // Due immediately
      createdAt: Date.now(),
    };
    setFlashcards(prev => [newCard, ...prev]);
    return newCard;
  };

  const updateFlashcard = (id: string, updates: Partial<Flashcard>) => {
    setFlashcards(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const deleteFlashcard = (id: string) => {
    setFlashcards(prev => prev.filter(c => c.id !== id));
  };

  const reviewFlashcard = (id: string, difficulty: FlashcardDifficulty) => {
    setFlashcards(prev => prev.map(card => {
      if (card.id !== id) return card;
      const result = calculateNextReview(card, difficulty);
      return {
        ...card,
        ...result,
        lastReviewedDate: Date.now(),
      };
    }));
  };

  // --- SYSTEM & BACKUP ---
  const exportWorkspaceJson = () => {
    const data = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      subjects,
      folders,
      flashcards,
      files,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `faxaudier_backup_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const importWorkspaceJson = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.subjects && Array.isArray(data.subjects)) {
        setSubjects(data.subjects);
      }
      if (data.folders && Array.isArray(data.folders)) {
        setFolders(data.folders);
      }
      if (data.flashcards && Array.isArray(data.flashcards)) {
        setFlashcards(data.flashcards);
      }
      if (data.files && Array.isArray(data.files)) {
        setFiles(data.files);
      }
      return true;
    } catch (e) {
      console.error('Import error', e);
      return false;
    }
  };

  const resetToDefaultData = () => {
    StorageService.clearAllFiles();
    localStorage.clear();
    setSubjects(SAMPLE_SUBJECTS);
    setFolders(SAMPLE_FOLDERS);
    setFlashcards(SAMPLE_FLASHCARDS);
    setFiles(SAMPLE_FILES);
    setLanguageState('de');
  };

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
        subjects,
        folders,
        flashcards,
        files,
        addSubject,
        updateSubject,
        deleteSubject,
        addFolder,
        updateFolder,
        deleteFolder,
        uploadFile,
        updateFile,
        deleteFile,
        markFileAccessed,
        getFileDataUrl,
        addFlashcard,
        updateFlashcard,
        deleteFlashcard,
        reviewFlashcard,
        exportWorkspaceJson,
        importWorkspaceJson,
        resetToDefaultData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
