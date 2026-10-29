import logoTatu from 'figma:asset/23ffbde6989eb8658b29612ff6820f6e8ef0b876.png';

interface LoginScreenProps {
  onLogin: () => void;
}

export const LoginScreen = ({ onLogin }: LoginScreenProps) => (
  <div className="fixed inset-0 z-50 bg-gray-100 flex flex-col items-center justify-center p-6">
    <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-sm text-center">
      <div className="mb-6 relative inline-block">
        <div className="w-32 h-32 bg-amber-700 rounded-full flex items-center justify-center mx-auto border-4 border-amber-900 shadow-lg overflow-hidden">
          <img 
            src={logoTatu} 
            alt="Logo TATU FAZ" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      <h1 className="text-gray-800 mb-1 text-5xl font-black tracking-wider" style={{ fontFamily: 'Montserrat, system-ui, sans-serif' }}>TATU FAZ</h1>
      <p className="text-gray-500 mb-8">Sistema de Registro Arqueológico</p>
      <form onSubmit={(e) => { e.preventDefault(); onLogin(); }} className="space-y-4 text-left">
        <div>
          <label className="block ml-1">Email</label>
          <input type="email" defaultValue="arqueologo@tatu.faz" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-amber-600 focus:outline-none transition-colors" required />
        </div>
        <div>
          <label className="block ml-1">Senha</label>
          <input type="password" defaultValue="123456" className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:border-amber-600 focus:outline-none transition-colors" required />
        </div>
        <button type="submit" className="w-full bg-amber-700 hover:bg-amber-800 text-white py-4 rounded-xl shadow-lg transform active:scale-95 transition-all mt-4">
          ENTRAR
        </button>
      </form>
    </div>
  </div>
);