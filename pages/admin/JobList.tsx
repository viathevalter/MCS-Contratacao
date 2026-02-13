import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { jobsRepo } from '../../lib/jobsRepo';
import { seedJobs } from '../../lib/seed';
import { Job, JobStatus } from '../../types';

const JobList: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const data = await jobsRepo.listJobs();
    setJobs(data);
  };

  const handleSeed = async () => {
    if (confirm("¿Generar datos de prueba? (Trabajadores y Pedidos)")) {
      await seedJobs();
      // Wait a bit for DB propagation if needed, mostly sync though
      setTimeout(() => {
        loadData();
      }, 500);
    }
  }

  const handleClear = async () => {
    if (confirm('¿Borrar todos los pedidos?')) {
      // jobsRepo doesn't have clearAll but logic was just clearing storage. 
      // For Supabase we might need a dangerous delete all or just skip this.
      // Let's implement individual deletes or just disable this button for now.
      alert("Función deshabilitada en modo base de datos");
    }
  }

  const getStatusColor = (status: JobStatus) => {
    switch (status) {
      case 'open': return 'bg-green-100 text-green-800';
      case 'paused': return 'bg-yellow-100 text-yellow-800';
      case 'closed': return 'bg-gray-100 text-gray-600';
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high': return <span className="text-xs font-bold text-red-600">ALTA</span>;
      case 'medium': return <span className="text-xs font-semibold text-yellow-600">MEDIA</span>;
      case 'low': return <span className="text-xs text-slate-500">BAJA</span>;
    }
  }

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Pedidos / Vagas</h1>
            <p className="text-sm text-slate-500">Gestión de oportunidades de empleo</p>
          </div>

          <div className="flex space-x-2">
            <button onClick={handleSeed} className="text-xs bg-slate-200 px-2 rounded hover:bg-slate-300">Demo</button>
            <button onClick={handleClear} className="text-xs bg-slate-200 px-2 rounded hover:bg-slate-300">Limpiar</button>
            <Link
              to="/admin/pedidos/nuevo"
              className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-sm font-semibold flex items-center transition-colors shadow-sm"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Nuevo Pedido
            </Link>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg overflow-hidden border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Título / Profesión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Ubicación</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Prioridad</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                      {job.job_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-slate-900">{job.title}</div>
                      <div className="text-xs text-slate-500">{job.profession_required} ({job.quantity} vacantes)</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {job.location_city ? `${job.location_city}, ` : ''}{job.location_country}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPriorityBadge(job.priority)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(job.status)}`}>
                        {job.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/pedidos/${job.id}`}
                        className="text-brand-600 hover:text-brand-900 bg-brand-50 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Ver Detalle
                      </Link>
                    </td>
                  </tr>
                ))}
                {jobs.length === 0 && (
                  <tr><td colSpan={6} className="text-center py-10 text-slate-500">No hay pedidos registrados.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default JobList;
