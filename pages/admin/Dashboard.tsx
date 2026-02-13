import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { stagingRepo } from '../../lib/stagingRepo';
import { CandidateSubmission } from '../../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    total: 0,
    new: 0,
    needs_review: 0,
    processed: 0,
    rejected: 0
  });
  const [recent, setRecent] = useState<CandidateSubmission[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await stagingRepo.listSubmissions();

      setStats({
        total: data.length,
        new: data.filter(s => s.status === 'new').length,
        needs_review: data.filter(s => s.status === 'needs_review').length,
        processed: data.filter(s => s.status === 'processed').length,
        rejected: data.filter(s => s.status === 'rejected').length,
      });

      setRecent(data.slice(0, 5));
    };
    loadData();
  }, []);

  const StatCard = ({ title, value, color, icon }: any) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center">
      <div className={`p-4 rounded-full mr-4 ${color} bg-opacity-10 text-${color.split('-')[1]}-600`}>
        {icon}
      </div>
      <div>
        <div className="text-3xl font-bold text-slate-800">{value}</div>
        <div className="text-sm font-medium text-slate-500 uppercase tracking-wide">{title}</div>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Envíos"
          value={stats.total}
          color="bg-slate-500"
          icon={<svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />
        <StatCard
          title="Nuevos"
          value={stats.new}
          color="bg-yellow-500"
          icon={<svg className="w-6 h-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
        <StatCard
          title="Por Revisar"
          value={stats.needs_review}
          color="bg-blue-500"
          icon={<svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>}
        />
        <StatCard
          title="Procesados"
          value={stats.processed}
          color="bg-green-500"
          icon={<svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}
        />
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Últimos Envíos</h3>
          <Link to="/admin/candidatos" className="text-sm text-brand-600 hover:text-brand-800 font-medium">Ver todos &rarr;</Link>
        </div>
        <div className="divide-y divide-slate-100">
          {recent.length === 0 ? (
            <div className="p-8 text-center text-slate-500">No hay actividad reciente.</div>
          ) : (
            recent.map(sub => (
              <div key={sub.id} className="p-4 hover:bg-slate-50 transition-colors flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${sub.status === 'new' ? 'bg-yellow-400' : 'bg-slate-300'}`}></div>
                  <div>
                    <div className="font-medium text-slate-900">{sub.raw_name}</div>
                    <div className="text-xs text-slate-500">{sub.raw_payload.offer}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <span className="text-xs text-slate-400 font-mono">{new Date(sub.created_at).toLocaleDateString()}</span>
                  <Link to={`/admin/candidatos/${sub.id}`} className="text-xs font-semibold text-brand-600 bg-brand-50 px-2 py-1 rounded hover:bg-brand-100">
                    Ver
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;