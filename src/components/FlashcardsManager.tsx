import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Plus, 
  Search, 
  Filter, 
  Trash2, 
  Edit3, 
  GraduationCap, 
  Sparkles, 
  HelpCircle, 
  Clock, 
  Layers, 
  ChevronDown 
} from './Icons';
import { Flashcard } from '../types';

interface FlashcardsManagerProps {
  onStartStudy: (subjectId?: string) => void;
  onOpenCardModal: (card?: Flashcard) => void;
}

export const FlashcardsManager: React.FC<FlashcardsManagerProps> = ({
  onStartStudy,
  onOpenCardModal
}) => {
  const { t, flashcards, subjects, deleteFlashcard } = useApp();
  const [selectedSubject, setSelectedSubject] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [onlyDue, setOnlyDue] = useState<boolean>(false);
  const [search, setSearch] = useState<string>('');

  // Extract all categories
  const categories = Array.from(new Set(flashcards.map(c => c.category))).filter(Boolean);

  const filteredCards = flashcards.filter(c => {
    const matchesSubject = selectedSubject === 'all' || c.subjectId === selectedSubject;
    const matchesCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchesDue = !onlyDue || c.nextReviewDate <= Date.now();
    const matchesSearch = 
      search.trim() === '' || 
      c.question.toLowerCase().includes(search.toLowerCase()) || 
      c.answer.toLowerCase().includes(search.toLowerCase());

    return matchesSubject && matchesCategory && matchesDue && matchesSearch;
  });

  const dueCount = flashcards.filter(c => c.nextReviewDate <= Date.now()).length;

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{t.flashcards.title}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#1e3427] text-[#4ade80] border border-[#31573f] font-mono font-bold">
              {flashcards.length}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#87a591] mt-1">
            {t.flashcards.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onStartStudy(selectedSubject !== 'all' ? selectedSubject : undefined)}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#4ade80] to-[#22c55e] hover:from-[#3fce76] hover:to-[#16a34a] text-black font-bold text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-[#4ade80]/15 transition"
          >
            <GraduationCap className="w-4 h-4" />
            <span>{t.flashcards.startLearning}</span>
            {dueCount > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-black text-[#4ade80] text-[10px] font-black">
                {dueCount}
              </span>
            )}
          </button>

          <button
            onClick={() => onOpenCardModal()}
            className="px-4 py-2.5 rounded-xl bg-[#22382b] hover:bg-[#2c4737] text-white border border-[#34533f] text-xs sm:text-sm font-semibold flex items-center gap-2 transition"
          >
            <Plus className="w-4 h-4 text-[#4ade80]" />
            <span>{t.flashcards.createCard}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-[#142018] border border-[#233729] flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex flex-wrap items-center gap-2.5 flex-1 min-w-[280px]">
          {/* Subject Filter */}
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#1a2920] border border-[#2a4433] text-white text-xs font-medium focus:outline-none focus:border-[#4ade80] transition"
          >
            <option value="all">{t.flashcards.allSubjects}</option>
            {subjects.map(s => (
              <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
            ))}
          </select>

          {/* Category Filter */}
          {categories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1a2920] border border-[#2a4433] text-white text-xs font-medium focus:outline-none focus:border-[#4ade80] transition"
            >
              <option value="all">{t.flashcards.allCategories}</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          )}

          {/* Due Only Toggle */}
          <button
            onClick={() => setOnlyDue(!onlyDue)}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition border ${
              onlyDue
                ? 'bg-[#274431] text-[#4ade80] border-[#3e664b]'
                : 'bg-[#1a2920] text-[#7d9b87] border-[#2a4433] hover:text-white'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>{t.flashcards.dueOnly}</span>
            {dueCount > 0 && (
              <span className="w-2 h-2 rounded-full bg-[#4ade80] animate-pulse"></span>
            )}
          </button>
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search className="w-3.5 h-3.5 text-[#6c8574] absolute left-3 top-3" />
          <input
            type="text"
            placeholder={t.common.search}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#1a2920] border border-[#2a4433] text-white text-xs placeholder-[#5f7867] focus:outline-none focus:border-[#4ade80] transition"
          />
        </div>
      </div>

      {/* Flashcards Grid */}
      {filteredCards.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#131e17] border border-[#223528] flex flex-col items-center justify-center p-6 text-[#75917e]">
          <Layers className="w-12 h-12 stroke-[1.5] text-[#2c4434] mb-3" />
          <p className="text-sm font-medium">{t.flashcards.emptyCards}</p>
          <button
            onClick={() => onOpenCardModal()}
            className="mt-4 px-4 py-2 rounded-xl bg-[#24392b] text-[#4ade80] text-xs font-bold border border-[#35523f] hover:bg-[#2d4635] transition"
          >
            {t.flashcards.createCard}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCards.map((card) => {
            const subject = subjects.find(s => s.id === card.subjectId);
            const isDue = card.nextReviewDate <= Date.now();

            return (
              <div
                key={card.id}
                className="p-5 rounded-2xl bg-[#142018] border border-[#233729] hover:border-[#385942] transition-all flex flex-col justify-between shadow-sm hover:shadow-lg group"
              >
                <div>
                  {/* Card top tags */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span 
                      className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border truncate max-w-[140px]"
                      style={{ 
                        backgroundColor: '#1b2a20', 
                        borderColor: '#2e4937', 
                        color: subject?.color || '#4ade80' 
                      }}
                    >
                      {subject?.code || 'GEN'}
                    </span>

                    <div className="flex items-center gap-1.5">
                      {isDue && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#263e2e] text-[#4ade80] font-bold border border-[#3a5d45]">
                          Fällig
                        </span>
                      )}
                      <span className="text-[10px] text-[#698472] bg-[#1a2820] px-2 py-0.5 rounded-full border border-[#233529]">
                        {card.category}
                      </span>
                    </div>
                  </div>

                  {/* Question */}
                  <h3 className="text-sm font-semibold text-white leading-snug mb-3">
                    {card.question}
                  </h3>

                  {/* Answer snippet */}
                  <p className="text-xs text-[#8ca393] line-clamp-3 bg-[#111a14] p-3 rounded-xl border border-[#1b2b20] leading-relaxed">
                    {card.answer}
                  </p>
                </div>

                {/* Card footer details & actions */}
                <div className="mt-4 pt-3 border-t border-[#1e3024] flex items-center justify-between text-xs text-[#718b7a]">
                  <span className="text-[10px]">
                    Wiederholungen: <strong className="text-white font-mono">{card.repetitions}</strong> • Intervall: <strong className="text-white font-mono">{card.intervalDays}d</strong>
                  </span>

                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition">
                    <button
                      onClick={() => onOpenCardModal(card)}
                      className="p-1.5 rounded-lg hover:bg-[#203327] text-[#93ae9b] hover:text-white transition"
                      title={t.flashcards.editCard}
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(t.flashcards.deleteCard + '?')) {
                          deleteFlashcard(card.id);
                        }
                      }}
                      className="p-1.5 rounded-lg hover:bg-[#2d1b1e] text-[#f87171] transition"
                      title={t.flashcards.deleteCard}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
