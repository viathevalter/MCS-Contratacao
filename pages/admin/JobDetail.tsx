import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { jobsRepo } from '../../lib/jobsRepo';
import { shortlistsRepo } from '../../lib/shortlistsRepo';
import { workersRepo } from '../../lib/workersRepo';
import { matchEngine } from '../../lib/matchEngine';
import { authMock } from '../../lib/authMock';
import { Job } from '../../types';

const JobDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [job, setJob] = useState<Job | null>(null);

    useEffect(() => {
        const loadJob = async () => {
            if (id) {
                const j = await jobsRepo.getJob(id);
                if (j) setJob(j);
                else navigate('/admin/pedidos');
            }
        };
        loadJob();
    }, [id, navigate]);

    const handleGenerateShortlist = async () => {
        if (!job) return;

        if (confirm("¿Generar nueva shortlist? Esto reemplazará cualquier lista anterior para este pedido.")) {
            // 1. Get Workers - fetch ALL for matching
            // In a real app we might filters in DB, but matchEngine needs all to score?
            // Let's filter by status active at least in DB if possible? 
            // workersRepo.listWorkers now supports filters? 
            // Checking workersRepo: yes, it takes partial filter.
            const allWorkers = await workersRepo.listWorkers({ status: 'active' });

            // 2. Run Match (Sync operation on memory data)
            const items = matchEngine.buildShortlist(job, allWorkers);

            // 3. Save Shortlist (Async?)
            const session = authMock.getSession();
            // shortlistsRepo not yet refactored to async, assumming sync for now or will refactor next.
            // If I assume it will be async, I should await it. Use await. 
            // If it is sync now, await is harmless (mostly). 
            // But I plan to refactor it.
            await shortlistsRepo.createShortlist({
                job_id: job.id,
                created_by: session?.email || 'system',
                items: items
            });

            // 4. Redirect
            navigate(`/admin/pedidos/${job.id}/shortlist`);
        }
    };

    const handleViewShortlist = () => {
        if (job) navigate(`/admin/pedidos/${job.id}/shortlist`);
    }

    if (!job) return <AdminLayout><div>Cargando...</div></AdminLayout>;

    const existingShortlist = shortlistsRepo.getShortlistByJobId(job.id);

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <Link to="/admin/pedidos" className="flex items-center text-slate-500 hover:text-brand-600">
                    &larr; Volver a pedidos
                </Link>
                <div className="flex space-x-3">
                    {existingShortlist ? (
                        <button onClick={handleViewShortlist} className="bg-white border border-brand-200 text-brand-700 px-4 py-2 rounded-lg font-semibold hover:bg-brand-50 shadow-sm">
                            Ver Shortlist Existente
                        </button>
                    ) : null}
                    <button
                        onClick={handleGenerateShortlist}
                        className="bg-brand-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-brand-700 shadow-md flex items-center"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>
                        {existingShortlist ? 'Regenerar Match' : 'Generar Match'}
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 p-6 border-b border-slate-200 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-slate-800">{job.title}</h1>
                        <div className="flex items-center space-x-4 mt-2 text-sm text-slate-600">
                            <span className="font-mono bg-slate-200 px-2 py-0.5 rounded text-slate-700">{job.job_code}</span>
                            <span>{job.location_city ? `${job.location_city}, ` : ''}{job.location_country}</span>
                            <span>{job.quantity} vacantes</span>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${job.status === 'open' ? 'bg-green-100 text-green-800' : 'bg-gray-100'
                                }`}>{job.status.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Requisitos</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs text-slate-400">Profesión</span>
                                <div className="font-medium">{job.profession_required}</div>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">Documentación</span>
                                <div className="font-medium">
                                    {job.documentation_required.length > 0 ? job.documentation_required.join(', ') : 'No especificada'}
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">Idiomas</span>
                                <div className="font-medium">
                                    {job.languages_required.length > 0 ? job.languages_required.join(', ') : 'No especificados'}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-3">Detalles Adicionales</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="block text-xs text-slate-400">Prioridad</span>
                                <div className="capitalize">{job.priority}</div>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">Notas</span>
                                <div className="text-sm text-slate-600 italic bg-slate-50 p-3 rounded border border-slate-100">
                                    {job.notes || 'Sin notas adicionales.'}
                                </div>
                            </div>
                            <div>
                                <span className="block text-xs text-slate-400">Fecha Creación</span>
                                <div>{new Date(job.created_at).toLocaleDateString()}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default JobDetail;
