import React from 'react';
import { 
  BookOpen, 
  Layers, 
  FileBox, 
  GraduationCap, 
  Settings, 
  Compass,
  Sparkles
} from './Icons';
import { useApp } from '../context/AppContext';
import { Language } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, setCurrentTab }) => {
  const { t, language, setLanguage, flashcards, subjects } = useApp();

  const dueCardsCount = flashcards.filter(c => c.nextReviewDate <= Date.now()).length;

  const navItems = [
    { id: 'dashboard', label: t.nav.dashboard, icon: Compass },
    { id: 'subjects', label: t.nav.subjects, icon: BookOpen, badge: subjects.length },
    { id: 'flashcards', label: t.nav.flashcards, icon: Layers, badge: flashcards.length },
    { id: 'studymode', label: t.nav.studyMode, icon: GraduationCap, badge: dueCardsCount > 0 ? dueCardsCount : undefined, badgeColor: 'bg-emerald-500 text-black font-bold' },
    { id: 'files', label: t.nav.allFiles, icon: FileBox },
    { id: 'settings', label: t.nav.settings, icon: Settings },
  ];

  return (
    <aside className="w-64 bg-[#111c15] border-r border-[#1f3025] flex flex-col justify-between h-screen select-none z-30 sticky top-0">
      <div>
        {/* Brand Header */}
        <div className="p-6 border-b border-[#1b2b20] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b5e47] to-[#1c3024] border border-[#4d7b5d] flex items-center justify-center shadow-lg shadow-black/40">
              <span className="font-extrabold text-lg tracking-wider text-[#79e99e]">FX</span>
            </div>
            <div>
              <h1 className="font-bold text-lg text-white tracking-tight flex items-center gap-1.5">
                {t.appName}
                <Sparkles className="w-3.5 h-3.5 text-[#4ade80]" />
              </h1>
              <p className="text-[11px] text-[#7d9987] font-medium leading-none">
                Study Workspace
              </p>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1 mt-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'bg-[#22382b] text-[#55e88e] shadow-sm border border-[#355743]'
                    : 'text-[#9cb5a4] hover:bg-[#18261e] hover:text-[#d7e5dc]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-[#4ade80]' : 'text-[#7d9b87]'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge !== undefined && (
                  <span
                    className={`text-[11px] px-2 py-0.5 rounded-full ${
                      item.badgeColor || (isActive ? 'bg-[#2e4d3b] text-[#86efac]' : 'bg-[#18261e] text-[#7d9987]')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Language Switcher and Footer */}
      <div className="p-4 border-t border-[#1b2b20] bg-[#0e1711]/60">
        <div className="flex items-center justify-between bg-[#16231b] border border-[#23382c] rounded-xl p-1 mb-3">
          {(['de', 'bs', 'en'] as Language[]).map((lang) => (
            <button
              key={lang}
              onClick={() => setLanguage(lang)}
              className={`flex-1 py-1 text-xs font-semibold uppercase rounded-lg transition ${
                language === lang
                  ? 'bg-[#2c4737] text-[#4ade80] shadow-sm'
                  : 'text-[#799783] hover:text-white'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between text-[11px] text-[#698472] px-1">
          <span>Dark Forest Olive</span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
            Lokal aktiv
          </span>
        </div>
      </div>
    </aside>
  );
};
