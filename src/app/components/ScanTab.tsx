import { useState, useEffect, useRef } from 'react';
// @ts-ignore
import * as THREE from 'three@0.128.0';
// @ts-ignore
import { OrbitControls } from 'three@0.128.0/examples/jsm/controls/OrbitControls';
import { Icons } from './Icons';

interface ScanTabProps {
  onUseScanInRecord?: (dataUrl: string) => void;
}

export const ScanTab = ({ onUseScanInRecord }: ScanTabProps) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const sceneRef = useRef<any>(null);
  const rendererRef = useRef<any>(null);
  const controlsRef = useRef<any>(null);
  const wireframeRef = useRef<any>(null);
  const animationIdRef = useRef<number | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [hasCameraFeed, setHasCameraFeed] = useState(false);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setHasCameraFeed(false);
  };

  useEffect(() => {
    if (!isScanning || !mountRef.current) return;

    // Tenta iniciar a câmera real do dispositivo durante o escaneamento
    navigator.mediaDevices
      ?.getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then(stream => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setHasCameraFeed(true);
        }
      })
      .catch(() => {
        setHasCameraFeed(false);
      });

    // Limpa qualquer cena existente
    if (sceneRef.current) {
      sceneRef.current.clear();
    }
    if (rendererRef.current) {
      rendererRef.current.dispose();
    }
    if (controlsRef.current) {
      controlsRef.current.dispose();
    }
    if (mountRef.current) {
      mountRef.current.innerHTML = '';
    }

    // Cria a cena Three.js
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      50,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true
    });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    renderer.setClearColor(0x111827, 0.85);
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Iluminação
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(2, 2, 2);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0x404040));

    // Cria o modelo 3D (urna/vaso arqueológico)
    const geometry = new THREE.CylinderGeometry(0.6, 0.4, 1.2, 32);
    const material = new THREE.MeshStandardMaterial({ 
      color: 0xcd853f, 
      roughness: 0.5,
      metalness: 0.2
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    // Malha wireframe de escaneamento 3D
    const wireMaterial = new THREE.MeshBasicMaterial({
      color: 0x3b82f6,
      wireframe: true,
      transparent: true,
      opacity: 0.55
    });
    const wireMesh = new THREE.Mesh(geometry, wireMaterial);
    wireMesh.scale.set(1.01, 1.01, 1.01);
    scene.add(wireMesh);
    wireframeRef.current = wireMaterial;

    // Controles de órbita para interação
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2;
    controlsRef.current = controls;

    // Animação
    const animate = () => {
      animationIdRef.current = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Simula progresso do scan
    const progressInterval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          if (controlsRef.current) {
            controlsRef.current.autoRotate = false; // Para a rotação automática quando completo
          }
          if (wireframeRef.current) {
            wireframeRef.current.opacity = 0;
          }
          if (rendererRef.current) {
            rendererRef.current.setClearColor(0x111827, 1);
          }
          stopCameraStream();
          return 100;
        }
        if (wireframeRef.current) {
          wireframeRef.current.opacity = Math.max(0, 0.55 * (1 - prev / 100));
        }
        return prev + 1;
      });
    }, 50);

    // Cleanup
    return () => {
      stopCameraStream();
      if (animationIdRef.current !== null) {
        cancelAnimationFrame(animationIdRef.current);
      }
      clearInterval(progressInterval);
      
      if (controlsRef.current) {
        controlsRef.current.dispose();
        controlsRef.current = null;
      }
      
      if (rendererRef.current) {
        rendererRef.current.dispose();
        rendererRef.current = null;
      }
      
      geometry.dispose();
      material.dispose();
      wireMaterial.dispose();
      
      if (sceneRef.current) {
        sceneRef.current.clear();
        sceneRef.current = null;
      }
      
      if (mountRef.current) {
        mountRef.current.innerHTML = '';
      }
    };
  }, [isScanning]);

  const handleStartScan = () => {
    setIsScanning(true);
    setScanProgress(0);
  };

  const handleCaptureModel = () => {
    if (!rendererRef.current || !onUseScanInRecord) return;
    const dataUrl = rendererRef.current.domElement.toDataURL('image/jpeg', 0.9);
    onUseScanInRecord(dataUrl);
  };

  return (
    <div className="p-4 h-full flex flex-col pb-24">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex-grow flex flex-col items-center justify-center text-center">
        {!isScanning ? (
          <>
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-4"><Icons.Box /></div>
            <h2 className="text-gray-800">Digitalização 3D</h2>
            <p className="text-gray-500 mt-2 mb-8">Gire ao redor do objeto para escanear.</p>
            <button onClick={handleStartScan} className="bg-blue-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-700 transition-all">INICIAR SCAN</button>
          </>
        ) : (
          <>
            <div className="w-full max-w-md space-y-4">
              <div className="w-full h-96 bg-gray-900 rounded-2xl overflow-hidden shadow-inner relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
                    hasCameraFeed && scanProgress < 100 ? 'opacity-45' : 'opacity-0 pointer-events-none'
                  }`}
                />
                <div 
                  ref={mountRef} 
                  className="w-full h-full relative z-10"
                  style={{ touchAction: 'none' }}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-gray-600">
                  <span>Progresso do Scan</span>
                  <span>{scanProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                </div>
                {scanProgress === 100 && (
                  <div className="space-y-2 pt-1">
                    <p className="text-green-600">✓ Scan concluído! Continue interagindo com o modelo.</p>
                    {onUseScanInRecord && (
                      <button
                        type="button"
                        onClick={handleCaptureModel}
                        className="w-full bg-amber-700 hover:bg-amber-800 text-white py-2.5 px-4 rounded-xl text-sm font-semibold shadow transition-colors"
                      >
                        Anexar Modelo 3D ao Novo Registro
                      </button>
                    )}
                  </div>
                )}
                {scanProgress < 100 && (
                  <p className="text-blue-600">💡 Arraste para rotacionar • Scroll para zoom</p>
                )}
              </div>
            </div>
            <button onClick={() => setIsScanning(false)} className="text-gray-500 underline mt-6">Escanear Novamente</button>
          </>
        )}
      </div>
    </div>
  );
};
