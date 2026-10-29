import loadingGif from 'figma:asset/017357616665952e3fc3ff4c629e864e8e03913f.png';
import { useEffect, useState } from 'react';

interface LoadingScreenProps {
  message?: string;
}

export const LoadingScreen = ({ message = 'Processando...' }: LoadingScreenProps) => {
  const [animationFrame, setAnimationFrame] = useState(0);

  useEffect(() => {
    // Simula animação alternando a opacidade/escala para dar vida à imagem
    const interval = setInterval(() => {
      setAnimationFrame(prev => (prev + 1) % 3);
    }, 400);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl p-8 shadow-2xl max-w-sm mx-4 text-center animate-slideUp">
        <div className="mb-6 flex justify-center">
          <div className="relative">
            <img 
              src={loadingGif} 
              alt="Tatu trabalhando" 
              className="w-64 h-auto transition-transform duration-300"
              style={{ 
                transform: `scale(${1 + animationFrame * 0.05}) rotate(${animationFrame * 2}deg)`,
              }}
            />
            {/* Efeito de brilho pulsante */}
            <div 
              className="absolute inset-0 bg-amber-300/20 rounded-2xl"
              style={{
                opacity: animationFrame === 1 ? 0.5 : 0,
                transition: 'opacity 0.3s'
              }}
            />
          </div>
        </div>
        <div className="space-y-3">
          <h3 className="text-gray-800 font-bold text-xl">{message}</h3>
          <div className="flex justify-center gap-2">
            <div className="w-3 h-3 bg-amber-700 rounded-full animate-pulse-dot" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-amber-700 rounded-full animate-pulse-dot" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-amber-700 rounded-full animate-pulse-dot" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
};