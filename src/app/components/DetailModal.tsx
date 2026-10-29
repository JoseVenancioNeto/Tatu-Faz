import { useState } from 'react';
import { Icons } from './Icons';
import { LoadingScreen } from './LoadingScreen';
import { createRecordPDF, RecordItem } from '../utils/pdfGenerator';

interface DetailModalProps {
  record: RecordItem | null;
  onClose: () => void;
  onDelete?: (id: number) => void;
  onSaveToGoogleDrive?: (record: RecordItem) => void;
}

export const DetailModal = ({ record, onClose, onDelete, onSaveToGoogleDrive }: DetailModalProps) => {
  const [isExporting, setIsExporting] = useState(false);

  if (!record) return null;
  
  const exportPDF = async () => {
    setIsExporting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      const { doc, file, fileName } = createRecordPDF(record);
      const isNativeApk = Boolean((window as any).Capacitor?.isNativePlatform?.());
      if (isNativeApk && navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: fileName,
          text: `Relatório PDF - ${record.name}`
        });
      } else {
        doc.save(fileName);
      }
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        console.error('Erro ao exportar PDF:', err);
        alert('Não foi possível gerar o PDF.');
      }
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-white flex flex-col animate-fade max-w-md mx-auto h-app-screen">
      <div className="bg-white px-4 py-4 shadow-sm flex items-center justify-between flex-none border-b border-gray-100">
        <button onClick={onClose} className="text-blue-600 flex items-center gap-1"><Icons.ArrowLeft /> Voltar</button>
        <h3 className="text-gray-800">Detalhes</h3>
        {onDelete ? (
          <button
            onClick={() => {
              if (confirm('Deseja excluir este registro?')) {
                onDelete(record.id);
              }
            }}
            className="text-gray-400 hover:text-red-500 text-sm transition-colors"
            title="Excluir registro"
          >
            Excluir
          </button>
        ) : (
          <div className="w-10"></div>
        )}
      </div>
      <div id="detail-content" className="flex-1 overflow-y-auto p-6 bg-gray-50">
        <h2 className="text-gray-800 mb-2">{record.name}</h2>
        <div className="flex gap-2 mb-4 flex-wrap">
           <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded uppercase text-sm">{record.state}</span>
           <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded text-sm">ID: {record.id}</span>
           {record.aiCategory && (
             <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm flex items-center gap-1">
               <span>🤖</span> {record.aiCategory}
             </span>
           )}
        </div>
        {record.aiCategory && (
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-4 rounded-xl border border-purple-200 mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xl">💡</span>
              <h4 className="text-purple-800 font-semibold">Catalogação Sugerida por IA</h4>
            </div>
            <p className="text-purple-700 text-sm">Este achado foi categorizado automaticamente como <strong>{record.aiCategory}</strong> com base em análise de achados similares no banco de dados.</p>
          </div>
        )}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-200 mb-6">
           <h4 className="text-gray-400 uppercase mb-3">Detalhes Técnicos</h4>
           <p className="text-gray-700 leading-relaxed whitespace-pre-line">{record.details}</p>
           <div className="mt-4 pt-4 border-t border-gray-100">
             <h5 className="text-gray-400 uppercase">Localização GPS</h5>
             <p className="text-gray-600 bg-gray-50 p-2 rounded mt-1">{record.location}</p>
           </div>
        </div>
        {record.photos.length > 0 && (
          <div>
            <h4 className="text-gray-400 uppercase mb-3">Fotos Anexadas</h4>
            <div className="grid grid-cols-2 gap-3">
              {record.photos.map((src, i) => <img key={i} src={src} className="rounded-xl shadow-sm w-full h-32 object-cover border border-gray-200" alt="evidencia" />)}
            </div>
          </div>
        )}
      </div>
      <div className="p-4 border-t flex-none bg-white space-y-2.5 pb-safe-nav">
        <button
          id="pdf-btn"
          onClick={exportPDF}
          disabled={isExporting}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl shadow flex justify-center items-center gap-2 transition-colors"
        >
          <Icons.FileText /> Exportar PDF
        </button>
        {onSaveToGoogleDrive && (
          <button
            type="button"
            onClick={() => onSaveToGoogleDrive(record)}
            className="w-full bg-white hover:bg-blue-50 text-gray-800 py-3 rounded-xl shadow-sm border-2 border-blue-500 flex justify-center items-center gap-2.5 font-semibold transition-colors"
          >
            <Icons.GoogleDrive /> Salvar no Google Drive
          </button>
        )}
      </div>
      {isExporting && <LoadingScreen message="Gerando relatório PDF..." />}
    </div>
  );
};
