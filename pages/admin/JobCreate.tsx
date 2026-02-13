import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { jobsRepo } from '../../lib/jobsRepo';
import { configRepo } from '../../lib/configRepo';
import { AppConfig, JobPriority, JobStatus } from '../../types';

const JobCreate: React.FC = () => {
  const navigate = useNavigate();
  const [config, setConfig] = useState<AppConfig>(configRepo.getConfigSync());

  const [formData, setFormData] = useState({
    title: '',
    profession_required: '',
    quantity: 1,
    location_country: 'España',
    location_city: '',
    documentation_required: [] as string[],
    languages_required: [] as string[],
    priority: 'medium' as JobPriority,
    notes: ''
  });

  useEffect(() => {
    const loadConfig = async () => {
      const data = await configRepo.getConfig();
      setConfig(data);
      // Set default profession if available and not set
      if (!formData.profession_required && data.job_profiles.length > 0) {
        setFormData(prev => ({ ...prev, profession_required: data.job_profiles[0] }));
      }
    };
    loadConfig();
  }, []);

  const inputStyle = "w-full rounded-lg border-slate-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 border bg-white text-slate-900";

  const toggleArrayItem = (field: 'documentation_required' | 'languages_required', value: string) => {
    setFormData(prev => {
      const list = prev[field];
      if (list.includes(value)) {
        return { ...prev, [field]: list.filter(i => i !== value) };
      } else {
        return { ...prev, [field]: [...list, value] };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    const job = await jobsRepo.createJob({
      ...formData,
      status: 'open'
    });

    if (job) {
      navigate(`/admin/pedidos/${job.id}`);
    } else {
      alert("Error al crear el pedido");
    }
  };

  return (
    <AdminLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Nuevo Pedido</h1>

        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 space-y-6">

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Título del Pedido *</label>
            <input
              type="text"
              required
              className={inputStyle}
              placeholder="Ej: Soldadores TIG para Proyecto Naval"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Profesión Requerida</label>
              <select
                className={inputStyle}
                value={formData.profession_required}
                onChange={e => setFormData({ ...formData, profession_required: e.target.value })}
              >
                <option value="" disabled>Seleccionar...</option>
                {config.job_profiles.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Cantidad de Vacantes</label>
              <input
                type="number"
                min="1"
                className={inputStyle}
                value={formData.quantity}
                onChange={e => setFormData({ ...formData, quantity: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">País</label>
              <select
                className={inputStyle}
                value={formData.location_country}
                onChange={e => setFormData({ ...formData, location_country: e.target.value })}
              >
                <option value="España">España</option>
                <option value="Portugal">Portugal</option>
                <option value="Francia">Francia</option>
                <option value="Alemania">Alemania</option>
                <option value="Bélgica">Bélgica</option>
                <option value="Holanda">Holanda</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Ciudad (Opcional)</label>
              <input
                type="text"
                className={inputStyle}
                value={formData.location_city}
                onChange={e => setFormData({ ...formData, location_city: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Documentación Requerida</label>
            <div className="space-y-2">
              {config.document_types.map(doc => (
                <label key={doc} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                    checked={formData.documentation_required.includes(doc)}
                    onChange={() => toggleArrayItem('documentation_required', doc)}
                  />
                  <span className="text-sm text-slate-700">{doc}</span>
                </label>
              ))}
              {config.document_types.length === 0 && <span className="text-sm text-slate-400">Cargando opciones...</span>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Idiomas Requeridos</label>
            <div className="flex flex-wrap gap-4">
              {config.languages.map(lang => (
                <label key={lang} className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="rounded text-brand-600 focus:ring-brand-500 w-4 h-4 border-slate-300"
                    checked={formData.languages_required.includes(lang)}
                    onChange={() => toggleArrayItem('languages_required', lang)}
                  />
                  <span className="text-sm text-slate-700">{lang}</span>
                </label>
              ))}
              {config.languages.length === 0 && <span className="text-sm text-slate-400">Cargando opciones...</span>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">Prioridad</label>
              <select
                className={inputStyle}
                value={formData.priority}
                onChange={e => setFormData({ ...formData, priority: e.target.value as JobPriority })}
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">Notas Internas</label>
            <textarea
              rows={3}
              className={inputStyle}
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Detalles sobre turno, salario, alojamiento, etc."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="submit"
              className="bg-brand-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-brand-700 shadow-md transition-colors"
            >
              Crear Pedido
            </button>
          </div>

        </form>
      </div>
    </AdminLayout>
  );
};

export default JobCreate;
