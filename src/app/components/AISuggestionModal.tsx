import { Icons } from './Icons';

interface Record {
  id: number;
  name: string;
  state: string;
  location: string;
  photos: string[];
  details: string;
  fullData?: any;
}

interface AISuggestion {
  category: string;
  confidence: number;
  reasoning: string;
  similarFinds: number;
}

interface AISuggestionModalProps {
  record: Record;
  allRecords: Record[];
  onClose: () => void;
  onApplySuggestion: (category: string) => void;
}

export const AISuggestionModal = ({ record, allRecords, onClose, onApplySuggestion }: AISuggestionModalProps) => {
  const suggestion = generateAISuggestion(record, allRecords);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto animate-slideUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-white rounded-t-2xl">
          <div className="flex items-center justify-between mb-2">
            <h2 className="font-bold text-xl flex items-center gap-2">
              <span className="text-2xl">🤖</span>
              Sugestão de IA
            </h2>
            <button onClick={onClose} className="text-white/80 hover:text-white transition-colors">
              <Icons.X />
            </button>
          </div>
          <p className="text-purple-100 text-sm">Análise automática baseada em {allRecords.length} achado(s) no banco de dados</p>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Achado registrado */}
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
            <h3 className="text-gray-800 font-semibold mb-2 flex items-center gap-2">
              <Icons.Info />
              Achado Registrado
            </h3>
            <p className="text-gray-700 font-medium">{record.name}</p>
            <p className="text-gray-500 text-sm mt-1">{record.state} • {record.location}</p>
          </div>

          {/* Sugestão de Catalogação */}
          <div className="bg-gradient-to-br from-purple-50 to-blue-50 p-5 rounded-xl border-2 border-purple-300">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-gray-800 font-semibold flex items-center gap-2">
                <span className="text-xl">💡</span>
                Categoria Sugerida
              </h3>
              <div className="bg-white px-3 py-1 rounded-full border border-purple-300">
                <span className="text-purple-700 font-bold text-sm">{suggestion.confidence}% confiança</span>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg border border-purple-200 mb-3">
              <p className="text-purple-900 font-bold text-lg">{suggestion.category}</p>
            </div>

            <div className="bg-white/70 p-3 rounded-lg">
              <p className="text-gray-600 text-sm mb-2"><strong>Análise:</strong></p>
              <p className="text-gray-700 text-sm leading-relaxed">{suggestion.reasoning}</p>
            </div>

            {suggestion.similarFinds > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm text-purple-700">
                <Icons.Check className="w-4 h-4" />
                <span>{suggestion.similarFinds} achado(s) similar(es) encontrado(s) no banco de dados</span>
              </div>
            )}
          </div>

          {/* Informação adicional */}
          <div className="bg-amber-50 p-4 rounded-xl border border-amber-200">
            <div className="flex gap-2">
              <span className="text-xl flex-shrink-0">⚠️</span>
              <div>
                <p className="text-amber-900 font-semibold text-sm mb-1">Importante</p>
                <p className="text-amber-800 text-sm leading-relaxed">
                  Esta é uma sugestão automática. Sempre revise e valide a catalogação com base no seu conhecimento especializado e nas normas do IPHAN.
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => onApplySuggestion(suggestion.category)}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2"
            >
              <Icons.Check />
              Aplicar Sugestão
            </button>
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-xl font-semibold transition-colors"
            >
              Revisar Depois
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Algoritmo de sugestão de IA
function generateAISuggestion(currentRecord: Record, allRecords: Record[]): AISuggestion {
  // Se não há outros registros, usa análise básica
  if (allRecords.length === 0) {
    return analyzeBasedOnKeywords(currentRecord, 0);
  }

  // Calcula similaridade com cada registro existente
  const similarities = allRecords
    .filter(r => r.id !== currentRecord.id)
    .map(record => ({
      record,
      score: calculateSimilarity(currentRecord, record)
    }))
    .sort((a, b) => b.score - a.score);

  // Pega os 3 mais similares
  const topSimilar = similarities.slice(0, 3);
  
  if (topSimilar.length > 0 && topSimilar[0].score > 0.3) {
    // Usa o achado mais similar para sugerir categoria
    const mostSimilar = topSimilar[0].record;
    const category = inferCategory(currentRecord, mostSimilar);
    const similarCount = topSimilar.filter(s => s.score > 0.3).length;
    
    return {
      category,
      confidence: Math.min(95, Math.round(topSimilar[0].score * 100)),
      reasoning: `Baseado em ${similarCount} achado(s) similar(es) da região de ${currentRecord.state}, com características semelhantes encontradas em "${mostSimilar.name}".`,
      similarFinds: similarCount
    };
  }

  // Fallback para análise por palavras-chave
  return analyzeBasedOnKeywords(currentRecord, allRecords.length);
}

