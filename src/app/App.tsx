import { useState, useEffect } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { RegisterTab } from './components/RegisterTab';
import { ScanTab } from './components/ScanTab';
import { RecordsTab } from './components/RecordsTab';
import { DetailModal } from './components/DetailModal';
import { AISuggestionModal } from './components/AISuggestionModal';
import { GoogleDriveModal } from './components/GoogleDriveModal';
import { HelpTab } from './components/HelpTab';
import { NavButton } from './components/NavButton';
import { LoadingScreen } from './components/LoadingScreen';
import { Icons } from './components/Icons';
import logoTatu from 'figma:asset/23ffbde6989eb8658b29612ff6820f6e8ef0b876.png';
import bgPattern from 'figma:asset/95f241c6690c0b5cceb7872c15b6d0b38dffbf80.png';

export interface Record {
  id: number;
  name: string;
  state: string;
  location: string;
  photos: string[];
  details: string;
  fullData?: any;
  aiCategory?: string;
  createdAt?: string;
}

type TabType = 'register' | 'scan' | 'records' | 'help';

const STORAGE_KEY_RECORDS = 'tatufaz_records_v1';
const STORAGE_KEY_AUTH = 'tatufaz_logged_in_v1';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEY_AUTH) === 'true';
    } catch {
      return false;
    }
  });
  const [activeTab, setActiveTab] = useState<TabType>('register');
  const [records, setRecords] = useState<Record[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECORDS);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [selectedRecord, setSelectedRecord] = useState<Record | null>(null);
  const [aiSuggestionRecord, setAiSuggestionRecord] = useState<Record | null>(null);
  const [googleDriveRecord, setGoogleDriveRecord] = useState<Record | null>(null);
  const [openDriveAfterAI, setOpenDriveAfterAI] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(null);
  const [pendingScanPhoto, setPendingScanPhoto] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
    } catch (e) {
      console.error('Erro ao salvar registros no armazenamento local:', e);
    }
  }, [records]);

  const handleLogin = () => {
    setLoadingMessage('Entrando no TATU FAZ...');
    setTimeout(() => {
      setIsLoggedIn(true);
      try {
        localStorage.setItem(STORAGE_KEY_AUTH, 'true');
      } catch {}
      setLoadingMessage(null);
    }, 900);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    try {
      localStorage.removeItem(STORAGE_KEY_AUTH);
    } catch {}
  };

  const handleSaveRecord = (record: Record, saveToDrive = false) => {
    setLoadingMessage(
      saveToDrive
        ? 'Salvando achado e preparando Google Drive...'
        : 'Salvando achado e analisando com IA...'
    );
    const newRecord: Record = {
      ...record,
      id: Date.now(),
      createdAt: new Date().toLocaleString('pt-BR'),
    };

    setTimeout(() => {
      setRecords(prev => [newRecord, ...prev]);
      setLoadingMessage(null);
      setOpenDriveAfterAI(saveToDrive);
      setAiSuggestionRecord(newRecord);
    }, 1100);
  };

  const handleDeleteRecord = (id: number) => {
    setRecords(prev => prev.filter(r => r.id !== id));
    setSelectedRecord(null);
  };

  const handleApplyAISuggestion = (category: string) => {
    if (aiSuggestionRecord) {
      const updatedRecord = { ...aiSuggestionRecord, aiCategory: category };
      setRecords(prev => prev.map(r => (r.id === updatedRecord.id ? updatedRecord : r)));
      setAiSuggestionRecord(null);
      setActiveTab('records');
      if (openDriveAfterAI) {
        setOpenDriveAfterAI(false);
        setGoogleDriveRecord(updatedRecord);
      }
    }
  };

  const handleCloseAISuggestion = () => {
    const current = aiSuggestionRecord;
    setAiSuggestionRecord(null);
    setActiveTab('records');
    if (openDriveAfterAI && current) {
      setOpenDriveAfterAI(false);
      setGoogleDriveRecord(current);
    }
  };

  const handleCaptureScanToRegister = (dataUrl: string) => {
    setPendingScanPhoto(dataUrl);
    setActiveTab('register');
  };

  if (!isLoggedIn) {
    return (
      <>
        <LoginScreen onLogin={handleLogin} />
        {loadingMessage && <LoadingScreen message={loadingMessage} />}
      </>
    );
  }

  return (
    <div 
      className="flex flex-col h-app-screen max-w-md mx-auto shadow-2xl relative overflow-hidden"
      style={{
        backgroundImage: `url(${bgPattern})`,
        backgroundSize: '400px',
        backgroundRepeat: 'repeat',
        backgroundPosition: 'center'
      }}
    >
      {/* Overlay suave para não poluir visualmente */}
      <div className="absolute inset-0 bg-white/85 z-0"></div>
      
      <header className="bg-white/95 backdrop-blur-sm px-6 py-4 shadow-sm z-20 flex items-center justify-between flex-none relative">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-amber-700 overflow-hidden border-2 border-amber-900">
             <img 
               src={logoTatu} 
               alt="Logo TATU FAZ" 
               className="w-full h-full object-cover"
             />
          </div>
          <span className="text-gray-800 tracking-tight text-2xl font-black" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>TATU FAZ</span>
        </div>
        <button onClick={handleLogout} title="Sair" className="text-gray-400 hover:text-red-500 transition-colors">
          <Icons.LogOut />
        </button>
      </header>

      <main className="flex-1 overflow-y-auto relative z-10">
        {activeTab === 'register' && (
          <RegisterTab 
            onSave={handleSaveRecord} 
            initialPhoto={pendingScanPhoto}
            onConsumeInitialPhoto={() => setPendingScanPhoto(null)}
          />
        )}
        {activeTab === 'scan' && (
          <ScanTab onUseScanInRecord={handleCaptureScanToRegister} />
        )}
        {activeTab === 'records' && (
          <RecordsTab records={records} onViewDetail={setSelectedRecord} />
        )}
        {activeTab === 'help' && <HelpTab />}
      </main>

      <nav className="bg-white/95 backdrop-blur-sm border-t border-gray-200 flex-none z-30 pb-safe-nav relative">
        <div className="flex justify-around items-center px-2 pt-2">
          <NavButton 
            icon={<Icons.Camera />} 
            label="Novo" 
            active={activeTab === 'register'} 
            onClick={() => setActiveTab('register')} 
          />
          <NavButton 
            icon={<Icons.Box />} 
            label="3D" 
            active={activeTab === 'scan'} 
            onClick={() => setActiveTab('scan')} 
          />
          <NavButton 
            icon={<Icons.List />} 
            label="Lista" 
            active={activeTab === 'records'} 
            onClick={() => setActiveTab('records')} 
          />
          <NavButton 
            icon={<Icons.Help />} 
            label="Ajuda" 
            active={activeTab === 'help'} 
            onClick={() => setActiveTab('help')} 
          />
        </div>
      </nav>

      {selectedRecord && (
        <DetailModal 
          record={selectedRecord} 
          onClose={() => setSelectedRecord(null)} 
          onDelete={handleDeleteRecord}
          onSaveToGoogleDrive={(rec) => setGoogleDriveRecord(rec)}
        />
      )}
      {aiSuggestionRecord && (
        <AISuggestionModal 
          record={aiSuggestionRecord}
          allRecords={records}
          onClose={handleCloseAISuggestion}
          onApplySuggestion={handleApplyAISuggestion}
        />
      )}
      {googleDriveRecord && (
        <GoogleDriveModal
          record={googleDriveRecord}
          onClose={() => setGoogleDriveRecord(null)}
        />
      )}
      {loadingMessage && <LoadingScreen message={loadingMessage} />}
    </div>
  );
}
