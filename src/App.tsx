import React, { useState } from 'react';
import { useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SubjectsWorkspace } from './components/SubjectsWorkspace';
import { FlashcardsManager } from './components/FlashcardsManager';
import { StudySession } from './components/StudySession';
import { AllFilesView } from './components/AllFilesView';
import { SettingsView } from './components/SettingsView';
import { FileViewerModal } from './components/FileViewerModal';
import { FlashcardModal } from './components/FlashcardModal';
import { SubjectModal } from './components/SubjectModal';
import { StudyFile, Flashcard, Subject } from './types';

export const AppContent: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [activeSubjectFilter, setActiveSubjectFilter] = useState<string | null>(null);

  // Modal States
  const [activeFileViewer, setActiveFileViewer] = useState<StudyFile | null>(null);
  const [editingCard, setEditingCard] = useState<Flashcard | null>(null);
  const [isCardModalOpen, setIsCardModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [studySessionSubjectId, setStudySessionSubjectId] = useState<string | undefined>(undefined);

  const handleNavigate = (tab: string, contextId?: string) => {
    if (tab === 'subjects' && contextId) {
      setActiveSubjectFilter(contextId);
    }
    setCurrentTab(tab);
  };

  const handleStartStudy = (subjectId?: string) => {
    setStudySessionSubjectId(subjectId);
    setCurrentTab('studymode');
  };

  const handleOpenCardModal = (card?: Flashcard) => {
    setEditingCard(card || null);
    setIsCardModalOpen(true);
  };

  const handleOpenSubjectModal = (subj?: Subject) => {
    setEditingSubject(subj || null);
    setIsSubjectModalOpen(true);
  };

  return (
    <div className="flex min-h-screen bg-[#0c140f] text-[#e3ece5]">
      {/* Sidebar Navigation */}
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 h-screen overflow-y-auto px-4 sm:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          {currentTab === 'dashboard' && (
            <Dashboard
              onNavigate={handleNavigate}
              onOpenFile={(f) => setActiveFileViewer(f)}
              onOpenNewCardModal={() => handleOpenCardModal()}
              onOpenNewSubjectModal={() => handleOpenSubjectModal()}
            />
          )}

          {currentTab === 'subjects' && (
            <SubjectsWorkspace
              initialSubjectId={activeSubjectFilter}
              onOpenFile={(f) => setActiveFileViewer(f)}
              onOpenNewSubjectModal={(subj) => handleOpenSubjectModal(subj)}
            />
          )}

          {currentTab === 'flashcards' && (
            <FlashcardsManager
              onStartStudy={handleStartStudy}
              onOpenCardModal={handleOpenCardModal}
            />
          )}

          {currentTab === 'studymode' && (
            <StudySession
              subjectId={studySessionSubjectId}
              onFinish={() => setCurrentTab('dashboard')}
            />
          )}

          {currentTab === 'files' && (
            <AllFilesView onOpenFile={(f) => setActiveFileViewer(f)} />
          )}

          {currentTab === 'settings' && <SettingsView />}
        </div>
      </main>

      {/* Modals */}
      <FileViewerModal
        file={activeFileViewer}
        onClose={() => setActiveFileViewer(null)}
      />

      {isCardModalOpen && (
        <FlashcardModal
          card={editingCard}
          onClose={() => {
            setIsCardModalOpen(false);
            setEditingCard(null);
          }}
        />
      )}

      {isSubjectModalOpen && (
        <SubjectModal
          subject={editingSubject}
          onClose={() => {
            setIsSubjectModalOpen(false);
            setEditingSubject(null);
          }}
        />
      )}
    </div>
  );
};

export default function App() {
  return <AppContent />;
}
