import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import CommunicationPanel from '../../components/CommunicationPanel';
import { stagingRepo } from '../../lib/stagingRepo';
import { workersRepo } from '../../lib/workersRepo';
import { configRepo } from '../../lib/configRepo';
import { CandidateSubmission, CandidateStatus, AppConfig } from '../../types';

const CandidateDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState<CandidateSubmission | null>(null);
  const [internalNotes, setInternalNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Conversion Modal State
  const [showConvertModal, setShowConvertModal] = useState(false);
  const [convertData, setConvertData] = useState({
    full_name: '',
    phone: '',
    location: '',
    profession: '',
    documentation: '',
    tags: ''
  });

  // Standard Input Style from CandidateForm.tsx
  const inputStyle = "w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 border bg-white text-slate-900";

  // Constants for new fields - NOW FROM CONFIG
  const [config, setConfig] = useState<AppConfig | null>(null);

  useEffect(() => {
    configRepo.getConfig().then(setConfig);
  }, []);

  // Edit Personal Info Modal State
  const [showEditPersonalModal, setShowEditPersonalModal] = useState(false);
  const [editPersonalData, setEditPersonalData] = useState({
    nationality: '',
    has_driver_license: false,
    european_residence: '',
    location: '',
    social_security_countries: [] as string[],
    previous_companies: [] as string[]
  });

  // Edit Basic Info Modal State
  const [showEditBasicModal, setShowEditBasicModal] = useState(false);
  const [editBasicData, setEditBasicData] = useState({
    raw_name: '',
    raw_phone: '',
    raw_email: '',
    location: ''
  });

  useEffect(() => {
    const loadCandidate = async () => {
      if (id) {
        const data = await stagingRepo.getSubmission(id);
        if (data) {
          setSubmission(data);
          setInternalNotes(data.internal_notes || '');

          // Check if already converted
          const existingWorker = await workersRepo.getWorkerBySubmissionId(data.id);
          if (existingWorker) {
            // Optional: Redirect to worker or show alert
          }
        } else {
          navigate('/admin/candidatos');
        }
      }
    };
    loadCandidate();
  }, [id, navigate]);

  const handleStatusUpdate = async (status: CandidateStatus) => {
    if (!submission) return;

    setIsSaving(true);
    const updated = await stagingRepo.updateSubmission(submission.id, {
      status,
      internal_notes: internalNotes
    });

    if (updated) {
      setSubmission(updated);
    }
    setIsSaving(false);
  };

  const handleSaveNotes = async () => {
    if (!submission) return;
    setIsSaving(true);
    const updated = await stagingRepo.updateSubmission(submission.id, {
      internal_notes: internalNotes
    });
    if (updated) {
      setSubmission(updated);
    }
    setIsSaving(false);
  };

  const handleUpdateEntity = async (updates: any) => {
    if (submission) {
      const updated = await stagingRepo.updateSubmission(submission.id, updates);
      if (updated) setSubmission(updated);
    }
  };

  const openConvertModal = async () => {
    if (!submission) return;

    // Check if already exists
    const existing = await workersRepo.getWorkerBySubmissionId(submission.id);
    if (existing) {
      if (confirm("Este candidato ya fue convertido. ¿Ir al perfil del trabajador?")) {
        navigate(`/admin/trabajadores/${existing.id}`);
      }
      return;
    }

    // Pre-fill data
    setConvertData({
      full_name: submission.raw_name,
      phone: submission.raw_phone,
      location: submission.raw_payload.location,
      profession: submission.raw_payload.offer.split(',')[0], // Take first offer
      documentation: submission.raw_payload.documentation,
      tags: submission.raw_payload.offer.includes(',') ? 'Multiskill' : ''
    });
    setShowConvertModal(true);
  };

  const handleConvertSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;

    // 1. Create Worker
    const worker = await workersRepo.createWorker({
      full_name: convertData.full_name,
      phone: convertData.phone,
      location: convertData.location,
      profession_primary: convertData.profession,
      documentation_type: convertData.documentation,
      languages: submission.raw_payload.languages,
      status: 'active',
      source_submission_id: submission.id,
      tags: convertData.tags.split(',').map(t => t.trim()).filter(Boolean),
      email: submission.raw_email
    });

    if (!worker) {
      alert("Error al crear trabajador.");
      return;
    }

    // 2. Update Submission Status
    await stagingRepo.updateSubmission(submission.id, { status: 'processed' });

    // 3. Navigate
    navigate(`/admin/trabajadores/${worker.id}`);
  };

  const handleEditBasicSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;

    const updatedPayload = {
      ...submission.raw_payload,
      location: editBasicData.location
    };

    const updated = await stagingRepo.updateSubmission(submission.id, {
      raw_name: editBasicData.raw_name,
      raw_phone: editBasicData.raw_phone,
      raw_email: editBasicData.raw_email,
      raw_payload: updatedPayload
    });

    if (updated) {
      setSubmission(updated);
      setShowEditBasicModal(false);
    }
  };

  const openEditBasicModal = () => {
    if (!submission) return;
    setEditBasicData({
      raw_name: submission.raw_name,
      raw_phone: submission.raw_phone,
      raw_email: submission.raw_email || '',
      location: submission.raw_payload.location
    });
    setShowEditBasicModal(true);
  };

  const openEditPersonalModal = () => {
    if (!submission) return;
    setEditPersonalData({
      nationality: submission.raw_payload.nationality || '',
      has_driver_license: submission.raw_payload.has_driver_license || false,
      european_residence: submission.raw_payload.european_residence || '',
      location: submission.raw_payload.location,
      social_security_countries: submission.raw_payload.social_security_countries || [],
      previous_companies: submission.raw_payload.previous_companies || []
    });
    setShowEditPersonalModal(true);
  };

  const handleEditPersonalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!submission) return;

    const updatedPayload = {
      ...submission.raw_payload,
      nationality: editPersonalData.nationality,
      has_driver_license: editPersonalData.has_driver_license,
      european_residence: editPersonalData.european_residence,
      location: editPersonalData.location,
      social_security_countries: editPersonalData.social_security_countries,
      previous_companies: editPersonalData.previous_companies
    };

    const updated = await stagingRepo.updateSubmission(submission.id, { raw_payload: updatedPayload });
    if (updated) {
      setSubmission(updated);
      setShowEditPersonalModal(false);
    }
  };

  const toggleArraySelection = (field: 'social_security_countries' | 'previous_companies', value: string) => {
    setEditPersonalData(prev => {
      const current = prev[field];
      const exists = current.includes(value);
      return {
        ...prev,
        [field]: exists ? current.filter(item => item !== value) : [...current, value]
      };
    });
  };

  if (!submission || !config) return <AdminLayout><div>Cargando...</div></AdminLayout>;

  const SS_COUNTRIES = config.social_security_countries;
  const PREVIOUS_COMPANIES = config.previous_companies;

  if (!submission) return <AdminLayout><div>Cargando...</div></AdminLayout>;

  return (
    <AdminLayout>
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => navigate('/admin/candidatos')}
          className="flex items-center text-slate-500 hover:text-brand-600 transition-colors"
        >
          <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la lista
        </button>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-mono text-slate-400">ID: {submission.id}</span>
          {workersRepo.getWorkerBySubmissionId(submission.id) && (
            <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded text-xs font-bold border border-purple-200">
              CONVERTIDO
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column: Main Info */}
        <div className="lg:col-span-2 space-y-6">

          {/* Header Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex justify-between items-start mb-2">
              <h1 className="text-2xl font-bold text-slate-900">{submission.raw_name}</h1>
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
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                {submission.raw_phone}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {submission.raw_email || 'No email'}
              </div>
              <div className="flex items-center">
                <svg className="w-4 h-4 mr-2 opacity-75" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {submission.raw_payload.location}
              </div>
            </div>
          </div>

          {/* Personal Data Card (New) */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 relative">
            <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-2">
              <h3 className="text-lg font-bold text-slate-800">Datos Personales</h3>
              <button
                onClick={openEditPersonalModal}
                className="text-brand-600 hover:text-brand-800 text-sm font-semibold flex items-center"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Editar
              </button>
            </div>

            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div>
                <dt className="text-sm font-medium text-slate-500">Nacionalidad</dt>
                <dd className="mt-1 text-sm text-slate-900">{submission.raw_payload.nationality || 'No definida'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Licencia de Conducir</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {submission.raw_payload.has_driver_license ? (
                    <span className="text-green-600 font-semibold flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Sí
                    </span>
                  ) : 'No'}
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Residencia Europea</dt>
                <dd className="mt-1 text-sm text-slate-900">{submission.raw_payload.european_residence || 'No'}</dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-slate-500">Ubicación Actual</dt>
                <dd className="mt-1 text-sm text-slate-900">{submission.raw_payload.location}</dd>
              </div>

              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500">Documentación SS (Países)</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {submission.raw_payload.social_security_countries && submission.raw_payload.social_security_countries.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {submission.raw_payload.social_security_countries.map((country, i) => (
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
                  {submission.raw_payload.previous_companies && submission.raw_payload.previous_companies.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {submission.raw_payload.previous_companies.map((company, i) => (
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

          {/* Communication Panel */}
          <CommunicationPanel
            entity={submission}
            type="candidate"
            onUpdateEntity={handleUpdateEntity}
          />

          {/* Details Card */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-800 mb-4 border-b border-slate-100 pb-2">Información de la Solicitud</h3>

            <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <dt className="text-sm font-medium text-slate-500">Ofertas Seleccionadas</dt>
                <dd className="mt-1 text-sm text-slate-900 bg-brand-50 p-3 rounded-lg border border-brand-100">
                  {submission.raw_payload.offer}
                </dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-slate-500">Documentación</dt>
                <dd className="mt-1 text-sm text-slate-900">{submission.raw_payload.documentation}</dd>
              </div>

              <div>
                <dt className="text-sm font-medium text-slate-500">Idiomas</dt>
                <dd className="mt-1 text-sm text-slate-900">
                  {submission.raw_payload.languages.map((lang, idx) => (
                    <span key={idx} className="inline-block bg-slate-100 rounded px-2 py-1 text-xs font-semibold text-slate-700 mr-2 mb-1">
                      {lang}
                    </span>
                  ))}
                </dd>
              </div>

              {submission.raw_payload.file_meta && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Adjunto</dt>
                  <dd className="mt-1 text-sm text-slate-900 flex items-center p-2 border rounded bg-slate-50">
                    <svg className="w-5 h-5 mr-2 text-slate-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a1 1 0 112 0v4a7 7 0 11-14 0V7a5 5 0 0110 0v4a3 3 0 11-6 0V7a1 1 0 012 0v4a1 1 0 102 0V7a3 3 0 00-3-3z" clipRule="evenodd" />
                    </svg>
                    {submission.raw_payload.file_meta.name}
                    <span className="ml-2 text-slate-400 text-xs">({(submission.raw_payload.file_meta.size / 1024).toFixed(1)} KB)</span>
                  </dd>
                </div>
              )}

              {submission.raw_payload.observations && (
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-slate-500">Observaciones del Candidato</dt>
                  <dd className="mt-1 text-sm text-slate-900 italic p-3 bg-gray-50 rounded border border-gray-100">
                    "{submission.raw_payload.observations}"
                  </dd>
                </div>
              )}
            </dl>
          </div>
        </div>

        {/* Right Column: Management */}
        <div className="space-y-6">

          {/* Conversion Action */}
          <div className="bg-brand-900 p-6 rounded-xl shadow-lg border border-brand-800 text-white">
            <h3 className="text-sm font-bold text-brand-200 uppercase tracking-wider mb-4">Contratación</h3>
            <p className="text-xs text-brand-100 mb-4 opacity-80">
              Si este candidato cumple con los requisitos, conviértelo en trabajador para gestionar sus asignaciones.
            </p>
            <button
              onClick={openConvertModal}
              className="w-full py-3 bg-white text-brand-900 font-bold rounded-lg hover:bg-brand-50 transition-colors shadow-md flex justify-center items-center"
            >
              <svg className="w-5 h-5 mr-2 text-brand-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              CONVERTIR EN TRABAJADOR
            </button>
          </div>

          {/* Status Actions */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4">Gestión de Estado</h3>

            <div className="space-y-3">
              <button
                onClick={() => handleStatusUpdate('processed')}
                disabled={submission.status === 'processed'}
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${submission.status === 'processed' ? 'bg-green-400 cursor-default' : 'bg-green-600 hover:bg-green-700'}
                `}
              >
                {submission.status === 'processed' ? '✓ Procesado' : 'Marcar como PROCESADO'}
              </button>

              <button
                onClick={() => handleStatusUpdate('needs_review')}
                disabled={submission.status === 'needs_review'}
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${submission.status === 'needs_review' ? 'bg-blue-400 cursor-default' : 'bg-blue-600 hover:bg-blue-700'}
                `}
              >
                {submission.status === 'needs_review' ? '✓ En Revisión' : 'Marcar para REVISIÓN'}
              </button>

              <button
                onClick={() => handleStatusUpdate('rejected')}
                disabled={submission.status === 'rejected'}
                className={`w-full flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white 
                  ${submission.status === 'rejected' ? 'bg-red-300 cursor-default' : 'bg-red-600 hover:bg-red-700'}
                `}
              >
                {submission.status === 'rejected' ? '✕ Rechazado' : 'RECHAZAR'}
              </button>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Notas Internas</h3>
            <textarea
              rows={6}
              className="w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 border bg-white text-slate-900 text-sm"
              placeholder="Escriba notas privadas sobre este candidato..."
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              onBlur={handleSaveNotes}
            />
            <p className="mt-2 text-xs text-slate-400 text-right">
              {isSaving ? 'Guardando...' : 'Se guarda automáticamente al salir del campo'}
            </p>
          </div>

        </div>
      </div>

      {/* Convert Modal */}
      {showConvertModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900 bg-opacity-75 backdrop-blur-sm">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto">
            <form onSubmit={handleConvertSubmit}>
              <div className="p-6 border-b border-slate-200 bg-slate-50 rounded-t-xl">
                <h2 className="text-xl font-bold text-slate-800">Crear Nuevo Trabajador</h2>
                <p className="text-sm text-slate-500">Revise y ajuste los datos antes de crear el perfil.</p>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nombre Completo</label>
                  <input
                    type="text"
                    required
                    className={inputStyle}
                    value={convertData.full_name}
                    onChange={e => setConvertData({ ...convertData, full_name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Teléfono</label>
                    <input
                      type="text"
                      required
                      className={inputStyle}
                      value={convertData.phone}
                      onChange={e => setConvertData({ ...convertData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Ubicación</label>
                    <input
                      type="text"
                      required
                      className={inputStyle}
                      value={convertData.location}
                      onChange={e => setConvertData({ ...convertData, location: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Profesión Principal</label>
                  <input
                    type="text"
                    required
                    className={inputStyle}
                    value={convertData.profession}
                    onChange={e => setConvertData({ ...convertData, profession: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Documentación</label>
                  <input
                    type="text"
                    className={inputStyle}
                    value={convertData.documentation}
                    onChange={e => setConvertData({ ...convertData, documentation: e.target.value })}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Tags (separados por coma)</label>
                  <input
                    type="text"
                    className={inputStyle}
                    value={convertData.tags}
                    placeholder="Ej: TIG, B1, Disponibilidad Inmediata"
                    onChange={e => setConvertData({ ...convertData, tags: e.target.value })}
                  />
                </div>

                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex">
                    <svg className="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-blue-700">
                      Al confirmar, el estado del candidato pasará a <strong>PROCESADO</strong> y se generará un código de trabajador único (ej: E0001).
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-slate-50 rounded-b-xl flex justify-end space-x-3 border-t border-slate-200">
                <button
                  type="button"
                  onClick={() => setShowConvertModal(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800 font-medium transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-brand-600 text-white rounded-lg font-bold hover:bg-brand-700 shadow-md transition-colors"
                >
                  Confirmar Alta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Documentación SS</label>
                      <div className="grid grid-cols-2 gap-3">
                        {SS_COUNTRIES.map(country => (
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
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-slate-700 mb-3">Experiencia en Grupo</label>
                      <div className="grid grid-cols-2 gap-3">
                        {PREVIOUS_COMPANIES.map(company => (
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

    </AdminLayout>
  );
};

export default CandidateDetail;