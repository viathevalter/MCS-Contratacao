import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { jobsRepo } from '../../lib/jobsRepo';
import { shortlistsRepo } from '../../lib/shortlistsRepo';
import { workersRepo } from '../../lib/workersRepo';
import { authMock } from '../../lib/authMock';
import { Job, Shortlist, ShortlistItem, Worker, ShortlistItemStatus } from '../../types';

const JobShortlist: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);
    const [shortlist, setShortlist] = useState<Shortlist | null>(null);
    const [workersMap, setWorkersMap] = useState<Record<string, Worker>>({});

    // Filters
    const [minScore, setMinScore] = useState(0);
    const [statusFilter, setStatusFilter] = useState<ShortlistItemStatus | 'all'>('all');

    useEffect(() => {
        const loadData = async () => {
            if (id) {
                const j = await jobsRepo.getJob(id);
                if (j) {
                    setJob(j);
                    const s = await shortlistsRepo.getShortlistByJobId(j.id);
                    if (s) {
                        setShortlist(s);
                        // Hydrate workers
                        const wMap: Record<string, Worker> = {};
                        // Parallel fetch for workers is better
                        const workerPromises = s.items.map(async (item) => {
                            const w = await workersRepo.getWorker(item.worker_id);
                            if (w) wMap[w.id] = w;
                        });
                        await Promise.all(workerPromises);
                        setWorkersMap(wMap);
                    }
                } else {
                    navigate('/admin/pedidos');
                }
            }
        };
        loadData();
    }, [id, navigate]);

    const handleUpdateStatus = async (workerId: string, newStatus: ShortlistItemStatus) => {
        if (!shortlist) return;

        // 1. Update Shortlist Repo
        await shortlistsRepo.updateItemStatus(shortlist.id, workerId, newStatus);

        // 2. Update Local State
        setShortlist(prev => {
            if (!prev) return null;
            const newItems = prev.items.map(item =>
                item.worker_id === workerId ? { ...item, status: newStatus } : item
            );
            return { ...prev, items: newItems };
        });

        // 3. Side Effects (If Approved)
        if (newStatus === 'approved' && job) {
            const session = authMock.getSession();
            // Add Note
            await workersRepo.addNote(
                workerId,
                session?.email || 'system',
                `Aprobado para el pedido ${job.job_code} - ${job.title}`
            );

            // Optionally activate worker if standby
            const w = workersMap[workerId];
            if (w && w.status === 'standby') {
                if (confirm(`El trabajador ${w.full_name} está en Standby. ¿Pasarlo a Activo?`)) {
                    await workersRepo.updateWorker(w.id, { status: 'active' });
                    // Update local map
                    setWorkersMap(prev => ({
                        ...prev,
                        [w.id]: { ...w, status: 'active' }
                    }));
                }
            }
        }
    };

    const filteredItems = shortlist?.items.filter(item => {
        if (item.score < minScore) return false;
        if (statusFilter !== 'all' && item.status !== statusFilter) return false;
        return true;
    }) || [];

    if (!job) return <AdminLayout><div>Cargando...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="mb-6">
                <div className="flex items-center space-x-2 text-sm text-slate-500 mb-2">
                    <Link to="/admin/pedidos" className="hover:text-brand-600">Pedidos</Link>
                    <span>/</span>
                    <Link to={`/admin/pedidos/${job.id}`} className="hover:text-brand-600">{job.job_code}</Link>
                    <span>/</span>
                    <span className="text-slate-900 font-semibold">Shortlist</span>
                </div>
                <h1 className="text-2xl font-bold text-slate-800">Match Results: {job.title}</h1>
            </div>

            {!shortlist ? (
                <div className="text-center py-12 bg-white rounded-xl shadow border border-slate-200">
                    <p className="text-slate-500 mb-4">No se ha generado una lista de candidatos para este pedido.</p>
                    <Link to={`/admin/pedidos/${job.id}`} className="text-brand-600 font-bold hover:underline">Ir al detalle para generar Match</Link>
                </div>
            ) : (
                <div className="flex flex-col space-y-4">

                    {/* Filters */}
                    <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 flex flex-wrap gap-4 items-center">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Score Mínimo: {minScore}</label>
                            <input
                                type="range" min="0" max="100" step="10"
                                value={minScore} onChange={e => setMinScore(Number(e.target.value))}
                                className="w-32"
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 mb-1">Estado Lista</label>
                            <select
                                value={statusFilter} onChange={e => setStatusFilter(e.target.value as any)}
                                className="text-sm rounded border-slate-300 py-1"
                            >
                                <option value="all">Todos</option>
                                <option value="suggested">Sugerido</option>
                                <option value="contacted">Contactado</option>
                                <option value="approved">Aprobado</option>
                                <option value="rejected">Rechazado</option>
                            </select>
                        </div>
                        <div className="ml-auto text-sm text-slate-500">
                            Mostrando <strong>{filteredItems.length}</strong> de {shortlist.items.length} candidatos
                        </div>
                    </div>

                    {/* List */}
                    <div className="bg-white shadow rounded-lg overflow-hidden border border-slate-200">
                        <table className="min-w-full divide-y divide-slate-200">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Score</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Candidato</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Detalles Match</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase">Estado</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase">Acciones</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                {filteredItems.map(item => {
                                    const worker = workersMap[item.worker_id];
                                    if (!worker) return null;
                                    return (
                                        <tr key={item.worker_id} className={`hover:bg-slate-50 ${item.status === 'rejected' ? 'opacity-60 bg-slate-50' : ''} ${item.status === 'approved' ? 'bg-green-50' : ''}`}>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold text-sm border-2 
                                              ${item.score >= 80 ? 'border-green-500 text-green-700 bg-green-50' :
                                                        item.score >= 50 ? 'border-yellow-500 text-yellow-700 bg-yellow-50' :
                                                            'border-red-300 text-red-600 bg-red-50'}`}>
                                                    {item.score}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="font-bold text-slate-800">{worker.full_name}</div>
                                                <div className="text-xs text-slate-500 font-mono">{worker.worker_code}</div>
                                                <div className="text-xs text-slate-600">{worker.profession_primary}</div>
                                                <div className="text-xs text-slate-400 mt-1">{worker.location}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <ul className="list-disc list-inside text-xs text-slate-600 space-y-1">
                                                    {item.reasons.slice(0, 3).map((r, i) => <li key={i}>{r}</li>)}
                                                    {item.reasons.length > 3 && <li className="text-slate-400">...y {item.reasons.length - 3} más</li>}
                                                </ul>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-bold capitalize 
                                              ${item.status === 'approved' ? 'bg-green-200 text-green-800' :
                                                        item.status === 'rejected' ? 'bg-red-200 text-red-800' :
                                                            item.status === 'contacted' ? 'bg-blue-200 text-blue-800' : 'bg-slate-200 text-slate-600'}`}>
                                                    {item.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right space-x-2 whitespace-nowrap">
                                                <Link to={`/admin/trabajadores/${worker.id}`} target="_blank" className="text-xs text-brand-600 hover:underline mr-2">
                                                    Ver Perfil
                                                </Link>

                                                {item.status !== 'approved' && item.status !== 'rejected' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdateStatus(item.worker_id, 'contacted')}
                                                            className="p-1 text-blue-600 hover:bg-blue-100 rounded" title="Contactado"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(item.worker_id, 'approved')}
                                                            className="p-1 text-green-600 hover:bg-green-100 rounded" title="Aprobar"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleUpdateStatus(item.worker_id, 'rejected')}
                                                            className="p-1 text-red-600 hover:bg-red-100 rounded" title="Rechazar"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                                        </button>
                                                    </>
                                                )}
                                                {item.status === 'rejected' && (
                                                    <button onClick={() => handleUpdateStatus(item.worker_id, 'suggested')} className="text-xs text-slate-400 underline">Deshacer</button>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default JobShortlist;
