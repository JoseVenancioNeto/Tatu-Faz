import { Icons } from './Icons';

interface Record {
  id: number;
  name: string;
  state: string;
  location: string;
  photos: string[];
  details: string;
  fullData?: any;
  aiCategory?: string;
}

interface RecordsTabProps {
  records: Record[];
  onViewDetail: (record: Record) => void;
}

export const RecordsTab = ({ records, onViewDetail }: RecordsTabProps) => (
  <div className="p-4 pb-24">
    <h2 className="text-gray-800 mb-4 px-2 flex justify-between items-center">
      Registros <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full">{records.length}</span>
    </h2>
    {records.length === 0 ? (
      <div className="text-center py-12 text-gray-400 border-2 border-dashed border-gray-200 rounded-2xl">
        <div className="mx-auto w-12 h-12 mb-2 opacity-50"><Icons.List /></div>
        Nenhum registro salvo.
      </div>
    ) : (
      <div className="space-y-3">
        {records.map(r => (
          <div key={r.id} onClick={() => onViewDetail(r)} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div className="flex-1">
                <h4 className="text-gray-800 font-semibold">{r.name}</h4>
                <p className="text-gray-500 text-sm">{r.state} • {r.location.substring(0, 15)}...</p>
              </div>
              <div className="text-gray-300"><Icons.ArrowRight /></div>
            </div>
            {r.aiCategory && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-2 py-1 rounded-lg text-xs font-medium">
                  <span className="text-sm">🤖</span>
                  {r.aiCategory}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </div>
);