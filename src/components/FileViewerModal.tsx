import React, { useState, useEffect } from 'react';
import { StudyFile } from '../types';
import { useApp } from '../context/AppContext';
import { X, Download, FileText, ExternalLink, ZoomIn, ZoomOut, AlertCircle } from './Icons';

interface FileViewerModalProps {
  file: StudyFile | null;
  onClose: () => void;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({ file, onClose }) => {
  const { getFileDataUrl, t } = useApp();
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [zoom, setZoom] = useState(100);

  useEffect(() => {
    if (!file) {
      setDataUrl(null);
      return;
    }
    setLoading(true);
    getFileDataUrl(file.id).then((url) => {
      setDataUrl(url);
      setLoading(false);
    });
  }, [file]);

  if (!file) return null;

  const handleDownload = () => {
    if (!dataUrl) {
      // Fallback synthetic download if dataUrl not available
      const blob = new Blob([`Faxaudier Document: ${file.name}\nSize: ${(file.size / 1024).toFixed(1)} KB`], { type: 'text/plain' });
      const dlUrl = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = dlUrl;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(dlUrl);
      return;
    }
    const a = document.createElement('a');
    a.href = dataUrl;
    a.download = file.name;
    a.click();
  };

  const isImage = file.type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg'].includes(file.extension);
  const isPdf = file.type === 'application/pdf' || file.extension === 'pdf';
  const isText = file.type.startsWith('text/') || ['txt', 'md', 'json', 'ts', 'js', 'py', 'sql', 'html', 'css'].includes(file.extension);

  // Decode text if dataUrl is text
  let textContent = '';
  if (isText && dataUrl) {
    try {
      if (dataUrl.startsWith('data:text/plain;charset=utf-8,')) {
        textContent = decodeURIComponent(dataUrl.replace('data:text/plain;charset=utf-8,', ''));
      } else if (dataUrl.includes('base64,')) {
        textContent = atob(dataUrl.split('base64,')[1]);
      }
    } catch {
      textContent = 'Inhalt konnte nicht formatiert werden.';
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[88vh] bg-[#131e17] border border-[#2e4736] rounded-2xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#24392b] bg-[#18261e]/90">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2 rounded-xl bg-[#223529] border border-[#35523f] text-[#55cf7f]">
              <FileText className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-base font-semibold text-white truncate max-w-md">
                {file.name}
              </h3>
              <p className="text-xs text-[#8ca393]">
                {(file.size / 1024).toFixed(1)} KB • {file.extension.toUpperCase()} • {t.files.uploadDate}: {new Date(file.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isImage && (
              <div className="flex items-center gap-1 bg-[#1d2d23] border border-[#2f4a38] rounded-lg px-2 py-1 mr-2 text-xs text-[#9eb6a5]">
                <button 
                  onClick={() => setZoom(z => Math.max(z - 20, 40))}
                  className="p-1 hover:text-white transition"
                  title="Zoom Out"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span>{zoom}%</span>
                <button 
                  onClick={() => setZoom(z => Math.min(z + 20, 250))}
                  className="p-1 hover:text-white transition"
                  title="Zoom In"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            )}

            <button
              onClick={handleDownload}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#24392b] hover:bg-[#314c3a] text-white border border-[#3b5944] text-xs font-medium transition shadow-sm"
              title="Download File"
            >
              <Download className="w-4 h-4 text-[#4ade80]" />
              <span className="hidden sm:inline">{t.subjects.download}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#92a899] hover:text-white hover:bg-[#25392d] transition"
              title={t.common.close}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Viewer Body */}
        <div className="flex-1 bg-[#0d1510] overflow-auto flex items-center justify-center p-4">
          {loading ? (
            <div className="flex flex-col items-center gap-3 text-[#7fa38a]">
              <div className="w-8 h-8 border-2 border-[#4ade80] border-t-transparent rounded-full animate-spin" />
              <p className="text-sm">{t.common.loading}</p>
            </div>
          ) : isPdf ? (
            dataUrl ? (
              <iframe
                src={dataUrl}
                title={file.name}
                className="w-full h-full rounded-lg border border-[#213527] bg-[#16211a]"
              />
            ) : (
              // If it's a sample PDF with no mock binary, show simulated PDF preview reader
              <div className="w-full max-w-3xl h-full p-8 bg-[#15221b] border border-[#2b4434] rounded-xl flex flex-col shadow-inner">
                <div className="flex items-center justify-between pb-4 border-b border-[#2b4434] mb-6">
                  <div className="flex items-center gap-2 text-sm text-[#4ade80] font-mono">
                    <span>PDF VIEWER</span>
                    <span>•</span>
                    <span>1 / 14</span>
                  </div>
                  <span className="text-xs px-2.5 py-1 rounded bg-[#203327] text-[#93b39d]">
                    Dokumentvorschau
                  </span>
                </div>
                <div className="flex-1 flex flex-col justify-center items-center text-center space-y-4 px-6">
                  <div className="w-16 h-16 rounded-2xl bg-[#1c2e22] flex items-center justify-center text-[#4ade80] border border-[#34533e]">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h4 className="text-xl font-bold text-white">{file.name}</h4>
                  <p className="text-sm text-[#8ca393] max-w-lg leading-relaxed">
                    Dieses Dokument ist als Vorlesungsunterlage im Studienarbeitsbereich hinterlegt.
                    Du kannst es jederzeit lokal herunterladen oder eigene neue PDF-Dateien hochladen, die direkt vollständig interaktiv angezeigt werden.
                  </p>
                  <button
                    onClick={handleDownload}
                    className="mt-4 px-5 py-2.5 rounded-xl bg-[#2e4736] hover:bg-[#3c5d46] text-white border border-[#446a50] text-sm font-medium flex items-center gap-2 transition"
                  >
                    <Download className="w-4 h-4 text-[#4ade80]" />
                    {t.subjects.download} ({ (file.size / 1024).toFixed(0) } KB)
                  </button>
                </div>
              </div>
            )
          ) : isImage ? (
            dataUrl ? (
              <div className="overflow-auto max-h-full max-w-full flex items-center justify-center">
                <img
                  src={dataUrl}
                  alt={file.name}
                  style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'center' }}
                  className="rounded-lg max-h-[75vh] object-contain shadow-2xl transition-transform duration-150"
                />
              </div>
            ) : (
              <p className="text-[#849c8d]">Bild nicht verfügbar.</p>
            )
          ) : isText ? (
            <div className="w-full max-w-4xl h-full p-6 bg-[#121c15] border border-[#263c2d] rounded-xl overflow-auto font-mono text-sm leading-relaxed text-[#c6dbcd]">
              <pre className="whitespace-pre-wrap">{textContent || 'Kein Textinhalt verfügbar.'}</pre>
            </div>
          ) : (
            // Office / Binary preview placeholder
            <div className="max-w-md p-8 text-center bg-[#15221b] border border-[#2b4434] rounded-2xl flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#203126] text-[#4ade80] flex items-center justify-center mb-4 border border-[#334e3c]">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="text-lg font-semibold text-white mb-2">{file.name}</h4>
              <p className="text-sm text-[#8ba291] mb-6">
                {t.files.previewNotSupported}
              </p>
              <button
                onClick={handleDownload}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2f4937] hover:bg-[#3e5f48] text-white font-medium text-sm flex items-center justify-center gap-2 border border-[#43674f] transition shadow-lg"
              >
                <Download className="w-4 h-4 text-[#4ade80]" />
                {t.subjects.download}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
