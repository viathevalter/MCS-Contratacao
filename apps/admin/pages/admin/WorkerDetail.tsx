import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import CommunicationPanel from '../../components/CommunicationPanel';
import { workersRepo } from '../../lib/workersRepo';
import { stagingRepo } from '../../lib/stagingRepo';
import { authMock } from '../../lib/authMock';
import { Worker, WorkerNote, WorkerStatus, CandidateSubmission, AppConfig } from '../../types';
import { configRepo } from '../../lib/configRepo';

const WorkerDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [worker, setWorker] = useState<Worker | null>(null);
    const [notes, setNotes] = useState<WorkerNote[]>([]);
    const [newNote, setNewNote] = useState('');
    const [linkedSubmission, setLinkedSubmission] = useState<CandidateSubmission | undefined>(undefined);

    const [config, setConfig] = useState<AppConfig>(configRepo.getConfigSync());

    // Refresh config on mount
    useEffect(() => {
        const load = async () => {
            const data = await configRepo.getConfig();
            setConfig(data);
        };
        load();
    }, []);

    // Standard Input Style matching CandidateForm
    const inputStyle = "w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 border bg-white text-slate-900";

    // Edit Personal Info Modal State
    const [showEditPersonalModal, setShowEditPersonalModal] = useState(false);
    const [editPersonalData, setEditPersonalData] = useState({
        nationality: '',
        has_driver_license: false,
        european_residence: '',
        location: '',
        social_security_countries: [] as string[],
        previous_companies: [] as string[],
        job_profiles: [] as string[]
    });

    // Edit Basic Info Modal State
    const [showEditBasicModal, setShowEditBasicModal] = useState(false);
    const [editBasicData, setEditBasicData] = useState({
        full_name: '',
        phone: '',
        email: '',
        location: '',
        profession_primary: ''
    });

    useEffect(() => {
        const loadWorker = async () => {
            if (id) {
                const data = await workersRepo.getWorker(id);
                if (data) {
                    setWorker(data);

                    // Notes are now separate
                    const fetchedNotes = await workersRepo.getNotes(id);
                    setNotes(fetchedNotes);

                    // Fetch Submission if exists
                    if (data.source_submission_id) {
                        const sub = await stagingRepo.getSubmission(data.source_submission_id);
                        if (sub) setLinkedSubmission(sub);
                    }
                } else {
                    navigate('/admin/trabajadores');
                }
            }
        };
        loadWorker();
    }, [id, navigate]);

    const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
        if (!worker) return;
        const newStatus = e.target.value as WorkerStatus;
        const updated = await workersRepo.updateWorker(worker.id, { status: newStatus });
        if (updated) setWorker(updated);
    };

    const handleUpdateEntity = async (updates: any) => {
        if (worker) {
            const updated = await workersRepo.updateWorker(worker.id, updates);
            if (updated) setWorker(updated);
        }
    };

    const openEditPersonalModal = () => {
        if (!worker) return;
        setEditPersonalData({
            nationality: worker.nationality || '',
            has_driver_license: worker.has_driver_license || false,
            european_residence: worker.european_residence || '',
            location: worker.location,
            social_security_countries: worker.social_security_countries || [],
            previous_companies: worker.previous_companies || [],
            job_profiles: worker.job_profiles || []
        });
        setShowEditPersonalModal(true);
    };

    const handleEditPersonalSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!worker) return;

        const updated = await workersRepo.updateWorker(worker.id, {
            nationality: editPersonalData.nationality,
            has_driver_license: editPersonalData.has_driver_license,
            european_residence: editPersonalData.european_residence,
            location: editPersonalData.location,
            social_security_countries: editPersonalData.social_security_countries,
            previous_companies: editPersonalData.previous_companies,
            job_profiles: editPersonalData.job_profiles
        });

        if (updated) {
            setWorker(updated);
            setShowEditPersonalModal(false);
        }
    };

    const openEditBasicModal = () => {
        if (!worker) return;
        setEditBasicData({
            full_name: worker.full_name,
            phone: worker.phone,
            email: worker.email || '',
            location: worker.location,
            profession_primary: worker.profession_primary || ''
        });
        setShowEditBasicModal(true);
    };

    const handleEditBasicSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!worker) return;

        const updated = await workersRepo.updateWorker(worker.id, {
            full_name: editBasicData.full_name,
            phone: editBasicData.phone,
            email: editBasicData.email,
            location: editBasicData.location,
            profession_primary: editBasicData.profession_primary
        });

        if (updated) {
            setWorker(updated);
            setShowEditBasicModal(false);
        }
    };

    const toggleArraySelection = (field: 'social_security_countries' | 'previous_companies' | 'job_profiles', value: string) => {
        setEditPersonalData(prev => {
            const current = prev[field] || [];
            const exists = current.includes(value);
            return {
                ...prev,
                [field]: exists ? current.filter(item => item !== value) : [...current, value]
            };
        });
    };

    const handleDeleteWorker = () => {
        if (!worker) return;
        if (confirm('¿Estás seguro de que quieres eliminar este trabajador? Esta acción no se puede deshacer.')) {
            workersRepo.deleteWorker(worker.id);
            navigate('/admin/trabajadores');
        }
    };

    const handleAddNote = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!worker || !newNote.trim()) return;

        const session = authMock.getSession();
        const note = await workersRepo.addNote(worker.id, session?.email || 'admin', newNote);
        if (note) {
            setNotes([note, ...notes]);
            setNewNote('');
        }
    };

    if (!worker) return <AdminLayout><div className="p-8">Cargando...</div></AdminLayout>;

    return (
        <AdminLayout>
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/trabajadores')}
                    className="flex items-center text-slate-500 hover:text-brand-600 transition-colors"
                >
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Volver a la lista
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Profile */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Header Card */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-6">
                            <span className="text-4xl font-black text-slate-100">{worker.worker_code}</span>
                        </div>

                        <div className="relative z-10">
                            <div className="flex items-center space-x-4 mb-4">
                                <div className="w-16 h-16 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 text-2xl font-bold">
                                    {worker.full_name.charAt(0)}
                                </div>
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h1 className="text-2xl font-bold text-slate-900">{worker.full_name}</h1>
                                        <button
                                            onClick={openEditBasicModal}
                                            className="text-brand-600 hover:text-brand-800 p-1 rounded hover:bg-brand-50 transition-colors"
                                            title="Editar Información Básica"
                                        >
                                            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                        </button>
                                    </div>
                                    <p className="text-slate-500 font-medium">{worker.profession_primary}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                    <span className="block text-xs text-slate-400 uppercase">Teléfono</span>
                                    <span className="font-medium text-slate-700">{worker.phone}</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                    <span className="block text-xs text-slate-400 uppercase">Ubicación</span>
                                    <span className="font-medium text-slate-700">{worker.location}</span>
                                </div>
                                <div className="bg-slate-50 p-3 rounded border border-slate-100">
                                    <span className="block text-xs text-slate-400 uppercase">Email</span>
                                    <span className="font-medium text-slate-700 truncate">{worker.email || '-'}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Personal Data Section */}
                    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                        <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                            <h3 className="text-lg font-bold text-slate-800">Datos Personales</h3>
                            <button
                                onClick={openEditPersonalModal}
                                className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"
                            >
                                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                Editar
                            </button>
                        </div>
                        <div className="p-6">
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                <div>
                                    <dt className="text-sm font-medium text-slate-500">Nacionalidad</dt>
                                    <dd className="mt-1 text-sm text-slate-900">{worker.nationality || <span className="text-slate-400 italic">No definida</span>}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500">Licencia de Conducir</dt>
                                    <dd className="mt-1 text-sm text-slate-900">{worker.has_driver_license ? 'Sí' : 'No'}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500">Residencia Europea</dt>
                                    <dd className="mt-1 text-sm text-slate-900">{worker.european_residence || <span className="text-slate-400">No</span>}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-slate-500">Ubicación Actual</dt>
                                    <dd className="mt-1 text-sm text-slate-900">{worker.location}</dd>
                                </div>

                                <div className="sm:col-span-2 border-t border-slate-100 pt-4 mt-2">
                                    <dt className="text-sm font-medium text-slate-500 mb-2">Perfiles de Vaga</dt>
                                    <dd className="text-sm text-slate-900">
                                        {worker.job_profiles && worker.job_profiles.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {worker.job_profiles.map((profile, i) => (
                                                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                                                        {profile}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">Ninguno seleccionado</span>
                                        )}
                                    </dd>
                                </div>

                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-slate-500">Documentación SS (Países)</dt>
                                    <dd className="mt-1 text-sm text-slate-900">
                                        {worker.social_security_countries && worker.social_security_countries.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {worker.social_security_countries.map((country, i) => (
                                                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                        {country}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">Ninguno seleccionado</span>
                                        )}
                                    </dd>
                                </div>

                                <div className="sm:col-span-2">
                                    <dt className="text-sm font-medium text-slate-500">Experiencia en Grupo</dt>
                                    <dd className="mt-1 text-sm text-slate-900">
                                        {worker.previous_companies && worker.previous_companies.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {worker.previous_companies.map((company, i) => (
                                                    <span key={i} className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                                                        {company}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <span className="text-slate-400 italic">Ninguna seleccionada</span>
                                        )}
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </div>

                    {/* Communication Panel */}
                    <CommunicationPanel
                        entity={worker}
                        type="worker"
                        onUpdateEntity={handleUpdateEntity}
                    />

                    {/* Details */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Información Profesional</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-medium text-slate-500 block mb-1">Idiomas</span>
                                <div className="flex flex-wrap gap-2">
                                    {worker.languages.map((lang, i) => (
                                        <span key={i} className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-500 block mb-1">Documentación</span>
                                <p className="text-sm text-slate-800">{worker.documentation_type}</p>
                            </div>
                            <div>
                                <span className="text-sm font-medium text-slate-500 block mb-1">Tags</span>
                                <div className="flex flex-wrap gap-2">
                                    {worker.tags.map((tag, i) => (
                                        <span key={i} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded">
                                            {tag}
                                        </span>
                                    ))}
                                    {worker.tags.length === 0 && <span className="text-xs text-slate-400">-</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Source Info */}
                    {linkedSubmission && (
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-bold text-slate-800">Origen del Candidato</h3>
                                <Link to={`/admin/candidatos/${linkedSubmission.id}`} className="text-sm text-brand-600 hover:underline">
                                    Ver solicitud original
                                </Link>
                            </div>
                            <div className="bg-slate-50 p-4 rounded border border-slate-200 text-sm">
                                <p className="mb-2"><span className="font-semibold">Fecha postulación:</span> {new Date(linkedSubmission.created_at).toLocaleDateString()}</p>
                                {linkedSubmission.raw_payload.file_meta && (
                                    <div className="flex items-center text-slate-600 bg-white p-2 rounded border border-slate-200 w-fit">
                                        <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                                        {linkedSubmission.raw_payload.file_meta.name}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Actions & Notes */}
                <div className="space-y-6">

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Estado del Trabajador</label>
                        <select
                            value={worker.status}
                            onChange={handleStatusChange}
                            className={inputStyle}
                        >
                            <option value="active">Activo</option>
                            <option value="standby">Standby</option>
                            <option value="blocked">Bloqueado</option>
                        </select>
                        <div className={`mt-3 text-xs p-2 rounded ${worker.status === 'active' ? 'bg-green-50 text-green-700' :
                            worker.status === 'blocked' ? 'bg-red-50 text-red-700' : 'bg-yellow-50 text-yellow-700'
                            }`}>
                            {worker.status === 'active' ? 'El trabajador está disponible para asignaciones.' :
                                worker.status === 'blocked' ? 'No asignar. Contactar RRHH.' : 'En espera de disponibilidad.'}
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 flex flex-col h-[400px]">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Notas Internas</h3>

                        <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2">
                            {notes.length === 0 ? (
                                <p className="text-center text-slate-400 text-sm italic py-4">Sin notas registradas.</p>
                            ) : (
                                notes.map(note => (
                                    <div key={note.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                                        <div className="flex justify-between items-center mb-1">
                                            <span className="font-bold text-slate-700 text-xs">{note.author}</span>
                                            <span className="text-[10px] text-slate-400">{new Date(note.created_at).toLocaleDateString()}</span>
                                        </div>
                                        <p className="text-slate-600">{note.content}</p>
                                    </div>
                                ))
                            )}
                        </div>

                        <form onSubmit={handleAddNote} className="mt-auto">
                            <textarea
                                className={inputStyle + " mb-2"}
                                rows={2}
                                placeholder="Escribir nota..."
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                            />
                            <button
                                type="submit"
                                disabled={!newNote.trim()}
                                className="w-full bg-slate-800 text-white py-2 rounded-lg text-sm hover:bg-slate-900 disabled:opacity-50 transition-colors shadow-sm"
                            >
                                Agregar Nota
                            </button>
                        </form>
                    </div>

                    {/* Delete Button Area */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100">
                        <h3 className="text-sm font-bold text-red-800 uppercase tracking-wider mb-2">Zona de Peligro</h3>
                        <p className="text-xs text-slate-500 mb-4">Eliminar este trabajador borrará todos sus datos y notas asociadas permanetemente.</p>
                        <button
                            onClick={handleDeleteWorker}
                            className="w-full border border-red-200 text-red-600 bg-red-50 py-2 rounded-lg text-sm hover:bg-red-100 hover:text-red-700 transition-colors"
                        >
                            Eliminar Trabajador
                        </button>
                    </div>

                </div>

            </div>

            {/* Edit Personal Data Modal */}
            {showEditPersonalModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-opacity-75 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleEditPersonalSubmit}>
                            <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                                <h2 className="text-xl font-bold text-slate-800">Editar Datos Personales</h2>
                            </div>

                            <div className="p-6 space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Nacionalidad</label>
                                        <input
                                            type="text"
                                            className={inputStyle}
                                            value={editPersonalData.nationality}
                                            onChange={e => setEditPersonalData({ ...editPersonalData, nationality: e.target.value })}
                                            placeholder="Ej: Española, Rumana..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">¿Tiene licencia de conducir?</label>
                                        <select
                                            className={inputStyle}
                                            value={editPersonalData.has_driver_license ? 'yes' : 'no'}
                                            onChange={e => setEditPersonalData({ ...editPersonalData, has_driver_license: e.target.value === 'yes' })}
                                        >
                                            <option value="no">No</option>
                                            <option value="yes">Sí</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Residencia Europea (País)</label>
                                        <input
                                            type="text"
                                            className={inputStyle}
                                            value={editPersonalData.european_residence}
                                            onChange={e => setEditPersonalData({ ...editPersonalData, european_residence: e.target.value })}
                                            placeholder="Ej: España, Francia... (Dejar vacío si no tiene)"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación Actual</label>
                                        <input
                                            type="text"
                                            className={inputStyle}
                                            value={editPersonalData.location}
                                            onChange={e => setEditPersonalData({ ...editPersonalData, location: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div className="border-t border-slate-100 pt-6">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-semibold text-slate-700 mb-3">Perfiles de Vaga</label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {config.job_profiles.map(profile => (
                                                    <label key={profile} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-2 rounded cursor-pointer hover:bg-slate-100 border border-slate-100">
                                                        <input
                                                            type="checkbox"
                                                            className="rounded text-brand-600 focus:ring-brand-500"
                                                            checked={editPersonalData.job_profiles.includes(profile)}
                                                            onChange={() => toggleArraySelection('job_profiles', profile)}
                                                        />
                                                        <span className="truncate" title={profile}>{profile}</span>
                                                    </label>
                                                ))}
                                                {config.job_profiles.length === 0 && <span className="text-sm text-slate-400 italic">No hay perfiles configurados.</span>}
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-3">Documentación SS</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {config.social_security_countries.map(country => (
                                                        <label key={country} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-2 rounded cursor-pointer hover:bg-slate-100 border border-slate-100">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded text-brand-600 focus:ring-brand-500"
                                                                checked={editPersonalData.social_security_countries.includes(country)}
                                                                onChange={() => toggleArraySelection('social_security_countries', country)}
                                                            />
                                                            <span>{country}</span>
                                                        </label>
                                                    ))}
                                                    {config.social_security_countries.length === 0 && <span className="text-sm text-slate-400 italic col-span-2">Sin opciones.</span>}
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-slate-700 mb-3">Experiencia en Grupo</label>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {config.previous_companies.map(company => (
                                                        <label key={company} className="flex items-center space-x-2 text-sm text-slate-600 bg-slate-50 p-2 rounded cursor-pointer hover:bg-slate-100 border border-slate-100">
                                                            <input
                                                                type="checkbox"
                                                                className="rounded text-brand-600 focus:ring-brand-500"
                                                                checked={editPersonalData.previous_companies.includes(company)}
                                                                onChange={() => toggleArraySelection('previous_companies', company)}
                                                            />
                                                            <span className="truncate" title={company}>{company}</span>
                                                        </label>
                                                    ))}
                                                    {config.previous_companies.length === 0 && <span className="text-sm text-slate-400 italic col-span-2">Sin opciones.</span>}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end space-x-3 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setShowEditPersonalModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 shadow-md transition-colors"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showEditBasicModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-opacity-75 backdrop-blur-sm">
                    <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
                        <form onSubmit={handleEditBasicSubmit}>
                            <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                                <h2 className="text-xl font-bold text-slate-800">Editar Información Básica</h2>
                            </div>

                            <div className="p-6 space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                                    <input
                                        type="text"
                                        required
                                        className={inputStyle}
                                        value={editBasicData.full_name}
                                        onChange={e => setEditBasicData({ ...editBasicData, full_name: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                                    <input
                                        type="text"
                                        required
                                        className={inputStyle}
                                        value={editBasicData.phone}
                                        onChange={e => setEditBasicData({ ...editBasicData, phone: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        className={inputStyle}
                                        value={editBasicData.email}
                                        onChange={e => setEditBasicData({ ...editBasicData, email: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación</label>
                                    <input
                                        type="text"
                                        required
                                        className={inputStyle}
                                        value={editBasicData.location}
                                        onChange={e => setEditBasicData({ ...editBasicData, location: e.target.value })}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1">Profesión Principal</label>
                                    <input
                                        type="text"
                                        className={inputStyle}
                                        value={editBasicData.profession_primary}
                                        onChange={e => setEditBasicData({ ...editBasicData, profession_primary: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end space-x-3 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={() => setShowEditBasicModal(false)}
                                    className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 shadow-md transition-colors"
                                >
                                    Guardar Cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default WorkerDetail;