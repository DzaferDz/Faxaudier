export type Language = 'de' | 'bs' | 'en';

export interface Subject {
  id: string;
  name: string;
  code: string;
  color: string;
  description: string;
  semester: string;
  createdAt: number;
  iconName?: string;
}

export interface Folder {
  id: string;
  subjectId: string;
  parentId: string | null; // null means root of subject
  name: string;
  color?: string;
  createdAt: number;
}

export interface StudyFile {
  id: string;
  subjectId: string;
  folderId: string | null;
  name: string;
  size: number;
  type: string; // mime type
  extension: string;
  dataUrl?: string; // stored in IndexedDB or base64/blob
  lastAccessed: number;
  createdAt: number;
  tags?: string[];
}

export type FlashcardDifficulty = 'again' | 'hard' | 'good' | 'easy';

export interface Flashcard {
  id: string;
  subjectId: string;
  category: string;
  question: string;
  answer: string;
  hint?: string;
  // Spaced repetition state
  repetitions: number;
  intervalDays: number;
  easeFactor: number;
  nextReviewDate: number;
  lastReviewedDate?: number;
  createdAt: number;
}

export interface StudySessionStats {
  cardsReviewed: number;
  timeSpentSeconds: number;
  completedAt: number;
}

export interface AppNotification {
  id: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}
