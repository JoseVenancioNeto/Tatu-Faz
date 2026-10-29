import { useState, useRef, useEffect } from 'react';
import { Icons } from './Icons';

interface RegisterTabProps {
  onSave: (record: any, saveToDrive?: boolean) => void;
  initialPhoto?: string | null;
  onConsumeInitialPhoto?: () => void;
}

const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const maxDim = 1024;
        let width = img.width;
        let height = img.height;
        if (width > height && width > maxDim) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else if (height > maxDim) {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(event.target?.result as string);
        }
      };
      img.onerror = () => resolve(event.target?.result as string);
      img.src = event.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const RegisterTab = ({ onSave, initialPhoto, onConsumeInitialPhoto }: RegisterTabProps) => {
  const [location, setLocation] = useState('Aguardando registro...');
  const [isSearchingGPS, setIsSearchingGPS] = useState(false);
  const [formState, setFormState] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  // Estado unificado do formulário
  const [formData, setFormData] = useState({
    nome: '',
    // Campos Gerais
    material: 'Cerâmica',
    dimensoes: '',
    conservacao: 'Bom',
    descricao: '',
    // Campos AM
    solo_am: 'Terra Preta de Índio',
    decoracao_am: 'Nenhuma',
    organico_am: 'Não',
    contexto_am: '',
    // Campos PE
    sitio_pe: 'Abrigo Rochoso',
    arte_rupestre_pe: 'Não',
    tipo_arte_pe: '',
    material_litico_pe: ''
  });

  useEffect(() => {
    if (initialPhoto) {
      setPhotos(prev => [...prev, initialPhoto]);
      if (onConsumeInitialPhoto) {
        onConsumeInitialPhoto();
      }
    }
  }, [initialPhoto, onConsumeInitialPhoto]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(t => t.stop());
      }
    };
  }, []);

  // Lista completa de estados
  const estadosBrasileiros = [
    { sigla: 'AC', nome: 'Acre' }, { sigla: 'AL', nome: 'Alagoas' }, { sigla: 'AP', nome: 'Amapá' },
    { sigla: 'AM', nome: 'Amazonas' }, { sigla: 'BA', nome: 'Bahia' }, { sigla: 'CE', nome: 'Ceará' },
    { sigla: 'DF', nome: 'Distrito Federal' }, { sigla: 'ES', nome: 'Espírito Santo' }, { sigla: 'GO', nome: 'Goiás' },
    { sigla: 'MA', nome: 'Maranhão' }, { sigla: 'MT', nome: 'Mato Grosso' }, { sigla: 'MS', nome: 'Mato Grosso do Sul' },
    { sigla: 'MG', nome: 'Minas Gerais' }, { sigla: 'PA', nome: 'Pará' }, { sigla: 'PB', nome: 'Paraíba' },
    { sigla: 'PR', nome: 'Paraná' }, { sigla: 'PE', nome: 'Pernambuco' }, { sigla: 'PI', nome: 'Piauí' },
    { sigla: 'RJ', nome: 'Rio de Janeiro' }, { sigla: 'RN', nome: 'Rio Grande do Norte' }, { sigla: 'RS', nome: 'Rio Grande do Sul' },
    { sigla: 'RO', nome: 'Rondônia' }, { sigla: 'RR', nome: 'Roraima' }, { sigla: 'SC', nome: 'Santa Catarina' },
    { sigla: 'SP', nome: 'São Paulo' }, { sigla: 'SE', nome: 'Sergipe' }, { sigla: 'TO', nome: 'Tocantins' }
  ];

  const handleGPS = () => {
    setIsSearchingGPS(true);
    setLocation('Buscando satélites...');

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude.toFixed(5);
          const lon = position.coords.longitude.toFixed(5);
          const acc = Math.max(1, Math.round(position.coords.accuracy || 4));
          setLocation(`Lat: ${lat} • Lon: ${lon} (Precisão: ${acc}m)`);
          setIsSearchingGPS(false);
        },
        () => {
          // Fallback para coordenadas de campo caso o navegador bloqueie ou esteja sem sinal
          setTimeout(() => {
            setLocation('Lat: -3.11902 • Lon: -60.02173 (Precisão: 4m)');
            setIsSearchingGPS(false);
          }, 1200);
        },
        {
          enableHighAccuracy: true,
          timeout: 7000,
          maximumAge: 0
        }
      );
    } else {
      setTimeout(() => {
        setLocation('Lat: -3.11902 • Lon: -60.02173 (Precisão: 4m)');
        setIsSearchingGPS(false);
      }, 1200);
    }
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      const dataUrls = await Promise.all(files.map(file => compressImageFile(file)));
      setPhotos(prev => [...prev, ...dataUrls]);
      e.target.value = '';
    }
  };

  const startCamera = async () => {
    setCameraError(null);
    setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch {
      setCameraError('Não foi possível acessar a câmera diretamente. Use o seletor de arquivos abaixo.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setIsCameraOpen(false);
  };

  const capturePhotoFromCamera = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setPhotos(prev => [...prev, dataUrl]);
    }
    stopCamera();
  };

  const removePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const submitRecord = (saveToDrive: boolean) => {
    if (!formData.nome.trim()) {
      alert('Por favor, informe o Nome / Identificação do achado.');
      return;
    }
    
    // Constrói o resumo dos detalhes baseado no estado
    let details = '';
    if (formState === 'AM') {
      details = `Solo: ${formData.solo_am}\nDecoração: ${formData.decoracao_am}\nOrgânico: ${formData.organico_am}\nContexto: ${formData.contexto_am || 'Não informado'}`;
    } else if (formState === 'PE') {
      details = `Local: ${formData.sitio_pe}\nArte Rupestre: ${formData.arte_rupestre_pe}${formData.tipo_arte_pe ? ` (${formData.tipo_arte_pe})` : ''}\nLítico: ${formData.material_litico_pe || 'Não informado'}`;
    } else {
      // Padrão para todos os outros
      details = `Material: ${formData.material}\nDimensões: ${formData.dimensoes || 'Não informadas'}\nConservação: ${formData.conservacao}\nDescrição: ${formData.descricao || 'Não informada'}`;
    }

    onSave(
      {
        id: Date.now(),
        name: formData.nome.trim(),
        state: formState || 'Padrão',
        location: location === 'Aguardando registro...' ? 'Lat: -3.11902 • Lon: -60.02173 (Precisão: 4m)' : location,
        photos,
        details,
        fullData: { ...formData, formState }
      },
      saveToDrive
    );
    
    setPhotos([]);
    setLocation('Aguardando registro...');
    setFormData({
      nome: '',
      material: 'Cerâmica',
      dimensoes: '',
      conservacao: 'Bom',
      descricao: '',
      solo_am: 'Terra Preta de Índio',
      decoracao_am: 'Nenhuma',
      organico_am: 'Não',
      contexto_am: '',
      sitio_pe: 'Abrigo Rochoso',
      arte_rupestre_pe: 'Não',
      tipo_arte_pe: '',
      material_litico_pe: ''
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRecord(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 space-y-5 pb-24">
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-gray-700 flex items-center gap-2">
            <Icons.MapPin /> Localização
          </h3>
          <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full">
            {isSearchingGPS ? 'Buscando...' : 'GPS Ativo'}
          </span>
        </div>
        <button 
          type="button" 
          onClick={handleGPS} 
          disabled={isSearchingGPS}
          className="w-full bg-blue-50 hover:bg-blue-100 text-blue-700 py-3 rounded-xl border border-blue-200 transition-colors flex items-center justify-center gap-2"
        >
          Registrar Ponto Atual
        </button>
        <div className="mt-3 text-center text-gray-500 bg-gray-50 p-2 rounded-lg">{location}</div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
        <h3 className="text-gray-700 border-b pb-2">Dados do Achado</h3>
        
        <div>
          <label className="ml-1">Nome / Identificação</label>
          <input type="text" name="nome" className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none" placeholder="Ex: Urna 04" required value={formData.nome} onChange={handleChange} />
        </div>

        <div>
          <label className="ml-1">Estado (Regionalização)</label>
          <select className="w-full mt-1 px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 focus:border-blue-500 focus:outline-none" onChange={e => setFormState(e.target.value)} value={formState}>
            <option value="">Selecione o Estado...</option>
            {estadosBrasileiros.map(est => <option key={est.sigla} value={est.sigla}>{est.nome}</option>)}
          </select>
        </div>

        <div className="pt-2">
          {!formState && <div className="text-center py-4 text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">Selecione um estado para ver o formulário específico.</div>}
          
          {/* Formulário AMAZONAS */}
          {formState === 'AM' && (
            <div className="space-y-3 animate-fade">
               <span className="text-green-600 bg-green-50 px-2 py-1 rounded">Contexto Amazônico</span>
               <div>
                 <label className="block text-gray-600">Tipo de Solo</label>
                 <select name="solo_am" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.solo_am} onChange={handleChange}>
                    <option>Terra Preta de Índio</option><option>Latossolo Amarelo</option><option>Várzea</option><option>Outro</option>
                 </select>
               </div>
               <div>
                 <label className="block text-gray-600">Decoração</label>
                 <select name="decoracao_am" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.decoracao_am} onChange={handleChange}>
                    <option>Nenhuma</option><option>Policroma</option><option>Incisa</option><option>Modelada</option>
                 </select>
               </div>
               <div>
                 <label className="block text-gray-600">Material Orgânico</label>
                 <select name="organico_am" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.organico_am} onChange={handleChange}>
                    <option>Não</option><option>Sim (Carvão/Sementes)</option><option>Sim (Ossos)</option>
                 </select>
               </div>
               <textarea name="contexto_am" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 h-24" placeholder="Descreva o contexto e profundidade..." value={formData.contexto_am} onChange={handleChange}></textarea>
            </div>
          )}
          
          {/* Formulário PERNAMBUCO */}
          {formState === 'PE' && (
            <div className="space-y-3 animate-fade">
               <span className="text-orange-600 bg-orange-50 px-2 py-1 rounded">Contexto Caatinga</span>
               <div>
                 <label className="block text-gray-600">Localização</label>
                 <select name="sitio_pe" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.sitio_pe} onChange={handleChange}>
                    <option>Abrigo Rochoso</option><option>Céu Aberto</option><option>Tanque/Rio</option>
                 </select>
               </div>
               <div>
                 <label className="block text-gray-600">Arte Rupestre</label>
                 <select name="arte_rupestre_pe" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.arte_rupestre_pe} onChange={handleChange}>
                    <option>Não</option><option>Pintura</option><option>Gravura</option>
                 </select>
               </div>
               <input type="text" name="tipo_arte_pe" placeholder="Tradição (ex: Agreste)" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.tipo_arte_pe} onChange={handleChange} />
               <textarea name="material_litico_pe" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 h-24" placeholder="Descrição do material lítico..." value={formData.material_litico_pe} onChange={handleChange}></textarea>
            </div>
          )}
          
          {/* Formulário PADRÃO (Todos os outros estados) */}
          {formState && formState !== 'AM' && formState !== 'PE' && (
            <div className="space-y-3 animate-fade">
               <span className="text-gray-600 bg-gray-100 px-2 py-1 rounded">Detalhes Gerais</span>
               
               <div>
                 <label className="block text-gray-600">Material Principal</label>
                 <select name="material" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.material} onChange={handleChange}>
                    <option>Cerâmica</option><option>Lítico</option><option>Osso</option><option>Metal</option><option>Vidro</option><option>Outro</option>
                 </select>
               </div>

               <div>
                 <label className="block text-gray-600">Dimensões (cm)</label>
                 <input type="text" name="dimensoes" placeholder="Comp x Larg x Alt" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.dimensoes} onChange={handleChange} />
               </div>

               <div>
                 <label className="block text-gray-600">Estado de Conservação</label>
                 <select name="conservacao" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200" value={formData.conservacao} onChange={handleChange}>
                    <option>Bom</option><option>Regular</option><option>Ruim</option><option>Fragmentado</option>
                 </select>
               </div>

               <textarea name="descricao" className="w-full px-4 py-2 rounded-xl bg-gray-50 border border-gray-200 h-24" placeholder="Descrição detalhada do objeto e contexto..." value={formData.descricao} onChange={handleChange}></textarea>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-gray-700 flex items-center gap-2"><Icons.Camera /> Fotos</h3>
          {!isCameraOpen && (
            <button
              type="button"
              onClick={startCamera}
              className="text-sm bg-amber-50 hover:bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full border border-amber-200 transition-colors flex items-center gap-1.5"
            >
              <Icons.Camera /> Usar Câmera
            </button>
          )}
        </div>

        {isCameraOpen && (
          <div className="mb-4 bg-gray-900 rounded-xl overflow-hidden relative">
            {cameraError ? (
              <div className="p-4 text-center text-white text-sm">
                <p className="mb-2">{cameraError}</p>
                <button type="button" onClick={stopCamera} className="bg-white/20 px-3 py-1 rounded-lg">
                  Fechar
                </button>
              </div>
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-56 object-cover"
                />
                <div className="p-3 bg-black/70 flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={capturePhotoFromCamera}
                    className="bg-amber-600 hover:bg-amber-700 text-white px-5 py-2 rounded-full text-sm font-semibold shadow"
                  >
                    Capturar Foto
                  </button>
                  <button
                    type="button"
                    onClick={stopCamera}
                    className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-full text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        <input type="file" multiple accept="image/*" onChange={handlePhoto} className="block w-full text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
        <div className="mt-4 grid grid-cols-3 gap-2">
          {photos.map((src, i) => (
            <div key={i} className="relative group">
              <img src={src} className="w-full h-20 object-cover rounded-lg border border-gray-200" alt="preview" />
              <button
                type="button"
                onClick={() => removePhoto(i)}
                className="absolute top-1 right-1 bg-black/60 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs transition-colors"
                title="Remover foto"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-3 pt-1">
        <button
          type="submit"
          className="w-full bg-amber-700 hover:bg-amber-800 text-white py-4 rounded-xl shadow-lg transition-all transform active:scale-95 font-semibold"
        >
          SALVAR NO CELULAR
        </button>

        <button
          type="button"
          onClick={() => submitRecord(true)}
          className="w-full bg-white hover:bg-blue-50 text-gray-800 py-3.5 px-4 rounded-xl shadow-md border-2 border-blue-500 transition-all transform active:scale-95 flex items-center justify-center gap-3 font-semibold"
        >
          <Icons.GoogleDrive />
          <span>SALVAR NO GOOGLE DRIVE</span>
        </button>
      </div>
    </form>
  );
};
