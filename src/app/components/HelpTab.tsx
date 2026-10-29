import { Icons } from './Icons';
import logoAcai from 'figma:asset/c7ecd7a8cd4cb65c2b27a064949f33ef400b6c59.png';
import mascoteAcai from 'figma:asset/17d885b867d38b7265fd8ebd6481e0f44c26dddb.png';

export const HelpTab = () => (
  <div className="p-6 space-y-6 pb-24">
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
       <h2 className="text-gray-800 mb-4 flex items-center gap-2"><Icons.Help /> Bem-vindo ao TATU FAZ!</h2>
       <p className="text-gray-600 mb-2">Olá, arqueólogo(a)! 👋</p>
       <p className="text-gray-500 leading-relaxed">Este guia vai te ajudar a registrar seus achados arqueológicos de forma rápida e profissional, mesmo se esta for sua primeira vez usando o aplicativo.</p>
    </div>

    {/* Tutorial Passo a Passo */}
    <div className="bg-gradient-to-br from-amber-50 to-orange-50 p-6 rounded-2xl shadow-sm border border-amber-200">
      <h2 className="text-gray-800 mb-6 flex items-center gap-2">
        <span className="text-2xl">📖</span>
        Tutorial Passo a Passo
      </h2>
      
      {/* Passo 1 */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center flex-shrink-0 font-bold">1</div>
          <div className="flex-1">
            <h3 className="text-gray-800 font-semibold mb-2">Registrar um Novo Achado</h3>
            <p className="text-gray-600 mb-2 leading-relaxed">Clique na aba <strong className="text-amber-700">Novo</strong> (ícone da câmera) na parte inferior da tela.</p>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-amber-800 text-sm"><strong>Dica:</strong> Certifique-se de estar no local do achado antes de iniciar o registro para capturar as coordenadas GPS corretamente.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Passo 2 */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center flex-shrink-0 font-bold">2</div>
          <div className="flex-1">
            <h3 className="text-gray-800 font-semibold mb-2">Selecionar o Estado</h3>
            <p className="text-gray-600 mb-2 leading-relaxed">Escolha o estado brasileiro onde está realizando o trabalho de campo (AM, PE ou Padrão).</p>
            <p className="text-gray-500 text-sm italic">Cada estado possui campos específicos de acordo com as normas do IPHAN regional.</p>
          </div>
        </div>
      </div>

      {/* Passo 3 */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center flex-shrink-0 font-bold">3</div>
          <div className="flex-1">
            <h3 className="text-gray-800 font-semibold mb-2">Capturar Localização</h3>
            <p className="text-gray-600 mb-2 leading-relaxed">Clique no botão <strong>Capturar GPS</strong>. O app irá solicitar permissão para acessar sua localização.</p>
            <div className="bg-amber-50 p-3 rounded-lg border border-amber-100">
              <p className="text-amber-800 text-sm"><strong>Importante:</strong> Sempre permita o acesso ao GPS para registrar a localização precisa do achado.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Passo 4 */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center flex-shrink-0 font-bold">4</div>
          <div className="flex-1">
            <h3 className="text-gray-800 font-semibold mb-2">Adicionar Fotos</h3>
            <p className="text-gray-600 mb-2 leading-relaxed">Tire fotos do achado clicando em <strong>Adicionar Fotos</strong>. Você pode adicionar várias fotos de diferentes ângulos.</p>
            <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mt-2">
              <p className="text-blue-800 text-sm"><strong>Boas práticas:</strong></p>
              <ul className="text-blue-700 text-sm mt-1 ml-4 space-y-1">
                <li>• Fotografe com uma escala de referência</li>
                <li>• Capture diferentes ângulos do objeto</li>
                <li>• Use iluminação adequada</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Passo 5 */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center flex-shrink-0 font-bold">5</div>
          <div className="flex-1">
            <h3 className="text-gray-800 font-semibold mb-2">Preencher os Campos</h3>
            <p className="text-gray-600 mb-2 leading-relaxed">Complete todos os campos do formulário com informações detalhadas sobre o achado:</p>
            <ul className="text-gray-500 text-sm space-y-1 ml-4">
              <li>• Nome/identificação do artefato</li>
              <li>• Descrição detalhada</li>
              <li>• Contexto arqueológico</li>
              <li>• Materiais e dimensões</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Passo 6 */}
      <div className="mb-6 bg-white p-5 rounded-xl shadow-sm">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-8 h-8 rounded-full bg-amber-700 text-white flex items-center justify-center flex-shrink-0 font-bold">6</div>
          <div className="flex-1">
            <h3 className="text-gray-800 font-semibold mb-2">Salvar o Registro</h3>
            <p className="text-gray-600 mb-2 leading-relaxed">Clique em <strong>Salvar Registro</strong> para armazenar todas as informações. O registro aparecerá na aba <strong>Lista</strong>.</p>
          </div>
        </div>
      </div>

      {/* Recursos Avançados */}
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-xl border border-purple-200 mt-6">
        <h3 className="text-gray-800 font-semibold mb-3 flex items-center gap-2">
          <span className="text-xl">🚀</span>
          Recursos Avançados
        </h3>
        
        <div className="space-y-3">
          <div className="bg-white p-3 rounded-lg">
            <h4 className="text-gray-800 font-semibold mb-1 flex items-center gap-2">
              <Icons.Box />
              Digitalização 3D
            </h4>
            <p className="text-gray-600 text-sm">Na aba <strong>3D</strong>, você pode criar modelos tridimensionais dos artefatos usando a câmera do celular. Siga as instruções na tela para girar em torno do objeto.</p>
          </div>

          <div className="bg-white p-3 rounded-lg">
            <h4 className="text-gray-800 font-semibold mb-1 flex items-center gap-2">
              <Icons.List />
              Gerenciar Registros
            </h4>
            <p className="text-gray-600 text-sm">Na aba <strong>Lista</strong>, você pode visualizar todos os achados registrados, ver detalhes completos e exportar relatórios em PDF.</p>
          </div>

          <div className="bg-white p-3 rounded-lg">
            <h4 className="text-gray-800 font-semibold mb-1">📄 Exportar para PDF</h4>
            <p className="text-gray-600 text-sm">Ao visualizar um registro, use o botão de exportação para gerar um relatório profissional em PDF com todas as informações, fotos e dados GPS.</p>
          </div>

          <div className="bg-white p-3 rounded-lg border-2 border-purple-200">
            <h4 className="text-gray-800 font-semibold mb-1 flex items-center gap-2">
              🤖 Sugestão Inteligente de Catalogação
            </h4>
            <p className="text-gray-600 text-sm mb-2">Após salvar um registro, nosso sistema de IA analisa automaticamente as características do achado e compara com outros registros no banco de dados.</p>
            <p className="text-purple-700 text-sm font-medium">A IA sugere uma categoria de catalogação baseada em similaridades encontradas, ajudando você a classificar achados de forma mais rápida e consistente!</p>
          </div>
        </div>
      </div>
    </div>
    
    {/* Informações sobre IPHAN */}
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h2 className="text-gray-800 mb-4 flex items-center gap-2"><Icons.Info /> Sobre o IPHAN</h2>
      <p className="text-gray-600 mb-4 leading-relaxed">O <strong>Instituto do Patrimônio Histórico e Artístico Nacional (IPHAN)</strong> é responsável pela preservação do Patrimônio.</p>
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
        <h4 className="text-blue-800 mb-2">Achados Fortuitos</h4>
        <p className="text-blue-700 mb-3">Qualquer descoberta deve ser comunicada ao IPHAN.</p>
        <a href="https://www.gov.br/iphan" target="_blank" rel="noreferrer" className="text-blue-600 underline flex items-center gap-1">Visitar site oficial <Icons.ArrowRight /></a>
      </div>
    </div>

    {/* Créditos */}
    <div className="bg-gradient-to-br from-purple-50 to-green-50 p-6 rounded-2xl shadow-sm border border-purple-200">
      <h2 className="text-gray-800 mb-4">Desenvolvido por</h2>
      <p className="text-gray-600 mb-4 leading-relaxed">
        Esse app foi desenvolvido como um protótipo do Figma pela equipe <strong>Engenheiros do Açaí</strong>
      </p>
      <div className="flex items-center justify-center gap-6 mt-6">
        <img 
          src={mascoteAcai} 
          alt="Mascote Engenheiros do Açaí" 
          className="w-24 h-24 object-contain"
        />
        <img 
          src={logoAcai} 
          alt="Logo Engenheiros do Açaí" 
          className="w-40 h-auto object-contain"
        />
      </div>
    </div>
  </div>
);