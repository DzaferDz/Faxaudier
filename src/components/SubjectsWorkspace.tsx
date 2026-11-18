import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  FolderPlus, 
  FileUp, 
  ChevronRight, 
  Folder, 
  FileText, 
  Trash2, 
  Edit3, 
  Eye, 
  Download, 
  ArrowLeft, 
  Plus, 
  BookOpen, 
  Search, 
  MoreVertical, 
  Calendar 
} from './Icons';
import { Subject, StudyFile, Folder as FolderType } from '../types';

interface SubjectsWorkspaceProps {
  initialSubjectId?: string | null;
  onOpenFile: (file: StudyFile) => void;
  onOpenNewSubjectModal: (editSubject?: Subject) => void;
}

export const SubjectsWorkspace: React.FC<SubjectsWorkspaceProps> = ({
  initialSubjectId,
  onOpenFile,
  onOpenNewSubjectModal
}) => {
  const { 
    t, 
    subjects, 
    folders, 
    files, 
    deleteSubject, 
    addFolder, 
    deleteFolder, 
    uploadFile, 
    deleteFile,
    markFileAccessed 
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(
    initialSubjectId || (subjects.length > 0 ? subjects[0].id : null)
  );

  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const activeSubject = subjects.find(s => s.id === selectedSubjectId);

  // Filter folders and files for the active subject and folder level
  const activeFolders = folders.filter(f => 
    f.subjectId === selectedSubjectId && f.parentId === currentFolderId
  );

  const activeFiles = files.filter(f => {
    const matchesSubject = f.subjectId === selectedSubjectId;
    const matchesFolder = currentFolderId ? f.folderId === currentFolderId : f.folderId === null;
    const matchesSearch = searchQuery.trim() === '' || f.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesFolder && matchesSearch;
  });

  const currentFolder = folders.find(f => f.id === currentFolderId);

  const handleCreateFolder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim() || !selectedSubjectId) return;

    addFolder({
      name: newFolderName.trim(),
      subjectId: selectedSubjectId,
      parentId: currentFolderId,
    });
    setNewFolderName('');
    setIsCreatingFolder(false);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !selectedSubjectId) return;
    const uploadList = Array.from(e.target.files);
    for (const f of uploadList) {
      await uploadFile(f, selectedSubjectId, currentFolderId);
    }
    e.target.value = '';
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (!selectedSubjectId || !e.dataTransfer.files) return;

    const droppedFiles = Array.from(e.dataTransfer.files);
    for (const f of droppedFiles) {
      await uploadFile(f, selectedSubjectId, currentFolderId);
    }
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            {t.subjects.title}
          </h1>
          <p className="text-xs sm:text-sm text-[#87a591] mt-1">
            {t.subjects.subtitle}
          </p>
        </div>

        <button
          onClick={() => onOpenNewSubjectModal()}
          className="px-4 py-2.5 rounded-xl bg-[#284131] hover:bg-[#345540] text-[#55e88e] border border-[#3e664d] text-xs sm:text-sm font-semibold flex items-center gap-2 transition self-start sm:self-auto shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>{t.subjects.addSubject}</span>
        </button>
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Column: Subjects List */}
        <div className="lg:col-span-1 space-y-3">
          <h3 className="text-xs font-bold text-[#799482] uppercase tracking-wider px-1">
            {t.dashboard.mySubjects} ({subjects.length})
          </h3>

          <div className="space-y-2">
            {subjects.map((sub) => {
              const isSelected = sub.id === selectedSubjectId;
              const subFileCount = files.filter(f => f.subjectId === sub.id).length;

              return (
                <div
                  key={sub.id}
                  onClick={() => {
                    setSelectedSubjectId(sub.id);
                    setCurrentFolderId(null);
                  }}
                  className={`p-3.5 rounded-2xl cursor-pointer transition border flex items-center justify-between group ${
                    isSelected
                      ? 'bg-[#1e3224] border-[#3e664d] text-white shadow-md'
                      : 'bg-[#131e17] border-[#1f3025] text-[#9bb3a2] hover:bg-[#18261e] hover:text-white'
                  }`}
                >
                  <div className="min-w-0 flex items-center gap-3">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: sub.color || '#4ade80' }}
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold truncate group-hover:text-white transition">
                        {sub.name}
                      </p>
                      <p className="text-[10px] text-[#718b7a] font-mono">
                        {sub.code} • {subFileCount} {t.common.all.toLowerCase()}
                      </p>
                    </div>
                  </div>

                  <ChevronRight
                    className={`w-4 h-4 flex-shrink-0 transition ${
                      isSelected ? 'text-[#4ade80] translate-x-1' : 'text-[#3e5647]'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Active Subject Explorer */}
        <div className="lg:col-span-3 space-y-4">
          {activeSubject ? (
            <div className="bg-[#131e17] border border-[#223528] rounded-2xl p-6 space-y-6 shadow-xl">
              {/* Subject Title and Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-5 border-b border-[#1f3024] gap-4">
                <div>
                  <div className="flex items-center gap-3">
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: activeSubject.color }}
                    />
                    <h2 className="text-xl font-bold text-white">
                      {activeSubject.name}
                    </h2>
                    <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1e2f24] text-[#86e2a2] border border-[#2e4736]">
                      {activeSubject.code}
                    </span>
                  </div>
                  <p className="text-xs text-[#829c8b] mt-1">
                    {activeSubject.description}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onOpenNewSubjectModal(activeSubject)}
                    className="p-2 rounded-xl bg-[#1b2b20] hover:bg-[#25392d] text-[#90a898] hover:text-white border border-[#273d2f] transition"
                    title={t.subjects.editSubject}
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm(t.subjects.confirmDeleteSubject)) {
                        deleteSubject(activeSubject.id);
                        setSelectedSubjectId(subjects[0]?.id || null);
                      }
                    }}
                    className="p-2 rounded-xl bg-[#261719] hover:bg-[#381c20] text-[#f87171] border border-[#442327] transition"
                    title={t.subjects.deleteSubject}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Breadcrumb Path & Search */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-[#8ba493]">
                  <button
                    onClick={() => setCurrentFolderId(null)}
                    className={`hover:text-white font-medium transition ${
                      currentFolderId === null ? 'text-[#4ade80] font-bold' : ''
                    }`}
                  >
                    {t.subjects.rootFolder}
                  </button>

                  {currentFolder && (
                    <>
                      <ChevronRight className="w-3.5 h-3.5 text-[#46614f]" />
                      <span className="text-white font-semibold">
                        {currentFolder.name}
                      </span>
                    </>
                  )}
                </div>

                {/* Actions: Add Folder, Upload File */}
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#6c8574] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      placeholder={t.subjects.searchFiles}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl bg-[#18261e] border border-[#25392b] text-white text-xs placeholder-[#5f7867] focus:outline-none focus:border-[#4ade80] transition"
                    />
                  </div>

                  <button
                    onClick={() => setIsCreatingFolder(true)}
                    className="px-3 py-1.5 rounded-xl bg-[#1b2b20] hover:bg-[#253a2c] text-[#86e2a2] border border-[#2b4433] text-xs font-medium flex items-center gap-1.5 transition"
                  >
                    <FolderPlus className="w-3.5 h-3.5" />
                    <span>{t.subjects.newFolder}</span>
                  </button>

                  <label className="px-3 py-1.5 rounded-xl bg-[#2c4737] hover:bg-[#385945] text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition shadow-sm">
                    <FileUp className="w-3.5 h-3.5 text-[#4ade80]" />
                    <span>{t.files.dropzoneTitle.split(' ')[0]}</span>
                    <input
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileUpload}
                    />
                  </label>
                </div>
              </div>

              {/* Inline Folder Creation Form */}
              {isCreatingFolder && (
                <form
                  onSubmit={handleCreateFolder}
                  className="flex items-center gap-2 p-3 bg-[#17251d] border border-[#2e4736] rounded-xl animate-fadeIn"
                >
                  <Folder className="w-4 h-4 text-[#4ade80]" />
                  <input
                    type="text"
                    placeholder={t.subjects.folderName}
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    autoFocus
                    className="flex-1 bg-transparent border-none text-white text-xs focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-3 py-1 rounded-lg bg-[#4ade80] text-black text-xs font-bold"
                  >
                    {t.common.create}
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsCreatingFolder(false)}
                    className="px-3 py-1 rounded-lg bg-[#223528] text-[#8ca393] text-xs hover:text-white"
                  >
                    {t.common.cancel}
                  </button>
                </form>
              )}

              {/* Dropzone Container */}
              <div
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
                className={`transition-all rounded-2xl border-2 border-dashed p-4 ${
                  dragOver
                    ? 'border-[#4ade80] bg-[#1a2d20]'
                    : 'border-[#22382a] bg-[#0f1712]/50'
                }`}
              >
                {/* Folders List */}
                {activeFolders.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-[11px] font-bold text-[#6d8876] uppercase tracking-wider mb-2">
                      {t.subjects.foldersAndFiles.split('&')[0]}
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                      {activeFolders.map((folder) => {
                        const countInFolder = files.filter(f => f.folderId === folder.id).length;
                        return (
                          <div
                            key={folder.id}
                            onClick={() => setCurrentFolderId(folder.id)}
                            className="p-3 rounded-xl bg-[#16241c] hover:bg-[#1d3025] border border-[#24392b] hover:border-[#385943] cursor-pointer flex items-center justify-between group transition"
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <Folder className="w-4 h-4 text-[#4ade80] flex-shrink-0 group-hover:scale-110 transition-transform" />
                              <div className="min-w-0">
                                <p className="text-xs font-semibold text-white truncate">
                                  {folder.name}
                                </p>
                                <p className="text-[10px] text-[#6e8a77]">
                                  {countInFolder} {t.common.all.toLowerCase()}
                                </p>
                              </div>
                            </div>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(t.subjects.confirmDeleteFolder)) {
                                  deleteFolder(folder.id);
                                }
                              }}
                              className="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-[#2f1f22] text-[#e57373] transition"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Files List */}
                <div>
                  <h4 className="text-[11px] font-bold text-[#6d8876] uppercase tracking-wider mb-2">
                    {t.files.title} ({activeFiles.length})
                  </h4>

                  {activeFiles.length === 0 ? (
                    <div className="py-12 text-center flex flex-col items-center justify-center text-[#688270]">
                      <FileText className="w-10 h-10 mb-2 stroke-[1.5] text-[#344d3d]" />
                      <p className="text-xs max-w-sm">
                        {t.subjects.emptyFolder}
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {activeFiles.map((file) => (
                        <div
                          key={file.id}
                          onClick={() => {
                            markFileAccessed(file.id);
                            onOpenFile(file);
                          }}
                          className="p-3 rounded-xl bg-[#15231a] hover:bg-[#1c2e22] border border-[#213528] hover:border-[#385943] cursor-pointer flex items-center justify-between group transition"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="p-2 rounded-lg bg-[#203226] border border-[#2f4837] text-[#4ade80]">
                              <FileText className="w-4 h-4" />
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold text-white truncate group-hover:text-[#4ade80] transition max-w-[200px]">
                                {file.name}
                              </p>
                              <p className="text-[10px] text-[#718c7a]">
                                {(file.size / 1024).toFixed(0)} KB • {file.extension.toUpperCase()}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                markFileAccessed(file.id);
                                onOpenFile(file);
                              }}
                              className="p-1.5 rounded-lg hover:bg-[#25392d] text-[#86e2a2] transition"
                              title={t.subjects.preview}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`${t.subjects.delete} ${file.name}?`)) {
                                  deleteFile(file.id);
                                }
                              }}
                              className="p-1.5 rounded-lg hover:bg-[#321c1f] text-[#f87171] transition"
                              title={t.subjects.delete}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#131e17] border border-[#223528] rounded-2xl p-12 text-center text-[#7b9885]">
              <p>{t.subjects.noSubjects}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
