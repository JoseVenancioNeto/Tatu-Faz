import { useState } from 'react';
import { Icons } from './Icons';
import { createRecordPDF, RecordItem } from '../utils/pdfGenerator';

interface GoogleDriveModalProps {
  record: RecordItem;
  onClose: () => void;
}

const STORAGE_DRIVE_TOKEN = 'tatufaz_gdrive_token';

export const GoogleDriveModal = ({ record, onClose }: GoogleDriveModalProps) => {
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'info' | 'error'>('info');
  const [isUploading, setIsUploading] = useState(false);
  const [showAdvancedApi, setShowAdvancedApi] = useState(false);
  const [accessToken, setAccessToken] = useState<string>(() => {
    try {
      return localStorage.getItem(STORAGE_DRIVE_TOKEN) || '';
    } catch {
      return '';
    }
  });

  const safeName = record.name.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Achado';
  const expectedFileName = `TATU_FAZ_${safeName}_${record.id}.pdf`;

  const handleShareToDriveApp = async () => {
    setIsUploading(true);
    setStatusMessage(null);
    try {
      const { doc, file, fileName } = createRecordPDF(record);

      // No celular (HTTPS), usa o menu nativo do sistema para enviar o arquivo direto ao App Google Drive
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `TATU FAZ - ${record.name}`,
          text: `Registro arqueológico: ${record.name} (${record.state}) - ${record.location}`
        });
        setStatusType('success');
        setStatusMessage('Arquivo enviado! Selecione "Salvar no Drive" no menu do celular.');
      } else {
        // Fallback para PC ou arquivo local (file://): baixa o PDF e abre o Google Drive
        doc.save(fileName);
        window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer');
        setStatusType('success');
        setStatusMessage(`PDF "${fileName}" baixado! O Google Drive foi aberto para você soltar o arquivo.`);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        const { doc, fileName } = createRecordPDF(record);
        doc.save(fileName);
        window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer');
        setStatusType('info');
        setStatusMessage(`PDF "${fileName}" salvo no aparelho e Google Drive aberto em nova aba.`);
      }
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadAndOpenDrive = () => {
    const { doc, fileName } = createRecordPDF(record);
    doc.save(fileName);
    window.open('https://drive.google.com/drive/my-drive', '_blank', 'noopener,noreferrer');
    setStatusType('success');
    setStatusMessage(`Relatório "${fileName}" baixado! Basta enviá-lo na aba do Google Drive aberta.`);
  };

  const handleDirectApiUpload = async () => {
    if (!accessToken.trim()) {
      setStatusType('error');
      setStatusMessage('Informe um Token de Acesso OAuth do Google Drive para upload direto via API.');
      return;
    }

    setIsUploading(true);
    setStatusMessage(null);
    try {
      localStorage.setItem(STORAGE_DRIVE_TOKEN, accessToken.trim());
    } catch {}

    try {
      const { blob, fileName } = createRecordPDF(record);
      const metadata = {
        name: fileName,
        mimeType: 'application/pdf',
        description: `Registro Arqueológico TATU FAZ - ${record.name} (${record.state}) - ${record.location}`
      };

      const form = new FormData();
      form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }));
      form.append('file', blob);

      const response = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id,name,webViewLink',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.trim()}`
          },
          body: form
        }
      );

      if (!response.ok) {
        throw new Error(`Status ${response.status}`);
      }

      const data = await response.json();
      setStatusType('success');
      setStatusMessage(`Upload concluído no Google Drive! Arquivo: ${data.name || fileName}`);
      if (data.webViewLink) {
        window.open(data.webViewLink, '_blank', 'noopener,noreferrer');
      }
    } catch {
      setStatusType('error');
      setStatusMessage('Token expirado ou inválido. Use o botão principal acima para salvar direto no Drive.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90dvh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-green-600 p-5 text-white rounded-t-2xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-white p-2 rounded-xl shadow-sm">
              <Icons.GoogleDrive />
            </div>
            <div>
              <h2 className="font-bold text-lg leading-tight">Salvar no Google Drive</h2>
              <p className="text-blue-100 text-xs">Backup na nuvem do relatório em PDF</p>
            </div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
            <Icons.X />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 space-y-4">
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Arquivo preparado para envio</p>
            <p className="text-gray-800 font-bold">{record.name}</p>
            <p className="text-gray-500 text-xs mt-0.5">{record.state} • {record.location}</p>
            <div className="mt-2 pt-2 border-t border-gray-200 flex items-center gap-2 text-xs text-blue-700 font-medium">
              <Icons.FileText />
              <span className="truncate">{expectedFileName}</span>
            </div>
          </div>

          {statusMessage && (
            <div
              className={`p-3 rounded-xl text-sm border ${
                statusType === 'success'
                  ? 'bg-green-50 text-green-800 border-green-200'
                  : statusType === 'error'
                  ? 'bg-red-50 text-red-800 border-red-200'
                  : 'bg-blue-50 text-blue-800 border-blue-200'
              }`}
            >
              {statusMessage}
            </div>
          )}

          <div className="space-y-2.5">
            <button
              type="button"
              onClick={handleShareToDriveApp}
              disabled={isUploading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 px-4 rounded-xl font-semibold shadow-md transition-all flex items-center justify-center gap-2.5"
            >
              <div className="bg-white p-1 rounded-md">
                <Icons.GoogleDrive />
              </div>
              <span>{isUploading ? 'Preparando PDF...' : 'Enviar para o App Google Drive'}</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadAndOpenDrive}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-3 px-4 rounded-xl font-medium text-sm transition-colors flex items-center justify-center gap-2"
            >
              <Icons.FileText />
              <span>Baixar PDF + Abrir Google Drive Web</span>
            </button>
          </div>

          {/* Opção avançada de API */}
          <div className="pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={() => setShowAdvancedApi(!showAdvancedApi)}
              className="text-xs text-gray-500 hover:text-gray-700 underline"
            >
              {showAdvancedApi ? 'Ocultar upload via Token de API' : 'Configurar Token OAuth (Upload Direto via API)'}
            </button>

            {showAdvancedApi && (
              <div className="mt-3 p-3 bg-gray-50 rounded-xl border border-gray-200 space-y-2">
                <label className="block text-xs text-gray-600 font-medium">
                  Token OAuth2 do Google Drive (escopo drive.file)
                </label>
                <input
                  type="password"
                  value={accessToken}
                  onChange={e => setAccessToken(e.target.value)}
                  placeholder="ya29.a0AfH6SM..."
                  className="w-full px-3 py-2 text-xs rounded-lg bg-white border border-gray-200 focus:border-blue-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={handleDirectApiUpload}
                  disabled={isUploading}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg text-xs font-semibold transition-colors"
                >
                  Enviar via API REST do Google Drive
                </button>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 text-gray-500 hover:text-gray-700 text-sm font-medium"
          >
            Concluir e Fechar
          </button>
        </div>
      </div>
    </div>
  );
};
