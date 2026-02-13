import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { stagingRepo } from '../../lib/stagingRepo';

import { CandidateSubmission, CandidateStatus } from '../../types';

// Same options as CandidateForm
const OFFER_OPTIONS = [
  "SOLDADOR MIG MAG/GMAW/FCAW",
  "SOLDADOR TIG/GTAW",
  "SOLDADOR ELECTRODO REVESTIDA/SMAW",
  "TUBERO",
  "ELECTRICISTA",
  "CALDERERO/ARMADOR",
  "MECÁNICO MONTADOR",
  "MONTADOR DE ESTRUCTURA",
  "PINTOR INDUSTRIAL",
  "OPERADOR CNC/TORNERO CNC",
  "AISLADOR TERMICO",
  "Otro"
];

const CandidateList: React.FC = () => {
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<CandidateSubmission[]>([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [daysFilter, setDaysFilter] = useState<number>(30);
  const [searchTerm, setSearchTerm] = useState('');

  // Multi-select Offer Filter
  const [offerFilter, setOfferFilter] = useState<string[]>([]);
  const [isOfferDropdownOpen, setIsOfferDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadData();

    // Click outside listener to close dropdown
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOfferDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [submissions, statusFilter, daysFilter, searchTerm, offerFilter]);

  const loadData = async () => {
    const data = await stagingRepo.listSubmissions();
    setSubmissions(data);
  };



  const handleClear = async () => {
    if (confirm("¿Estás seguro de borrar TODOS los candidatos?")) {
      await stagingRepo.clearStorage();
      loadData();
    }
  };

  const toggleOfferFilter = (offer: string) => {
    setOfferFilter(prev =>
      prev.includes(offer)
        ? prev.filter(o => o !== offer)
        : [...prev, offer]
    );
  };

  const applyFilters = () => {
    let result = [...submissions];

    // 1. Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }

    // 2. Date Filter
    if (daysFilter > 0) {
      const dateLimit = new Date();
      dateLimit.setDate(dateLimit.getDate() - daysFilter);
      result = result.filter(s => new Date(s.created_at) >= dateLimit);
    }

    // 3. Search Filter (Name, Phone, Email)
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.raw_name.toLowerCase().includes(lowerTerm) ||
        s.raw_phone.includes(lowerTerm) ||
        (s.raw_email && s.raw_email.toLowerCase().includes(lowerTerm))
      );
    }

    // 4. Offer Filter (Multi-select)
    if (offerFilter.length > 0) {
      result = result.filter(s => {
        // s.raw_payload.offer is a string like "TUBERO, SOLDADOR"
        // We check if ANY of the selected filters are present in the candidate's offer string
        return offerFilter.some(selectedOffer => {
          if (selectedOffer === 'Otro') {
            // Check if it starts with "Otro" or simply contains "Otro" logic depending on requirement
            return s.raw_payload.offer.includes('Otro');
          }
          return s.raw_payload.offer.includes(selectedOffer);
        });
      });
    }

    setFilteredSubmissions(result);
  };

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'new': return 'bg-yellow-100 text-yellow-800';
      case 'needs_review': return 'bg-blue-100 text-blue-800';
      case 'processed': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: CandidateStatus) => {
    switch (status) {
      case 'new': return 'Nuevo';
      case 'needs_review': return 'Revisión';
      case 'processed': return 'Procesado';
      case 'rejected': return 'Rechazado';
      default: return status;
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Candidatos</h1>
            <p className="text-sm text-slate-500">Gestión de solicitudes recibidas</p>
          </div>

          <div className="flex space-x-2">
            <Link to="/admin/candidatos/crear">
              <button
                className="bg-brand-600 hover:bg-brand-700 text-white px-3 py-2 rounded text-xs font-semibold flex items-center transition-colors shadow-sm"
              >
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                Nuevo Candidato
              </button>
            </Link>
            <button
              onClick={handleClear}
              className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-2 rounded text-xs font-semibold flex items-center transition-colors border border-red-200"
            >
              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
              Limpiar
            </button>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-slate-200 grid grid-cols-1 md:grid-cols-12 gap-4">

          {/* Status - 2 cols */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Estado</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full text-sm rounded border-slate-300 bg-slate-50 py-2 px-3 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value="all">Todos</option>
              <option value="new">Nuevo</option>
              <option value="needs_review">Revisión</option>
              <option value="processed">Procesado</option>
              <option value="rejected">Rechazado</option>
            </select>
          </div>

          {/* Period - 2 cols */}
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Período</label>
            <select
              value={daysFilter}
              onChange={(e) => setDaysFilter(Number(e.target.value))}
              className="w-full text-sm rounded border-slate-300 bg-slate-50 py-2 px-3 focus:ring-brand-500 focus:border-brand-500"
            >
              <option value={7}>Últimos 7 días</option>
              <option value={30}>Últimos 30 días</option>
              <option value={90}>Últimos 90 días</option>
              <option value={0}>Todo el historial</option>
            </select>
          </div>

          {/* Offer Filter (Multi) - 4 cols */}
          <div className="md:col-span-4 relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Ofertas (Multi-selección)</label>
            <button
              onClick={() => setIsOfferDropdownOpen(!isOfferDropdownOpen)}
              className="w-full text-left text-sm rounded border border-slate-300 bg-slate-50 py-2 px-3 focus:ring-brand-500 focus:border-brand-500 flex justify-between items-center"
            >
              <span className="truncate">
                {offerFilter.length === 0
                  ? "Todas las ofertas"
                  : `${offerFilter.length} seleccionada${offerFilter.length !== 1 ? 's' : ''}`
                }
              </span>
              <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
            </button>

            {isOfferDropdownOpen && (
              <div className="absolute z-10 mt-1 w-full bg-white shadow-lg rounded-md border border-slate-200 max-h-60 overflow-y-auto">
                <div className="p-2 space-y-1">
                  {OFFER_OPTIONS.map((option) => (
                    <label key={option} className="flex items-center px-2 py-1.5 hover:bg-slate-50 rounded cursor-pointer">
                      <input
                        type="checkbox"
                        checked={offerFilter.includes(option)}
                        onChange={() => toggleOfferFilter(option)}
                        className="rounded text-brand-600 focus:ring-brand-500 mr-2 h-4 w-4 border-slate-300"
                      />
                      <span className="text-xs text-slate-700 truncate">{option}</span>
                    </label>
                  ))}
                </div>
                <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-end">
                  <button
                    onClick={() => setOfferFilter([])}
                    className="text-xs text-brand-600 hover:text-brand-800 font-medium"
                  >
                    Limpiar filtros
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Search - 4 cols */}
          <div className="md:col-span-4">
            <label className="block text-xs font-semibold text-slate-500 mb-1">Buscar</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nombre, teléfono o email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full text-sm rounded border-slate-300 bg-slate-50 py-2 pl-9 px-3 focus:ring-brand-500 focus:border-brand-500"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Selected Filters Chips (Optional UX improvement) */}
        {offerFilter.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {offerFilter.map(offer => (
              <span key={offer} className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-brand-50 text-brand-700 border border-brand-100">
                {offer}
                <button onClick={() => toggleOfferFilter(offer)} className="ml-1 text-brand-400 hover:text-brand-900">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                </button>
              </span>
            ))}
            <button onClick={() => setOfferFilter([])} className="text-xs text-slate-500 hover:text-red-500 underline ml-2">
              Borrar filtros de ofertas
            </button>
          </div>
        )}

        {/* Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden border border-slate-200">
          {filteredSubmissions.length === 0 ? (
            <div className="p-12 text-center text-slate-500 flex flex-col items-center">
              <svg className="h-12 w-12 text-slate-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-base font-medium text-slate-600">No se encontraron candidatos</p>
              <p className="text-sm text-slate-400 mt-1">Prueba ajustar los filtros o genera datos de prueba.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Fecha</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Candidato</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Contacto</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Estado</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Acciones</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredSubmissions.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {new Date(sub.created_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-slate-900">{sub.raw_name}</div>
                        <div className="text-xs text-slate-400 max-w-[200px] truncate" title={sub.raw_payload.offer}>
                          {sub.raw_payload.offer.split(',')[0]}
                          {sub.raw_payload.offer.includes(',') && '...'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div>{sub.raw_phone}</div>
                        <div className="text-xs">{sub.raw_email || '-'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(sub.status)}`}>
                          {getStatusLabel(sub.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link
                          to={`/admin/candidatos/${sub.id}`}
                          className="text-brand-600 hover:text-brand-900 bg-brand-50 px-3 py-1 rounded-md opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          Ver Detalle
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="text-center text-xs text-slate-400">
          Total registros: {submissions.length} | Mostrando: {filteredSubmissions.length}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CandidateList;