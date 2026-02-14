import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { stagingRepo } from '../../lib/stagingRepo';
import { CandidateSubmission, CandidateStatus } from '../../types';

const KanbanBoard: React.FC = () => {
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);

  useEffect(() => {
    // Poll for changes every few seconds to keep simulation alive
    const load = async () => {
      const data = await stagingRepo.listSubmissions();
      setSubmissions(data);
    }
    load();
    const interval = setInterval(load, 5000);
    return () => clearInterval(interval);
  }, []);

  const Column = ({ title, status, color }: { title: string, status: CandidateStatus, color: string }) => {
    const items = submissions.filter(s => s.status === status);

    return (
      <div className="flex flex-col w-80 flex-shrink-0 bg-slate-100 rounded-xl max-h-full">
        <div className={`p-4 font-bold text-slate-700 border-b border-slate-200 flex justify-between items-center ${color} bg-opacity-20 rounded-t-xl`}>
          <span>{title}</span>
          <span className="bg-white px-2 py-0.5 rounded-full text-xs text-slate-500 shadow-sm">{items.length}</span>
        </div>
        <div className="p-3 space-y-3 overflow-y-auto flex-1 min-h-[200px]">
          {items.map(item => (
            <Link to={`/admin/candidatos/${item.id}`} key={item.id} className="block group">
              <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 hover:shadow-md hover:border-brand-300 transition-all cursor-pointer group-hover:-translate-y-1">
                <div className="flex justify-between items-start mb-2">
                  <span className="font-bold text-slate-800 text-sm line-clamp-1">{item.raw_name}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{new Date(item.created_at).toLocaleDateString(undefined, { month: 'numeric', day: 'numeric' })}</span>
                </div>
                <div className="text-xs text-slate-500 mb-3 line-clamp-2" title={item.raw_payload.offer}>
                  {item.raw_payload.offer}
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="bg-slate-50 px-2 py-1 rounded text-slate-500 truncate max-w-[120px]">
                    {item.raw_payload.location.split(',')[0]}
                  </span>
                </div>
              </div>
            </Link>
          ))}
          {items.length === 0 && (
            <div className="text-center py-8 text-slate-400 text-xs italic">
              Sin candidatos
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-140px)] flex flex-col">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Tablero de Procesos</h1>
          <Link to="/admin/candidatos" className="text-sm text-brand-600 hover:text-brand-800">
            Ver Lista
          </Link>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-4 h-full">
          <Column title="Nuevos" status="new" color="bg-yellow-400" />
          <Column title="En Revisión" status="needs_review" color="bg-blue-400" />
          <Column title="Procesados" status="processed" color="bg-green-400" />
          <Column title="Rechazados" status="rejected" color="bg-red-400" />
        </div>
      </div>
    </AdminLayout>
  );
};

export default KanbanBoard;