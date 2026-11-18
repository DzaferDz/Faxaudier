import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FileBox, 
  Search, 
  Upload, 
  Eye, 
  Download, 
  Trash2, 
  FileText, 
  Filter, 
  CheckCircle2 
} from './Icons';
import { StudyFile } from '../types';

interface AllFilesViewProps {
  onOpenFile: (file: StudyFile) => void;
}

export const AllFilesView: React.FC<AllFilesViewProps> = ({ onOpenFile }) => {
  const { t, files, subjects, deleteFile, uploadFile, markFileAccessed } = useApp();
  const [search, setSearch] = useState('');
  const [filterExt, setFilterExt] = useState('all');
  const [targetSubjectId, setTargetSubjectId] = useState<string>(subjects[0]?.id || '');

  const extensions = Array.from(new Set(files.map(f => f.extension.toLowerCase()))).filter(Boolean);

  const filteredFiles = files.filter(f => {
    const matchesSearch = 
      search.trim() === '' || 
      f.name.toLowerCase().includes(search.toLowerCase());
    const matchesExt = filterExt === 'all' || f.extension.toLowerCase() === filterExt.toLowerCase();
    return matchesSearch && matchesExt;
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !targetSubjectId) return;
    const fileList = Array.from(e.target.files);
    for (const f of fileList) {
      await uploadFile(f, targetSubjectId, null);
    }
    e.target.value = '';
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>{t.files.title}</span>
            <span className="text-xs px-2.5 py-1 rounded-full bg-[#1e3427] text-[#4ade80] border border-[#31573f] font-mono font-bold">
              {files.length}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#87a591] mt-1">
            {t.files.subtitle}
          </p>
        </div>

        {/* Global Upload Button */}
        {subjects.length > 0 && (
          <div className="flex items-center gap-2">
            <select
              value={targetSubjectId}
              onChange={(e) => setTargetSubjectId(e.target.value)}
              className="px-3 py-2 rounded-xl bg-[#1b2b20] border border-[#2b4433] text-white text-xs focus:outline-none focus:border-[#4ade80]"
            >
              {subjects.map(s => (
                <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
              ))}
            </select>

            <label className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#4ade80] to-[#22c55e] text-black font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-md hover:from-[#3ecd74] transition">
              <Upload className="w-4 h-4" />
              <span>{t.dashboard.uploadFile}</span>
              <input type="file" multiple className="hidden" onChange={handleUpload} />
            </label>
          </div>
        )}
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl bg-[#142018] border border-[#233729] flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-[#799984]" />
          <select
            value={filterExt}
            onChange={(e) => setFilterExt(e.target.value)}
            className="px-3 py-2 rounded-xl bg-[#1a2920] border border-[#2a4433] text-white text-xs font-medium focus:outline-none focus:border-[#4ade80] transition"
          >
            <option value="all">{t.files.filterAll}</option>
            {extensions.map(ext => (
              <option key={ext} value={ext}>.{ext.toUpperCase()}</option>
            ))}
          </select>
        </div>

        <div className="relative min-w-[240px]">
          <Search className="w-3.5 h-3.5 text-[#6c8574] absolute left-3 top-3" />
          <input
            type="text"
            placeholder={t.files.searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-3 py-2 rounded-xl bg-[#1a2920] border border-[#2a4433] text-white text-xs placeholder-[#5f7867] focus:outline-none focus:border-[#4ade80] transition"
          />
        </div>
      </div>

      {/* Files List Table / Grid */}
      {filteredFiles.length === 0 ? (
        <div className="py-20 text-center rounded-2xl bg-[#131e17] border border-[#223528] flex flex-col items-center justify-center p-6 text-[#75917e]">
          <FileBox className="w-12 h-12 stroke-[1.5] text-[#2c4434] mb-3" />
          <p className="text-sm font-medium">{t.dashboard.noRecentFiles}</p>
        </div>
      ) : (
        <div className="rounded-2xl bg-[#131e17] border border-[#223528] overflow-hidden shadow-lg">
          <div className="divide-y divide-[#1e3024]">
            {filteredFiles.map((file) => {
              const subj = subjects.find(s => s.id === file.subjectId);

              return (
                <div
                  key={file.id}
                  onClick={() => {
                    markFileAccessed(file.id);
                    onOpenFile(file);
                  }}
                  className="p-4 hover:bg-[#18261e] cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group transition"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="p-2.5 rounded-xl bg-[#1f3024] border border-[#2e4737] text-[#4ade80] flex-shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-white truncate group-hover:text-[#4ade80] transition">
                        {file.name}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-[#718b7a]">
                        <span 
                          className="font-mono text-[11px] font-semibold"
                          style={{ color: subj?.color || '#4ade80' }}
                        >
                          {subj?.name} ({subj?.code})
                        </span>
                        <span>•</span>
                        <span>{(file.size / 1024).toFixed(1)} KB</span>
                        <span>•</span>
                        <span>{new Date(file.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto opacity-80 group-hover:opacity-100 transition">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        markFileAccessed(file.id);
                        onOpenFile(file);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#223528] hover:bg-[#2c4434] text-[#86e2a2] border border-[#304b39] text-xs font-medium flex items-center gap-1.5 transition"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>{t.subjects.preview}</span>
                    </button>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (window.confirm(`${t.subjects.delete} ${file.name}?`)) {
                          deleteFile(file.id);
                        }
                      }}
                      className="p-2 rounded-xl hover:bg-[#341b1f] text-[#f87171] transition"
                      title={t.subjects.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
