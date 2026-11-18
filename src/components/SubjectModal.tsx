import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, BookOpen } from './Icons';
import { Subject } from '../types';

interface SubjectModalProps {
  subject?: Subject | null;
  onClose: () => void;
}

const PALETTE = [
  '#4ade80', // Emerald/light green
  '#2dd4bf', // Teal
  '#a3e635', // Lime/olive
  '#38bdf8', // Sky
  '#818cf8', // Indigo
  '#f472b6', // Pink
  '#fbbf24', // Amber
];

export const SubjectModal: React.FC<SubjectModalProps> = ({ subject, onClose }) => {
  const { t, addSubject, updateSubject } = useApp();

  const [name, setName] = useState(subject?.name || '');
  const [code, setCode] = useState(subject?.code || '');
  const [semester, setSemester] = useState(subject?.semester || 'Semester 1');
  const [description, setDescription] = useState(subject?.description || '');
  const [color, setColor] = useState(subject?.color || PALETTE[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (subject) {
      updateSubject(subject.id, {
        name: name.trim(),
        code: code.trim().toUpperCase() || 'MOD-101',
        semester: semester.trim(),
        description: description.trim(),
        color,
      });
    } else {
      addSubject({
        name: name.trim(),
        code: code.trim().toUpperCase() || 'MOD-101',
        semester: semester.trim(),
        description: description.trim(),
        color,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-md bg-[#131e17] border border-[#273d2f] rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#1f3125] pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#4ade80]" />
            <span>{subject ? t.subjects.editSubject : t.subjects.addSubject}</span>
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-[#7d9b87] hover:text-white hover:bg-[#1d2d22] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#8ca795]">{t.subjects.subjectName} *</label>
            <input
              type="text"
              required
              placeholder="z.B. Software Engineering"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Code & Semester */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="font-semibold text-[#8ca795]">{t.subjects.subjectCode}</label>
              <input
                type="text"
                placeholder="INF-201"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80] font-mono uppercase"
              />
            </div>
            <div className="space-y-1.5">
              <label className="font-semibold text-[#8ca795]">{t.subjects.semester}</label>
              <input
                type="text"
                placeholder="Semester 3"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80]"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="font-semibold text-[#8ca795]">{t.subjects.description}</label>
            <textarea
              rows={3}
              placeholder="Themenbereiche, Dozent, Prüfungsmodus..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-3 rounded-xl bg-[#18261e] border border-[#25392c] text-white focus:outline-none focus:border-[#4ade80]"
            />
          </div>

          {/* Color tag */}
          <div className="space-y-2">
            <label className="font-semibold text-[#8ca795]">{t.subjects.color}</label>
            <div className="flex items-center gap-2">
              {PALETTE.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full border-2 transition transform ${
                    color === c ? 'scale-110 border-white' : 'border-transparent hover:scale-105'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
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
