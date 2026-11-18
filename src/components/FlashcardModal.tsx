import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { X, Sparkles } from './Icons';
import { Flashcard } from '../types';

interface FlashcardModalProps {
  card?: Flashcard | null;
  onClose: () => void;
}

export const FlashcardModal: React.FC<FlashcardModalProps> = ({ card, onClose }) => {
  const { t, subjects, addFlashcard, updateFlashcard } = useApp();

  const [subjectId, setSubjectId] = useState(card?.subjectId || subjects[0]?.id || '');
  const [category, setCategory] = useState(card?.category || '');
  const [question, setQuestion] = useState(card?.question || '');
  const [answer, setAnswer] = useState(card?.answer || '');
  const [hint, setHint] = useState(card?.hint || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || !answer.trim() || !subjectId) return;

    if (card) {
      updateFlashcard(card.id, {
        subjectId,
        category: category.trim() || 'Allgemein',
        question: question.trim(),
        answer: answer.trim(),
        hint: hint.trim() || undefined,
      });
    } else {
      addFlashcard({
        subjectId,
        category: category.trim() || 'Allgemein',
        question: question.trim(),
        answer: answer.trim(),
        hint: hint.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#131e17] border border-[#273d2f] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f3125] pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#4ade80]" />
            <span>{card ? t.flashcards.editCard : t.flashcards.createCard}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7d9b87] hover:text-white hover:bg-[#1d2d22] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Subject selection */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#8ca795]">{t.flashcards.selectSubject}</label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80]"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>
          </div>

          {/* Category */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#8ca795]">{t.flashcards.category}</label>
            <input
              type="text"
              placeholder="z.B. Komplexität, Definitionen, Graphen"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Question */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#8ca795]">{t.flashcards.question} *</label>
            <textarea
              required
              rows={3}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Formuliere die Frage klar und prägnant..."
              className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Answer */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#8ca795]">{t.flashcards.answer} *</label>
            <textarea
              required
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Erklärung, Merksatz oder strukturierte Antwort..."
              className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Hint */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#8ca795]">{t.flashcards.hint}</label>
            <input
              type="text"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              placeholder="Gedankenstütze vor dem Aufdecken..."
              className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          <div className="pt-4 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#1c2c21] hover:bg-[#253b2d] text-[#8ea797] hover:text-white font-medium transition"
            >
              {t.common.cancel}
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-black font-bold shadow-md hover:from-[#3fce76] transition"
            >
              {t.common.save}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
