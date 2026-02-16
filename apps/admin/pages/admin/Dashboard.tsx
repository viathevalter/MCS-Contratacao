import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { stagingRepo } from '../../lib/stagingRepo';
import { KanbanStage, CandidateSubmission } from '../../types';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<{ total: number; byStage: Record<string, number> }>({
    total: 0,
    byStage: {}
  });
  const [stages, setStages] = useState<KanbanStage[]>([]);
  const [recent, setRecent] = useState<CandidateSubmission[]>([]);

  useEffect(() => {
    const loadData = async () => {
      const [submissions, stagesData] = await Promise.all([
        stagingRepo.listSubmissions(),
        stagingRepo.listStages()
      ]);

      const stageCounts: Record<string, number> = {};

      // Initialize counts for all stages
      stagesData.forEach(stage => {
        stageCounts[stage.id] = 0;
      });

      // Count submissions per stage
      submissions.forEach(sub => {
        if (stageCounts[sub.status] !== undefined) {
          stageCounts[sub.status]++;
        }
      });

      setStats({
        total: submissions.length,
        byStage: stageCounts
      });

      setStages(stagesData.sort((a, b) => a.position - b.position));
      setRecent(submissions.slice(0, 5));
    };
    loadData();
  }, []);

  const StatCard = ({ title, value, color, icon }: any) => {
    const isHex = color.startsWith('#');

    // Style for the icon container
    const containerStyle = isHex
      ? { backgroundColor: `${color}20`, color: color } // 20 is hex opacity ~12%
      : {};

    const containerClass = isHex
      ? `p-4 rounded-full mr-4`
      : `p-4 rounded-full mr-4 ${color} bg-opacity-10 text-${color.split('-')[1]}-600`;

    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center transition-transform hover:scale-105">
        <div className={containerClass} style={containerStyle}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-bold text-slate-800">{value}</div>
          <div className="text-sm font-medium text-slate-500 uppercase tracking-wide truncate max-w-[150px]" title={title}>{title}</div>
        </div>
      </div>
    );
  };

  return (
    <AdminLayout>
      <h1 className="text-2xl font-bold text-slate-800 mb-6">Dashboard</h1>

      {/* PCBs / Dynamic Stages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Total is always first */}
        <StatCard
          title="Total Envíos"
          value={stats.total}
          color="bg-slate-500"
          icon={<svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>}
        />

        {/* Dynamic Cards per Stage */}
        {stages.map(stage => (
          <StatCard
            key={stage.id}
            title={stage.title}
            value={stats.byStage[stage.id] || 0}
            color={stage.color}
            icon={<svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}
          />
        ))}
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