function calculateSimilarity(record1: Record, record2: Record): number {
  let score = 0;

  // Mesmo estado aumenta similaridade
  if (record1.state === record2.state) {
    score += 0.3;
  }

  // Localização similar
  const loc1 = record1.location.toLowerCase();
  const loc2 = record2.location.toLowerCase();
  if (loc1.includes(loc2) || loc2.includes(loc1)) {
    score += 0.2;
  }

  // Palavras-chave comuns na descrição
  const words1 = extractKeywords(record1.name + ' ' + record1.details);
  const words2 = extractKeywords(record2.name + ' ' + record2.details);
  const commonWords = words1.filter(w => words2.includes(w));
  score += Math.min(0.5, commonWords.length * 0.1);

  return score;
}

function extractKeywords(text: string): string[] {
  if (!text) return [];
  
  const stopWords = ['o', 'a', 'os', 'as', 'de', 'da', 'do', 'em', 'para', 'com', 'e', 'ou'];
  return text
    .toLowerCase()
    .split(/\s+/)
    .filter(word => word.length > 3 && !stopWords.includes(word))
    .slice(0, 10);
}

function inferCategory(currentRecord: Record, similarRecord: Record): string {
  const text = (currentRecord.name + ' ' + currentRecord.details).toLowerCase();
  
  // Categorias baseadas em palavras-chave
  const categories = {
    'Cerâmica Indígena': ['cerâmica', 'ceramica', 'indígena', 'indigena', 'pote', 'vasilha', 'fragmento'],
    'Lítico Lascado': ['lítico', 'litico', 'lascado', 'lasca', 'sílex', 'silex', 'quartzo', 'ponta'],
    'Lítico Polido': ['polido', 'machado', 'lâmina', 'lamina', 'polimento'],
    'Material Histórico': ['histórico', 'historico', 'colonial', 'louça', 'louca', 'metal', 'vidro'],
    'Arte Rupestre': ['rupestre', 'pintura', 'gravura', 'petroglifo', 'pictografia'],
    'Estrutura Arqueológica': ['estrutura', 'muro', 'fundação', 'construção', 'alicerce'],
    'Artefato Ósseo': ['osso', 'ósseo', 'osseo', 'esqueleto', 'fauna'],
    'Material Orgânico': ['carvão', 'carvao', 'semente', 'madeira', 'orgânico', 'organico']
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      return category;
    }
  }

  return 'Material Arqueológico Geral';
}

function analyzeBasedOnKeywords(record: Record, dbSize: number): AISuggestion {
  const text = (record.name + ' ' + record.details).toLowerCase();
  const category = inferCategory(record, record);
  
  let confidence = 70;
  let reasoning = 'Baseado em análise de palavras-chave e características do artefato descrito.';
  
  if (dbSize > 0) {
    confidence = 65;
    reasoning = `Analisado ${dbSize} achado(s) no banco de dados, mas nenhum com alta similaridade. Categoria sugerida baseada nas características descritas.`;
  }

  return {
    category,
    confidence,
    reasoning,
    similarFinds: 0
  };
}
