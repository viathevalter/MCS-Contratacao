import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { workersRepo } from '../../lib/workersRepo';

import { Worker, WorkerStatus } from '../../types';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Badge } from '../../components/ui/Badge';
import { PageHeader } from '../../components/ui/PageHeader';
import { Card } from '../../components/ui/Card';

const WorkerList: React.FC = () => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<WorkerStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    const data = await workersRepo.listWorkers();
    setWorkers(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    let result = [...workers];

    if (statusFilter !== 'all') {
      result = result.filter(w => w.status === statusFilter);
    }

    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(w =>
        w.full_name.toLowerCase().includes(lowerTerm) ||
        w.worker_code.toLowerCase().includes(lowerTerm) ||
        w.phone.includes(lowerTerm) ||
        w.profession_primary.toLowerCase().includes(lowerTerm)
      );
    }

    setFilteredWorkers(result);
  }, [workers, statusFilter, searchTerm]);



  const handleClear = async () => {
    if (confirm("¿Estás seguro de borrar TODOS los trabajadores?")) {
      await workersRepo.clearStorage();
      loadData();
    }
  };

  const getStatusVariant = (status: WorkerStatus) => {
    switch (status) {
      case 'active': return 'success';
      case 'standby': return 'warning';
      case 'blocked': return 'error';
      default: return 'neutral';
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <PageHeader
          title="Trabajadores"
          description="Gestión de personal activo"
          actions={
            <>
              <Link to="/admin/trabajadores/crear">
                <Button
                  variant="primary"
                  size="sm"
                  leftIcon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>}
                >
                  Nuevo Trabajador
                </Button>
              </Link>

              <Button
                variant="danger"
                size="sm"
                onClick={handleClear}
                className="bg-red-50 text-red-600 hover:bg-red-100 border-red-200"
              >
                Limpiar
              </Button>
            </>
          }
        />

        {/* Filters */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Buscar"
            placeholder="Nombre, código, teléfono..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            leftIcon={
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            }
          />

          <Select
            label="Estado"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            options={[
              { value: 'all', label: 'Todos' },
              { value: 'active', label: 'Activo' },
              { value: 'standby', label: 'Standby' },
              { value: 'blocked', label: 'Bloqueado' }
            ]}
          />
        </div>

        {/* Table */}
        <Card noPadding>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Código</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nombre</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Profesión</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contacto</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredWorkers.map((worker) => (
                  <tr key={worker.id} className="hover:bg-slate-50 transition-colors group">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-500">
                      {worker.worker_code}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-slate-900">{worker.full_name}</div>
                      <div className="text-xs text-slate-400">{worker.location}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">
                      {worker.profession_primary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                      <div>{worker.phone}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={getStatusVariant(worker.status)}>
                        {worker.status.toUpperCase()}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link
                        to={`/admin/trabajadores/${worker.id}`}
                      >
                        <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          Ver Perfil
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
                {filteredWorkers.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                      No se encontraron trabajadores.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </AdminLayout>
  );
};

export default WorkerList;