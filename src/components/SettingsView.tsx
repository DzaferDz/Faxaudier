import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Settings as SettingsIcon, 
  Download, 
  Upload, 
  RotateCcw, 
  Palette, 
  Globe2, 
  Database, 
  CheckCircle2, 
  AlertTriangle, 
  Sparkles 
} from './Icons';
import { Language } from '../types';

export const SettingsView: React.FC = () => {
  const { 
    t, 
    language, 
    setLanguage, 
    exportWorkspaceJson, 
    importWorkspaceJson, 
    resetToDefaultData 
  } = useApp();

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3500);
  };

  const handleExport = () => {
    exportWorkspaceJson();
    showNotification(t.settings.exportSuccess);
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const success = importWorkspaceJson(content);
      if (success) {
        showNotification(t.settings.importSuccess);
      } else {
        alert('Ungültiges Backup-Dateiformat.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm(t.settings.resetConfirm)) {
      resetToDefaultData();
      showNotification(t.settings.resetSuccess);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-fadeIn">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>{t.settings.title}</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#87a591] mt-1">
          {t.settings.subtitle}
        </p>
      </div>

      {notification && (
        <div className="p-4 rounded-2xl bg-[#1b3425] border border-[#346244] text-[#86efac] flex items-center gap-2 text-sm animate-fadeIn">
          <CheckCircle2 className="w-5 h-5" />
          <span>{notification}</span>
        </div>
      )}

      {/* Language Section */}
      <div className="p-6 rounded-2xl bg-[#131e17] border border-[#233729] space-y-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1d2f23] border border-[#2d4937] text-[#4ade80]">
            <Globe2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{t.settings.languageSection}</h3>
            <p className="text-xs text-[#7e9b88]">{t.settings.selectLanguage}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          {[
            { code: 'de' as Language, title: 'Deutsch', sub: 'Standardsprache' },
            { code: 'bs' as Language, title: 'Bosanski', sub: 'Maternji jezik' },
            { code: 'en' as Language, title: 'English', sub: 'International' },
          ].map((item) => (
            <button
              key={item.code}
              onClick={() => setLanguage(item.code)}
              className={`p-4 rounded-xl border text-left transition ${
                language === item.code
                  ? 'bg-[#1e3427] border-[#4ade80] text-white shadow-md'
                  : 'bg-[#16231b] border-[#223528] text-[#8ea797] hover:bg-[#1b2b21] hover:text-white'
              }`}
            >
              <p className="text-sm font-bold">{item.title}</p>
              <p className="text-xs text-[#6e8a77] mt-0.5">{item.sub}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Storage and Backup Section */}
      <div className="p-6 rounded-2xl bg-[#131e17] border border-[#233729] space-y-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1d2f23] border border-[#2d4937] text-[#2dd4bf]">
            <Database className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{t.settings.storageSection}</h3>
            <p className="text-xs text-[#7e9b88] max-w-xl">{t.settings.storageDesc}</p>
          </div>
        </div>

        <div className="pt-2 flex flex-wrap gap-3">
          <button
            onClick={handleExport}
            className="px-4 py-2.5 rounded-xl bg-[#22382b] hover:bg-[#2c4737] text-white border border-[#34533f] text-xs font-semibold flex items-center gap-2 transition"
          >
            <Download className="w-4 h-4 text-[#4ade80]" />
            <span>{t.settings.exportData}</span>
          </button>

          <label className="px-4 py-2.5 rounded-xl bg-[#22382b] hover:bg-[#2c4737] text-white border border-[#34533f] text-xs font-semibold flex items-center gap-2 cursor-pointer transition">
            <Upload className="w-4 h-4 text-[#2dd4bf]" />
            <span>{t.settings.importData}</span>
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Theme Aesthetic Details */}
      <div className="p-6 rounded-2xl bg-[#131e17] border border-[#233729] space-y-4 shadow-lg">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#1d2f23] border border-[#2d4937] text-[#a3e635]">
            <Palette className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">{t.settings.aestheticTitle}</h3>
            <p className="text-xs text-[#7e9b88]">{t.settings.aestheticDesc}</p>
          </div>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <span className="w-8 h-8 rounded-xl bg-[#0c140f] border border-[#223528]" title="Forest Dark Background" />
          <span className="w-8 h-8 rounded-xl bg-[#131e17] border border-[#2d4937]" title="Olive Card Surface" />
          <span className="w-8 h-8 rounded-xl bg-[#253725] border border-[#3f5f43]" title="Olive Muted" />
          <span className="w-8 h-8 rounded-xl bg-[#4ade80] border border-[#6ee7b7]" title="Vibrant Sage Accent" />
          <span className="w-8 h-8 rounded-xl bg-[#2dd4bf] border border-[#5eead4]" title="Secondary Teal" />
        </div>
      </div>

      {/* Danger Zone: Reset */}
      <div className="p-6 rounded-2xl bg-[#1f1517] border border-[#3d2427] space-y-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-[#2b181b] border border-[#48252a] text-[#f87171]">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-[#fca5a5]">{t.settings.resetData}</h3>
            <p className="text-xs text-[#a87a80]">{t.settings.resetConfirm}</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          className="px-4 py-2.5 rounded-xl bg-[#361c20] hover:bg-[#482228] text-[#fca5a5] border border-[#53272d] text-xs font-bold flex items-center gap-2 transition"
        >
          <RotateCcw className="w-4 h-4" />
          <span>{t.settings.resetData}</span>
        </button>
      </div>
    </div>
  );
};
