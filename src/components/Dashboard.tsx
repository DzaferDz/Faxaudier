import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  GraduationCap, 
  Layers, 
  BookOpen, 
  Clock, 
  Plus, 
  Upload, 
  ChevronRight, 
  Flame, 
  Sparkles, 
  FileText, 
  FileCheck2, 
  TrendingUp, 
  FolderOpen 
} from './Icons';
import { StudyFile } from '../types';

interface DashboardProps {
  onNavigate: (tab: string, contextId?: string) => void;
  onOpenFile: (file: StudyFile) => void;
  onOpenNewCardModal: () => void;
  onOpenNewSubjectModal: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  onNavigate, 
  onOpenFile,
  onOpenNewCardModal,
  onOpenNewSubjectModal
}) => {
  const { t, subjects, flashcards, files } = useApp();

  const dueCards = flashcards.filter(c => c.nextReviewDate <= Date.now());
  const masteredCards = flashcards.filter(c => c.repetitions >= 3);
  const recentFiles = [...files].sort((a, b) => b.lastAccessed - a.lastAccessed).slice(0, 5);

  const retentionEstimate = flashcards.length > 0 
    ? Math.round((masteredCards.length / flashcards.length) * 100) 
    : 0;

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Hero Header */}
      <div className="relative overflow-hidden rounded-3xl p-8 bg-gradient-to-r from-[#17251d] via-[#1a2b21] to-[#121e17] border border-[#273d2f] shadow-2xl">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(circle_at_top_right,rgba(74,222,128,0.12),transparent_70%)] pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#24392b] border border-[#375440] text-xs font-medium text-[#4ade80]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Faxaudier • Smart Study Suite</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {t.dashboard.welcomeTitle}
            </h1>
            <p className="text-sm sm:text-base text-[#8ea896] max-w-xl">
              {t.dashboard.welcomeSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('studymode')}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-[#4ade80] to-[#22c55e] hover:from-[#3ecd74] hover:to-[#16a34a] text-[#0b160f] font-bold text-sm shadow-lg shadow-[#4ade80]/15 flex items-center gap-2 transition transform active:scale-95"
            >
              <GraduationCap className="w-5 h-5" />
              <span>{t.dashboard.startStudySession}</span>
              {dueCards.length > 0 && (
                <span className="ml-1 px-2 py-0.5 rounded-full bg-[#0b160f] text-[#4ade80] text-xs font-black">
                  {dueCards.length}
                </span>
              )}
            </button>

            <button
              onClick={onOpenNewSubjectModal}
              className="px-4 py-3 rounded-2xl bg-[#223529] hover:bg-[#2b4434] text-white border border-[#35523f] text-sm font-semibold flex items-center gap-2 transition"
            >
              <Plus className="w-4 h-4 text-[#4ade80]" />
              <span>{t.dashboard.newSubject}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#142018] border border-[#233729] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#849f8c]">{t.dashboard.totalSubjects}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{subjects.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1d2f23] border border-[#2d4937] flex items-center justify-center text-[#4ade80]">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#142018] border border-[#233729] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#849f8c]">{t.dashboard.totalCards}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{flashcards.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1d2f23] border border-[#2d4937] flex items-center justify-center text-[#2dd4bf]">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#142018] border border-[#233729] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#849f8c]">{t.dashboard.dueToday}</p>
            <h3 className="text-2xl font-bold text-[#4ade80] mt-1">{dueCards.length}</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#243a2b] border border-[#375a43] flex items-center justify-center text-[#4ade80]">
            <Flame className="w-6 h-6" />
          </div>
        </div>

        <div className="p-5 rounded-2xl bg-[#142018] border border-[#233729] shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-medium text-[#849f8c]">{t.dashboard.retentionRate}</p>
            <h3 className="text-2xl font-bold text-white mt-1">{retentionEstimate}%</h3>
          </div>
          <div className="w-12 h-12 rounded-xl bg-[#1d2f23] border border-[#2d4937] flex items-center justify-center text-[#a3e635]">
            <TrendingUp className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content 2-Column Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: My Subjects */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <FolderOpen className="w-5 h-5 text-[#4ade80]" />
              <span>{t.dashboard.mySubjects}</span>
            </h2>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-xs font-semibold text-[#8eb59a] hover:text-[#4ade80] flex items-center gap-1 transition"
            >
              <span>{t.dashboard.viewAllSubjects}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {subjects.map((subj) => {
              const subjCards = flashcards.filter(c => c.subjectId === subj.id);
              const subjFiles = files.filter(f => f.subjectId === subj.id);

              return (
                <div
                  key={subj.id}
                  onClick={() => onNavigate('subjects', subj.id)}
                  className="group p-5 rounded-2xl bg-[#142018] hover:bg-[#1a2b20] border border-[#223528] hover:border-[#385642] cursor-pointer transition-all duration-200 flex flex-col justify-between shadow-sm hover:shadow-lg"
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-mono font-semibold px-2.5 py-1 rounded-md bg-[#1f3024] text-[#84cf9b] border border-[#2f4937]">
                        {subj.code}
                      </span>
                      <span className="text-xs text-[#738f7c]">{subj.semester}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-[#4ade80] transition">
                      {subj.name}
                    </h3>
                    <p className="text-xs text-[#7c9785] line-clamp-2 mt-1.5 leading-relaxed">
                      {subj.description || 'Keine Beschreibung hinterlegt.'}
                    </p>
                  </div>

                  <div className="mt-5 pt-4 border-t border-[#1e3024] flex items-center justify-between text-xs text-[#8ca795]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Layers className="w-3.5 h-3.5 text-[#55c080]" />
                        {subjCards.length}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-[#2dd4bf]" />
                        {subjFiles.length}
                      </span>
                    </div>
                    <span className="text-[#55cf7f] group-hover:translate-x-1 transition flex items-center">
                      <ChevronRight className="w-4 h-4" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Quick Actions & Recent Files */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <div className="p-5 rounded-2xl bg-[#142018] border border-[#233729] space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider text-[#92a898]">
              {t.dashboard.quickActions}
            </h3>
            
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={onOpenNewCardModal}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1a2820] hover:bg-[#23372b] border border-[#2a4332] text-white text-xs font-semibold transition"
              >
                <div className="p-2 rounded-lg bg-[#273e30] text-[#4ade80]">
                  <Layers className="w-4 h-4" />
                </div>
                <span>{t.dashboard.newFlashcard}</span>
              </button>

              <button
                onClick={() => onNavigate('files')}
                className="w-full flex items-center gap-3 p-3 rounded-xl bg-[#1a2820] hover:bg-[#23372b] border border-[#2a4332] text-white text-xs font-semibold transition"
              >
                <div className="p-2 rounded-lg bg-[#273e30] text-[#2dd4bf]">
                  <Upload className="w-4 h-4" />
                </div>
                <span>{t.dashboard.uploadFile}</span>
              </button>
            </div>
          </div>

          {/* Recent Files */}
          <div className="p-5 rounded-2xl bg-[#142018] border border-[#233729] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#4ade80]" />
                <span>{t.dashboard.recentFiles}</span>
              </h3>
              <button
                onClick={() => onNavigate('files')}
                className="text-xs text-[#82a38d] hover:text-white transition"
              >
                {t.common.all}
              </button>
            </div>

            {recentFiles.length === 0 ? (
              <p className="text-xs text-[#799482] py-4 text-center">
                {t.dashboard.noRecentFiles}
              </p>
            ) : (
              <div className="space-y-2">
                {recentFiles.map((file) => (
                  <div
                    key={file.id}
                    onClick={() => onOpenFile(file)}
                    className="p-2.5 rounded-xl bg-[#18251e] hover:bg-[#203328] border border-[#223528] cursor-pointer transition flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <FileText className="w-4 h-4 text-[#4ade80] flex-shrink-0" />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-white truncate max-w-[170px] group-hover:text-[#4ade80] transition">
                          {file.name}
                        </p>
                        <p className="text-[10px] text-[#718b7a]">
                          {(file.size / 1024).toFixed(0)} KB • {file.extension.toUpperCase()}
                        </p>
                      </div>
                    </div>
                    <FileCheck2 className="w-4 h-4 text-[#44634f] group-hover:text-[#4ade80] transition" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
