import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ArrowLeft, 
  RotateCw, 
  Sparkles, 
  CheckCircle2, 
  ChevronRight, 
  Clock, 
  HelpCircle, 
  Award, 
  Layers 
} from './Icons';
import { Flashcard, FlashcardDifficulty } from '../types';

interface StudySessionProps {
  subjectId?: string;
  onFinish: () => void;
}

export const StudySession: React.FC<StudySessionProps> = ({ subjectId, onFinish }) => {
  const { t, flashcards, subjects, reviewFlashcard } = useApp();

  // Pick cards: due cards first, or all for this subject
  const [sessionCards, setSessionCards] = useState<Flashcard[]>(() => {
    let pool = flashcards;
    if (subjectId) {
      pool = pool.filter(c => c.subjectId === subjectId);
    }
    // Prefer due cards, otherwise all
    const due = pool.filter(c => c.nextReviewDate <= Date.now());
    return due.length > 0 ? due : pool;
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [startTime] = useState(Date.now());
  const [reviewedCount, setReviewedCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentCard: Flashcard | undefined = sessionCards[currentIndex];
  const subject = currentCard ? subjects.find(s => s.id === currentCard.subjectId) : null;

  // Keyboard shortcut listener: Space to flip, 1-4 to rate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isCompleted || !currentCard) return;

      if (e.code === 'Space') {
        e.preventDefault();
        setIsFlipped(prev => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRate('again');
        if (e.key === '2') handleRate('hard');
        if (e.key === '3') handleRate('good');
        if (e.key === '4') handleRate('easy');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, isCompleted, currentCard]);

  const handleRate = (difficulty: FlashcardDifficulty) => {
    if (!currentCard) return;

    reviewFlashcard(currentCard.id, difficulty);
    setReviewedCount(prev => prev + 1);
    setIsFlipped(false);
    setShowHint(false);

    if (currentIndex + 1 < sessionCards.length) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsCompleted(true);
    }
  };

  const handleRestart = (forceAll: boolean = false) => {
    let pool = flashcards;
    if (subjectId) {
      pool = pool.filter(c => c.subjectId === subjectId);
    }
    if (!forceAll) {
      const due = pool.filter(c => c.nextReviewDate <= Date.now());
      pool = due.length > 0 ? due : pool;
    }
    setSessionCards(pool);
    setCurrentIndex(0);
    setIsFlipped(false);
    setShowHint(false);
    setIsCompleted(false);
  };

  const elapsedSeconds = Math.round((Date.now() - startTime) / 1000);
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Completion Screen
  if (isCompleted || sessionCards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto py-12 px-4 animate-fadeIn">
        <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-b from-[#17251d] to-[#121c16] border border-[#2b4434] shadow-2xl text-center space-y-6">
          <div className="w-20 h-20 rounded-3xl bg-[#22382a] border border-[#3c634a] mx-auto flex items-center justify-center text-[#4ade80] shadow-lg shadow-[#4ade80]/10">
            <Award className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {t.studySession.sessionComplete}
            </h2>
            <p className="text-sm text-[#8ba493] max-w-md mx-auto">
              {t.studySession.sessionSummary}
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto pt-2">
            <div className="p-4 rounded-2xl bg-[#142018] border border-[#23382a]">
              <p className="text-xs text-[#7d9b87]">{t.studySession.cardsCompleted}</p>
              <p className="text-2xl font-bold text-white mt-1">{reviewedCount}</p>
            </div>
            <div className="p-4 rounded-2xl bg-[#142018] border border-[#23382a]">
              <p className="text-xs text-[#7d9b87]">{t.studySession.timeSpent}</p>
              <p className="text-2xl font-bold text-[#4ade80] mt-1">{formatTime(elapsedSeconds)}</p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <button
              onClick={onFinish}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#24392b] hover:bg-[#2e4a37] text-white border border-[#35543f] text-sm font-semibold transition"
            >
              {t.studySession.backToDashboard}
            </button>
            <button
              onClick={() => handleRestart(true)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#4ade80] hover:bg-[#3ecd74] text-black text-sm font-bold shadow-md shadow-[#4ade80]/15 transition"
            >
              {t.studySession.studyAnyway}
            </button>
          </div>
        </div>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / sessionCards.length) * 100);

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fadeIn">
      {/* Top Session Bar */}
      <div className="flex items-center justify-between">
        <button
          onClick={onFinish}
          className="flex items-center gap-2 text-xs font-semibold text-[#829e8b] hover:text-white transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{t.common.back}</span>
        </button>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono font-medium text-[#7d9986]">
            {t.studySession.cardProgress
              .replace('{current}', String(currentIndex + 1))
              .replace('{total}', String(sessionCards.length))}
          </span>
          <div className="w-32 h-2 rounded-full bg-[#17251c] border border-[#233729] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#22c55e] to-[#4ade80] transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Subject and Category pill */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          {subject && (
            <span 
              className="text-xs font-bold font-mono px-2.5 py-0.5 rounded-lg border"
              style={{ 
                backgroundColor: '#16241b', 
                borderColor: '#294331', 
                color: subject.color || '#4ade80' 
              }}
            >
              {subject.name} ({subject.code})
            </span>
          )}
          <span className="text-xs text-[#7e9b88] bg-[#142018] px-2.5 py-0.5 rounded-lg border border-[#213527]">
            {currentCard.category}
          </span>
        </div>

        {currentCard.hint && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-[#8ca895] hover:text-[#4ade80] transition"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>{t.studySession.hintLabel}</span>
          </button>
        )}
      </div>

      {/* Flashcard Component */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="min-h-[360px] cursor-pointer p-8 sm:p-12 rounded-3xl bg-[#142119] hover:bg-[#17271d] border border-[#284232] shadow-2xl flex flex-col justify-between transition-all duration-200 select-none relative group"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-[#6e8a77]">
            <span className="uppercase font-bold tracking-wider text-[11px] text-[#4ade80]">
              {isFlipped ? t.flashcards.answer : t.flashcards.question}
            </span>
            <span className="text-[11px] opacity-70 group-hover:opacity-100 transition flex items-center gap-1">
              <RotateCw className="w-3.5 h-3.5" />
              <span>{t.studySession.flipInstruction}</span>
            </span>
          </div>

          {/* Card Text */}
          <div className="pt-4">
            <h3 className="text-xl sm:text-2xl font-semibold text-white leading-relaxed whitespace-pre-wrap">
              {isFlipped ? currentCard.answer : currentCard.question}
            </h3>
          </div>

          {/* Hint disclosure */}
          {showHint && currentCard.hint && !isFlipped && (
            <div className="mt-4 p-3.5 rounded-xl bg-[#1d2d22] border border-[#314c39] text-xs text-[#a4c9b0] animate-fadeIn">
              <strong>{t.studySession.hintLabel}:</strong> {currentCard.hint}
            </div>
          )}
        </div>

        {/* Footer flip indicator */}
        <div className="pt-6 border-t border-[#1f3326] flex items-center justify-between text-xs text-[#688571]">
          <span>
            {currentCard.repetitions > 0 
              ? `${currentCard.repetitions}x wiederholt (Intervall: ${currentCard.intervalDays} Tage)`
              : 'Neue Karte'
            }
          </span>
          <span className="font-mono text-[11px] text-[#4ade80]">
            [Space / Klick zum Umdrehen]
          </span>
        </div>
      </div>

      {/* Answer Rating Buttons (Shown when flipped) */}
      {isFlipped ? (
        <div className="space-y-3 animate-fadeIn">
          <p className="text-center text-xs font-medium text-[#84a38f]">
            {t.studySession.rateDifficulty}
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <button
              onClick={() => handleRate('again')}
              className="p-3.5 rounded-2xl bg-[#26171a] hover:bg-[#381c22] border border-[#482229] text-[#f87171] text-xs font-bold transition flex flex-col items-center gap-1 group shadow-sm"
            >
              <span>{t.studySession.difficulty.again}</span>
              <span className="text-[10px] opacity-60 font-mono">[Taste 1]</span>
            </button>

            <button
              onClick={() => handleRate('hard')}
              className="p-3.5 rounded-2xl bg-[#282117] hover:bg-[#3a2e1d] border border-[#483a24] text-[#fbbf24] text-xs font-bold transition flex flex-col items-center gap-1 group shadow-sm"
            >
              <span>{t.studySession.difficulty.hard}</span>
              <span className="text-[10px] opacity-60 font-mono">[Taste 2]</span>
            </button>

            <button
              onClick={() => handleRate('good')}
              className="p-3.5 rounded-2xl bg-[#17251d] hover:bg-[#1e3427] border border-[#2b4836] text-[#4ade80] text-xs font-bold transition flex flex-col items-center gap-1 group shadow-sm"
            >
              <span>{t.studySession.difficulty.good}</span>
              <span className="text-[10px] opacity-60 font-mono">[Taste 3]</span>
            </button>

            <button
              onClick={() => handleRate('easy')}
              className="p-3.5 rounded-2xl bg-[#152723] hover:bg-[#1c3832] border border-[#274e44] text-[#2dd4bf] text-xs font-bold transition flex flex-col items-center gap-1 group shadow-sm"
            >
              <span>{t.studySession.difficulty.easy}</span>
              <span className="text-[10px] opacity-60 font-mono">[Taste 4]</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="flex justify-center">
          <button
            onClick={() => setIsFlipped(true)}
            className="px-6 py-3 rounded-2xl bg-[#22372a] hover:bg-[#2d4937] text-white border border-[#375842] text-xs font-semibold flex items-center gap-2 transition shadow-md"
          >
            <RotateCw className="w-4 h-4 text-[#4ade80]" />
            <span>{t.studySession.showAnswer}</span>
          </button>
        </div>
      )}
    </div>
  );
};
