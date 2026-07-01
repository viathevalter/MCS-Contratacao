import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/AdminLayout';
import { stagingRepo } from '../../lib/stagingRepo';
import { configRepo } from '../../lib/configRepo';
import { CandidateSubmission, CandidateStatus } from '../../types';
import { 
  Users, 
  Car, 
  Globe, 
  ShieldAlert, 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  Check, 
  X, 
  Plus,
  Trash2
} from 'lucide-react';

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

const DOCUMENTATION_OPTIONS = [
  "Pasaporte de la UE (Europeo)",
  "Permiso de trabalho válido",
  "Visa de estudante",
  "En trámite / Sin documentos",
  "Otro"
];

const CandidateList: React.FC = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [filteredSubmissions, setFilteredSubmissions] = useState<CandidateSubmission[]>([]);
  
  // Dynamic lists from DB + Configs
  const [countriesList, setCountriesList] = useState<string[]>([]);
  const [documentationList, setDocumentationList] = useState<string[]>([]);
  const [ssCountriesList, setSsCountriesList] = useState<string[]>([]);

  // Filters
  const [statusFilter, setStatusFilter] = useState<CandidateStatus | 'all'>('all');
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [searchTerm, setSearchTerm] = useState('');

  // Dropdown states for multi-selects
  const [offerFilter, setOfferFilter] = useState<string[]>([]);
  const [isOfferDropdownOpen, setIsOfferDropdownOpen] = useState(false);
  const offerDropdownRef = useRef<HTMLDivElement>(null);

  const [countryFilter, setCountryFilter] = useState<string[]>([]);
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  const [documentationFilter, setDocumentationFilter] = useState<string[]>([]);
  const [isDocumentationDropdownOpen, setIsDocumentationDropdownOpen] = useState(false);
  const documentationDropdownRef = useRef<HTMLDivElement>(null);

  const [ssFilter, setSsFilter] = useState<string[]>([]);
  const [isSsDropdownOpen, setIsSsDropdownOpen] = useState(false);
  const ssDropdownRef = useRef<HTMLDivElement>(null);

  const [hasDriverLicenseFilter, setHasDriverLicenseFilter] = useState<'all' | 'yes' | 'no'>('all');
  const [europeanResidenceFilter, setEuropeanResidenceFilter] = useState<'all' | 'yes' | 'no'>('all');

  // Toggle Advanced Filters
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Sorting states
  const [sortField, setSortField] = useState<'created_at' | 'raw_name'>('created_at');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc'); // default: desc (recent first)

  useEffect(() => {
    loadData();

    // Click outside listener to close dropdowns
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      if (offerDropdownRef.current && !offerDropdownRef.current.contains(target)) {
        setIsOfferDropdownOpen(false);
      }
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(target)) {
        setIsCountryDropdownOpen(false);
      }
      if (documentationDropdownRef.current && !documentationDropdownRef.current.contains(target)) {
        setIsDocumentationDropdownOpen(false);
      }
      if (ssDropdownRef.current && !ssDropdownRef.current.contains(target)) {
        setIsSsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    applyFilters();
  }, [
    submissions, 
    statusFilter, 
    dateRange, 
    searchTerm, 
    offerFilter, 
    countryFilter, 
    documentationFilter, 
    hasDriverLicenseFilter, 
    europeanResidenceFilter,
    ssFilter,
    sortField,
    sortOrder
  ]);

  const loadData = async () => {
    const data = await stagingRepo.listSubmissions();
    setSubmissions(data);

    // 1. Extrair países (País de Residencia) únicos
    const dbCountries = data
      .map(s => s.raw_payload.current_country?.trim())
      .filter((c): c is string => !!c);
    const uniqueCountries = Array.from(new Set(dbCountries)).sort();
    setCountriesList(uniqueCountries);

    // 2. Extrair documentações únicas do banco + padrão
    const dbDocs = data
      .map(s => s.raw_payload.documentation?.trim())
      .filter((d): d is string => !!d);
    const uniqueDocs = Array.from(
      new Set([...DOCUMENTATION_OPTIONS, ...dbDocs])
    ).sort();
    setDocumentationList(uniqueDocs);

    // 3. Extrair Segurança Social
    const cfg = await configRepo.getConfig();
    const configSs = cfg?.social_security_countries || [];
    const dbSs = data
      .flatMap(s => s.raw_payload.social_security_countries || [])
      .filter((c): c is string => !!c);
    const uniqueSs = Array.from(
      new Set([...configSs, ...dbSs])
    ).sort();
    setSsCountriesList(uniqueSs);
  };

  const handleClear = async () => {
    if (confirm("¿Estás seguro de borrar TODOS los candidatos?")) {
      await stagingRepo.clearStorage();
      loadData();
    }
  };

  const toggleOfferFilter = (offer: string) => {
    setOfferFilter(prev =>
      prev.includes(offer) ? prev.filter(o => o !== offer) : [...prev, offer]
    );
  };

  const toggleCountryFilter = (country: string) => {
    setCountryFilter(prev =>
      prev.includes(country) ? prev.filter(c => c !== country) : [...prev, country]
    );
  };

  const toggleDocumentationFilter = (doc: string) => {
    setDocumentationFilter(prev =>
      prev.includes(doc) ? prev.filter(d => d !== doc) : [...prev, doc]
    );
  };

  const toggleSsFilter = (c: string) => {
    setSsFilter(prev =>
      prev.includes(c) ? prev.filter(item => item !== c) : [...prev, c]
    );
  };

  const handleSort = (field: 'created_at' | 'raw_name') => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder(field === 'created_at' ? 'desc' : 'asc');
    }
  };

  const renderSortIcon = (field: 'created_at' | 'raw_name') => {
    if (sortField !== field) return <span className="text-slate-300 ml-1">↕</span>;
    return (
      <span className="text-brand-600 font-bold ml-1">
        {sortOrder === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const applyFilters = () => {
    let result = [...submissions];

    // 1. Status Filter
    if (statusFilter !== 'all') {
      result = result.filter(s => s.status === statusFilter);
    }

    // 2. Date Range Filter
    if (dateRange.start) {
      result = result.filter(s => new Date(s.created_at) >= new Date(dateRange.start));
    }
    if (dateRange.end) {
      const endDate = new Date(dateRange.end);
      endDate.setHours(23, 59, 59, 999);
      result = result.filter(s => new Date(s.created_at) <= endDate);
    }

    // 3. Search Filter (Name, Phone, Email, Location)
    if (searchTerm.trim()) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter(s =>
        s.raw_name.toLowerCase().includes(lowerTerm) ||
        s.raw_phone.includes(lowerTerm) ||
        (s.raw_email && s.raw_email.toLowerCase().includes(lowerTerm)) ||
        (s.raw_payload.location && s.raw_payload.location.toLowerCase().includes(lowerTerm))
      );
    }

    // 4. Offer Filter (Multi-select)
    if (offerFilter.length > 0) {
      result = result.filter(s => {
        if (!s.raw_payload.offer) return false;
        return offerFilter.some(selectedOffer => {
          if (selectedOffer === 'Otro') {
            return s.raw_payload.offer.includes('Otro');
          }
          return s.raw_payload.offer.includes(selectedOffer);
        });
      });
    }

    // 5. Country Filter (País de Residencia) (Multi-select)
    if (countryFilter.length > 0) {
      result = result.filter(s => {
        const c = s.raw_payload.current_country?.trim();
        return countryFilter.some(selectedC => {
          if (selectedC === 'Sin especificar') {
            return !c || c === 'Sin especificar';
          }
          return c === selectedC;
        });
      });
    }

    // 6. Driver License Filter
    if (hasDriverLicenseFilter !== 'all') {
      const wantsLicense = hasDriverLicenseFilter === 'yes';
      result = result.filter(s => !!s.raw_payload.has_driver_license === wantsLicense);
    }

    // 7. European Residence Filter
    if (europeanResidenceFilter !== 'all') {
      const wantsResidence = europeanResidenceFilter === 'yes';
      result = result.filter(s => {
        const res = s.raw_payload.european_residence?.trim();
        if (wantsResidence) {
          return !!res && res.toLowerCase() !== 'no';
        } else {
          return !res || res.toLowerCase() === 'no';
        }
      });
    }

    // 8. Documentation Filter (Multi-select)
    if (documentationFilter.length > 0) {
      result = result.filter(s => {
        const doc = s.raw_payload.documentation?.trim();
        if (!doc) return false;
        return documentationFilter.some(selectedDoc => {
          if (selectedDoc === 'Otro') {
            const isStandard = DOCUMENTATION_OPTIONS.filter(o => o !== 'Otro').includes(doc);
            return !isStandard || doc.startsWith('Otro');
          }
          return doc === selectedDoc;
        });
      });
    }

    // 9. Social Security Countries Filter (Multi-select)
    if (ssFilter.length > 0) {
      result = result.filter(s => {
        const countries = s.raw_payload.social_security_countries;
        return ssFilter.some(selectedC => {
          if (selectedC === 'Sin especificar') {
            return !countries || countries.length === 0;
          }
          return countries && countries.includes(selectedC);
        });
      });
    }

    // 10. Sorting
    result.sort((a, b) => {
      let valA = sortField === 'created_at' ? new Date(a.created_at).getTime() : a.raw_name.toLowerCase();
      let valB = sortField === 'created_at' ? new Date(b.created_at).getTime() : b.raw_name.toLowerCase();

      if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
      if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    setFilteredSubmissions(result);
  };

  const getStatusColor = (status: CandidateStatus) => {
    switch (status) {
      case 'new': return 'bg-yellow-50 text-yellow-800 border-yellow-200';
      case 'needs_review': return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'processed': return 'bg-green-50 text-green-800 border-green-200';
      case 'rejected': return 'bg-red-50 text-red-800 border-red-200';
      default: return 'bg-gray-50 text-gray-800 border-gray-200';
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

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      const first = parts[0][0];
      const last = parts[parts.length - 1][0];
      return `${first}${last}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  // --- FACETED STATS / COUNTERS (Based on overall submissions) ---
  const getOfferCount = (offerName: string) => {
    return submissions.filter(s => {
      if (!s.raw_payload.offer) return false;
      if (offerName === 'Otro') return s.raw_payload.offer.includes('Otro');
      return s.raw_payload.offer.includes(offerName);
    }).length;
  };

  const getCountryCount = (countryName: string) => {
    return submissions.filter(s => {
      const c = s.raw_payload.current_country?.trim();
      if (countryName === 'Sin especificar') return !c || c === 'Sin especificar';
      return c === countryName;
    }).length;
  };

  const getDocumentationCount = (docName: string) => {
    return submissions.filter(s => {
      const doc = s.raw_payload.documentation?.trim();
      if (!doc) return false;
      if (docName === 'Otro') {
        const isStandard = DOCUMENTATION_OPTIONS.filter(o => o !== 'Otro').includes(doc);
        return !isStandard || doc.startsWith('Otro');
      }
      return doc === docName;
    }).length;
  };

  const getSsCountryCount = (country: string) => {
    return submissions.filter(s => {
      const countries = s.raw_payload.social_security_countries;
      if (country === 'Sin especificar') {
        return !countries || countries.length === 0;
      }
      return countries && countries.includes(country);
    }).length;
  };

  const getDriverLicenseCount = (hasLicense: boolean) => {
    return submissions.filter(s => !!s.raw_payload.has_driver_license === hasLicense).length;
  };

  const getEuropeanResidenceCount = (hasResidence: boolean) => {
    return submissions.filter(s => {
      const res = s.raw_payload.european_residence?.trim();
      const exists = !!res && res.toLowerCase() !== 'no';
      return exists === hasResidence;
    }).length;
  };

  const getStatusCount = (status: CandidateStatus) => {
    return submissions.filter(s => s.status === status).length;
  };

  // --- KPIs CALCULATIONS (Dynamic based on filtered dataset) ---
  const totalGeneral = submissions.length;
  const totalFiltrados = filteredSubmissions.length;
  const comLicenca = filteredSubmissions.filter(s => s.raw_payload.has_driver_license).length;
  const comResidenciaUE = filteredSubmissions.filter(s => {
    const res = s.raw_payload.european_residence?.trim();
    return !!res && res.toLowerCase() !== 'no';
  }).length;
  
  // Robust check for work access based on substring matches (supports ES, PT, EN)
  const comAcessoTrabalho = filteredSubmissions.filter(s => {
    const doc = s.raw_payload.documentation?.toLowerCase() || '';
    const temPasaporteUE = doc.includes('pasaporte') && (doc.includes('ue') || doc.includes('europe') || doc.includes('eu'));
    const temPermisoTrabalho = (doc.includes('permiso') || doc.includes('permiss')) && 
                               (doc.includes('trabaj') || doc.includes('trabalh')) && 
                               (!doc.includes('sin') && !doc.includes('no'));
    return temPasaporteUE || temPermisoTrabalho;
  }).length;

  const activeAdvancedFiltersCount = 
    countryFilter.length + 
    (hasDriverLicenseFilter !== 'all' ? 1 : 0) + 
    (europeanResidenceFilter !== 'all' ? 1 : 0) + 
    documentationFilter.length +
    ssFilter.length;

  return (
    <AdminLayout>
      <div className="h-[calc(100vh-64px)] flex flex-col overflow-hidden -m-4">
        
        {/* TOP CONTAINER (Header, KPIs and Filters) */}
        <div className="bg-slate-100 px-6 pt-5 pb-5 border-b border-slate-200 space-y-5 flex-shrink-0">
          
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Candidatos</h1>
              <p className="text-sm text-slate-500">Gestión de solicitudes recibidas</p>
            </div>

            <div className="flex space-x-2">
              <Link to="/admin/candidatos/crear">
                <button
                  className="bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 rounded-lg text-xs font-semibold flex items-center transition-colors shadow-sm cursor-pointer"
                >
                  <Plus size={16} className="mr-1.5" />
                  Nuevo Candidato
                </button>
              </Link>
              <button
                onClick={handleClear}
                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg text-xs font-semibold flex items-center transition-colors border border-red-200 shadow-sm cursor-pointer"
              >
                <Trash2 size={16} className="mr-1.5" />
                Limpiar
              </button>
            </div>
          </div>

          {/* KPIs Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Total */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Candidatos</p>
                <h3 className="text-2xl font-black text-slate-800 mt-1">{totalFiltrados}</h3>
                <p className="text-[10px] text-slate-400 mt-1">de {totalGeneral} en total</p>
              </div>
              <div className="p-3 bg-brand-50 rounded-xl text-brand-600 shadow-inner">
                <Users size={20} />
              </div>
            </div>

            {/* KPI 2: Driver's License */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Licencia Conducir</p>
                <h3 className="text-2xl font-black text-emerald-600 mt-1">{comLicenca}</h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  {totalFiltrados > 0 ? ((comLicenca / totalFiltrados) * 100).toFixed(0) : 0}% de la lista
                </p>
              </div>
              <div className="p-3 bg-emerald-50 rounded-xl text-emerald-600 shadow-inner">
                <Car size={20} />
              </div>
            </div>

            {/* KPI 3: European Residence */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Residencia UE</p>
                <h3 className="text-2xl font-black text-blue-600 mt-1">{comResidenciaUE}</h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  {totalFiltrados > 0 ? ((comResidenciaUE / totalFiltrados) * 100).toFixed(0) : 0}% de la lista
                </p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl text-blue-600 shadow-inner">
                <Globe size={20} />
              </div>
            </div>

            {/* KPI 4: Work Document */}
            <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:shadow-md transition-shadow">
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Acceso de Trabajo</p>
                <h3 className="text-2xl font-black text-amber-600 mt-1">{comAcessoTrabalho}</h3>
                <p className="text-[10px] text-slate-400 mt-1">Pasaporte UE / Permiso</p>
              </div>
              <div className="p-3 bg-amber-50 rounded-xl text-amber-600 shadow-inner">
                <ShieldAlert size={20} />
              </div>
            </div>
          </div>

          {/* Primary Filters Toolbar */}
          <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
            <div className="flex flex-1 flex-col sm:flex-row gap-3">
              {/* Search */}
              <div className="flex-1 min-w-[200px] relative">
                <input
                  type="text"
                  placeholder="Buscar por nombre, teléfono, email, ubicación..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full text-sm rounded-lg border-slate-300 bg-white py-2 pl-9 pr-3 focus:ring-brand-500 focus:border-brand-500 border shadow-sm transition-all"
                />
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              </div>

              {/* Status filter */}
              <div className="w-full sm:w-[150px]">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as any)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm text-slate-700 font-medium"
                >
                  <option value="all">Todos los Estados ({totalGeneral})</option>
                  <option value="new">Nuevo ({getStatusCount('new')})</option>
                  <option value="needs_review">Revisión ({getStatusCount('needs_review')})</option>
                  <option value="processed">Procesado ({getStatusCount('processed')})</option>
                  <option value="rejected">Rechazado ({getStatusCount('rejected')})</option>
                </select>
              </div>

              {/* Offer Filter (Multi-select) */}
              <div className="w-full sm:w-[220px] relative" ref={offerDropdownRef}>
                <button
                  onClick={() => setIsOfferDropdownOpen(!isOfferDropdownOpen)}
                  className="w-full text-left text-sm rounded-lg border border-slate-300 bg-white py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm flex justify-between items-center text-slate-700 font-medium cursor-pointer"
                >
                  <span className="truncate">
                    {offerFilter.length === 0
                      ? "Todas las Ofertas"
                      : `${offerFilter.length} Seleccionada${offerFilter.length !== 1 ? 's' : ''}`
                    }
                  </span>
                  <ChevronDown size={16} className="text-slate-400 ml-1 flex-shrink-0" />
                </button>

                {isOfferDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white shadow-xl rounded-lg border border-slate-200 max-h-60 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {OFFER_OPTIONS.map((option) => {
                        const count = getOfferCount(option);
                        return (
                          <label key={option} className="flex items-center px-2.5 py-1.5 hover:bg-slate-50 rounded-md cursor-pointer transition-colors justify-between">
                            <div className="flex items-center min-w-0">
                              <input
                                type="checkbox"
                                checked={offerFilter.includes(option)}
                                onChange={() => toggleOfferFilter(option)}
                                className="rounded text-brand-600 focus:ring-brand-500 mr-2.5 h-4 w-4 border-slate-300"
                              />
                              <span className="text-xs text-slate-700 truncate">{option}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold ml-2">({count})</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-lg">
                      <button
                        onClick={() => setOfferFilter([])}
                        className="text-[10px] text-slate-400 hover:text-red-500 font-semibold cursor-pointer"
                      >
                        Limpiar
                      </button>
                      <button
                        onClick={() => setIsOfferDropdownOpen(false)}
                        className="text-[10px] text-brand-600 hover:text-brand-800 font-bold cursor-pointer"
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Advanced Filters Button */}
            <div className="flex gap-2 flex-shrink-0">
              <button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`flex items-center gap-1.5 px-4 py-2 border rounded-lg text-sm font-semibold transition-all shadow-sm cursor-pointer
                  ${showAdvancedFilters || activeAdvancedFiltersCount > 0
                    ? 'bg-brand-50 border-brand-300 text-brand-700 hover:bg-brand-100'
                    : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <SlidersHorizontal size={15} />
                <span>Avanzados</span>
                {activeAdvancedFiltersCount > 0 && (
                  <span className="inline-flex items-center justify-center w-5 h-5 text-[10px] font-bold text-white bg-brand-600 rounded-full animate-pulse">
                    {activeAdvancedFiltersCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Advanced Filters Section */}
          {showAdvancedFilters && (
            <div className="bg-slate-50 border border-slate-200/85 p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 animate-fade-in shadow-inner">
              
              {/* Country (País de Residencia) Filter (Multi-select) */}
              <div className="relative" ref={countryDropdownRef}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">País de Residencia</label>
                <button
                  onClick={() => setIsCountryDropdownOpen(!isCountryDropdownOpen)}
                  className="w-full text-left text-sm rounded-lg border border-slate-300 bg-white py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm flex justify-between items-center text-slate-700 font-medium cursor-pointer"
                >
                  <span className="truncate">
                    {countryFilter.length === 0
                      ? "Todos los Países"
                      : `${countryFilter.length} Seleccionado${countryFilter.length !== 1 ? 's' : ''}`
                    }
                  </span>
                  <ChevronDown size={16} className="text-slate-400 ml-1 flex-shrink-0" />
                </button>

                {isCountryDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white shadow-xl rounded-lg border border-slate-200 max-h-60 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {/* Opção Sin especificar no topo */}
                      <label className="flex items-center px-2.5 py-1.5 hover:bg-slate-50 rounded-md cursor-pointer transition-colors justify-between border-b border-slate-100/50 pb-2">
                        <div className="flex items-center min-w-0">
                          <input
                            type="checkbox"
                            checked={countryFilter.includes('Sin especificar')}
                            onChange={() => toggleCountryFilter('Sin especificar')}
                            className="rounded text-brand-600 focus:ring-brand-500 mr-2.5 h-4 w-4 border-slate-300"
                          />
                          <span className="text-xs text-slate-700 truncate font-semibold italic text-slate-500">Sin especificar</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold ml-2">({getCountryCount('Sin especificar')})</span>
                      </label>

                      {countriesList.map((country) => {
                        const count = getCountryCount(country);
                        return (
                          <label key={country} className="flex items-center px-2.5 py-1.5 hover:bg-slate-50 rounded-md cursor-pointer transition-colors justify-between">
                            <div className="flex items-center min-w-0">
                              <input
                                type="checkbox"
                                checked={countryFilter.includes(country)}
                                onChange={() => toggleCountryFilter(country)}
                                className="rounded text-brand-600 focus:ring-brand-500 mr-2.5 h-4 w-4 border-slate-300"
                              />
                              <span className="text-xs text-slate-700 truncate">{country}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold ml-2">({count})</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-lg">
                      <button
                        onClick={() => setCountryFilter([])}
                        className="text-[10px] text-slate-400 hover:text-red-500 font-semibold cursor-pointer"
                      >
                        Limpiar
                      </button>
                      <button
                        onClick={() => setIsCountryDropdownOpen(false)}
                        className="text-[10px] text-brand-600 hover:text-brand-800 font-bold cursor-pointer"
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Documentation Filter (Multi-select) */}
              <div className="relative" ref={documentationDropdownRef}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Documentación</label>
                <button
                  onClick={() => setIsDocumentationDropdownOpen(!isDocumentationDropdownOpen)}
                  className="w-full text-left text-sm rounded-lg border border-slate-300 bg-white py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm flex justify-between items-center text-slate-700 font-medium cursor-pointer"
                >
                  <span className="truncate">
                    {documentationFilter.length === 0
                      ? "Todos los Documentos"
                      : `${documentationFilter.length} Seleccionada${documentationFilter.length !== 1 ? 's' : ''}`
                    }
                  </span>
                  <ChevronDown size={16} className="text-slate-400 ml-1 flex-shrink-0" />
                </button>

                {isDocumentationDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white shadow-xl rounded-lg border border-slate-200 max-h-60 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {documentationList.map((doc) => {
                        const count = getDocumentationCount(doc);
                        return (
                          <label key={doc} className="flex items-center px-2.5 py-1.5 hover:bg-slate-50 rounded-md cursor-pointer transition-colors justify-between">
                            <div className="flex items-center min-w-0">
                              <input
                                type="checkbox"
                                checked={documentationFilter.includes(doc)}
                                onChange={() => toggleDocumentationFilter(doc)}
                                className="rounded text-brand-600 focus:ring-brand-500 mr-2.5 h-4 w-4 border-slate-300"
                              />
                              <span className="text-xs text-slate-700 truncate">{doc}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold ml-2">({count})</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-lg">
                      <button
                        onClick={() => setDocumentationFilter([])}
                        className="text-[10px] text-slate-400 hover:text-red-500 font-semibold cursor-pointer"
                      >
                        Limpiar
                      </button>
                      <button
                        onClick={() => setIsDocumentationDropdownOpen(false)}
                        className="text-[10px] text-brand-600 hover:text-brand-800 font-bold cursor-pointer"
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Social Security Countries Filter (Multi-select) */}
              <div className="relative" ref={ssDropdownRef}>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Seguridad Social (SS)</label>
                <button
                  onClick={() => setIsSsDropdownOpen(!isSsDropdownOpen)}
                  className="w-full text-left text-sm rounded-lg border border-slate-300 bg-white py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm flex justify-between items-center text-slate-700 font-medium cursor-pointer"
                >
                  <span className="truncate">
                    {ssFilter.length === 0
                      ? "Todos los Países SS"
                      : `${ssFilter.length} Seleccionado${ssFilter.length !== 1 ? 's' : ''}`
                    }
                  </span>
                  <ChevronDown size={16} className="text-slate-400 ml-1 flex-shrink-0" />
                </button>

                {isSsDropdownOpen && (
                  <div className="absolute z-30 mt-1 w-full bg-white shadow-xl rounded-lg border border-slate-200 max-h-60 overflow-y-auto">
                    <div className="p-2 space-y-1">
                      {/* Opção Sin SS no topo */}
                      <label className="flex items-center px-2.5 py-1.5 hover:bg-slate-50 rounded-md cursor-pointer transition-colors justify-between border-b border-slate-100/50 pb-2">
                        <div className="flex items-center min-w-0">
                          <input
                            type="checkbox"
                            checked={ssFilter.includes('Sin especificar')}
                            onChange={() => toggleSsFilter('Sin especificar')}
                            className="rounded text-brand-600 focus:ring-brand-500 mr-2.5 h-4 w-4 border-slate-300"
                          />
                          <span className="text-xs text-slate-700 truncate font-semibold italic text-slate-500">Sin especificar</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-bold ml-2">({getSsCountryCount('Sin especificar')})</span>
                      </label>

                      {ssCountriesList.map((country) => {
                        const count = getSsCountryCount(country);
                        return (
                          <label key={country} className="flex items-center px-2.5 py-1.5 hover:bg-slate-50 rounded-md cursor-pointer transition-colors justify-between">
                            <div className="flex items-center min-w-0">
                              <input
                                type="checkbox"
                                checked={ssFilter.includes(country)}
                                onChange={() => toggleSsFilter(country)}
                                className="rounded text-brand-600 focus:ring-brand-500 mr-2.5 h-4 w-4 border-slate-300"
                              />
                              <span className="text-xs text-slate-700 truncate">{country}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-bold ml-2">({count})</span>
                          </label>
                        );
                      })}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-between items-center rounded-b-lg">
                      <button
                        onClick={() => setSsFilter([])}
                        className="text-[10px] text-slate-400 hover:text-red-500 font-semibold cursor-pointer"
                      >
                        Limpiar
                      </button>
                      <button
                        onClick={() => setIsSsDropdownOpen(false)}
                        className="text-[10px] text-brand-600 hover:text-brand-800 font-bold cursor-pointer"
                      >
                        Listo
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* License Option */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Licencia de Conducir</label>
                <select
                  value={hasDriverLicenseFilter}
                  onChange={(e) => setHasDriverLicenseFilter(e.target.value as any)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm text-slate-700 font-medium"
                >
                  <option value="all">Todas ({totalGeneral})</option>
                  <option value="yes">Con Licencia ({getDriverLicenseCount(true)})</option>
                  <option value="no">Sin Licencia ({getDriverLicenseCount(false)})</option>
                </select>
              </div>

              {/* Residence Option */}
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Residencia Europea</label>
                <select
                  value={europeanResidenceFilter}
                  onChange={(e) => setEuropeanResidenceFilter(e.target.value as any)}
                  className="w-full text-sm rounded-lg border border-slate-300 bg-white py-2 px-3 focus:ring-brand-500 focus:border-brand-500 shadow-sm text-slate-700 font-medium"
                >
                  <option value="all">Todas ({totalGeneral})</option>
                  <option value="yes">Con Residencia ({getEuropeanResidenceCount(true)})</option>
                  <option value="no">Sin Residencia ({getEuropeanResidenceCount(false)})</option>
                </select>
              </div>
            </div>
          )}

          {/* Active Chips Bar */}
          {activeAdvancedFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 items-center text-xs px-1">
              <span className="text-slate-400 font-medium">Filtros activos:</span>
              {countryFilter.map(country => (
                <span key={country} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 gap-1 border border-slate-300">
                  <span>País: {country}</span>
                  <button onClick={() => toggleCountryFilter(country)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {documentationFilter.map(doc => (
                <span key={doc} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 gap-1 border border-slate-300 max-w-[150px]">
                  <span className="truncate">Doc: {doc}</span>
                  <button onClick={() => toggleDocumentationFilter(doc)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {ssFilter.map(country => (
                <span key={country} className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 gap-1 border border-slate-300">
                  <span>SS: {country}</span>
                  <button onClick={() => toggleSsFilter(country)} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              ))}
              {hasDriverLicenseFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 gap-1 border border-slate-300">
                  <span>Licencia: {hasDriverLicenseFilter === 'yes' ? 'Sí' : 'No'}</span>
                  <button onClick={() => setHasDriverLicenseFilter('all')} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              {europeanResidenceFilter !== 'all' && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-slate-200 text-slate-700 gap-1 border border-slate-300">
                  <span>Residencia UE: {europeanResidenceFilter === 'yes' ? 'Sí' : 'No'}</span>
                  <button onClick={() => setEuropeanResidenceFilter('all')} className="text-slate-400 hover:text-slate-700 cursor-pointer">
                    <X size={12} />
                  </button>
                </span>
              )}
              <button 
                onClick={() => {
                  setCountryFilter([]);
                  documentationFilter.length = 0;
                  setDocumentationFilter([]);
                  setSsFilter([]);
                  setHasDriverLicenseFilter('all');
                  setEuropeanResidenceFilter('all');
                }} 
                className="text-brand-600 hover:text-red-600 font-bold ml-1.5 hover:underline cursor-pointer"
              >
                Limpiar todos
              </button>
            </div>
          )}
        </div>

        {/* TABLE CONTAINER (ONLY THIS SECTION SCROLLS VERTICALLY) */}
        <div className="flex-1 overflow-y-auto min-h-0 bg-slate-100 px-6 py-4">
          <div className="border border-slate-200 rounded-xl shadow-sm overflow-hidden bg-white">
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
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50/70 border-b border-slate-100">
                    <tr>
                      <th 
                        scope="col" 
                        onClick={() => handleSort('created_at')}
                        className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-50 z-10 cursor-pointer hover:bg-slate-100/90 hover:text-slate-600 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          <span>Fecha</span>
                          {renderSortIcon('created_at')}
                        </div>
                      </th>
                      <th 
                        scope="col" 
                        onClick={() => handleSort('raw_name')}
                        className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-50 z-10 cursor-pointer hover:bg-slate-100/90 hover:text-slate-600 transition-colors select-none"
                      >
                        <div className="flex items-center">
                          <span>Candidato</span>
                          {renderSortIcon('raw_name')}
                        </div>
                      </th>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">Contacto</th>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">Nacionalidad</th>
                      <th scope="col" className="px-6 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-wider sticky top-0 bg-slate-50 z-10">Estado</th>
                      <th scope="col" className="relative px-6 py-3.5 sticky top-0 bg-slate-50 z-10"><span className="sr-only">Acciones</span></th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-100">
                    {filteredSubmissions.map((sub) => {
                      const initials = getInitials(sub.raw_name);
                      const colorIndex = sub.raw_name.charCodeAt(0) % 5;
                      const colors = [
                        'bg-blue-100 text-blue-700 border-blue-200',
                        'bg-emerald-100 text-emerald-700 border-emerald-200',
                        'bg-indigo-100 text-indigo-700 border-indigo-200',
                        'bg-purple-100 text-purple-700 border-purple-200',
                        'bg-amber-100 text-amber-700 border-amber-200'
                      ];
                      const avatarColor = colors[colorIndex];

                      return (
                        <tr 
                          key={sub.id} 
                          onClick={() => navigate(`/admin/candidatos/${sub.id}`)}
                          className="hover:bg-slate-50/80 transition-all group cursor-pointer border-b border-slate-100 hover:shadow-[inset_4px_0_0_0_#004F9F]"
                        >
                          {/* Creation Date */}
                          <td className="px-6 py-4 whitespace-nowrap text-xs text-slate-600 font-semibold">
                            {new Date(sub.created_at).toLocaleDateString()}
                          </td>

                          {/* Candidate info (Avatar, Name, Offers) */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className={`w-9 h-9 rounded-full ${avatarColor} flex items-center justify-center text-xs font-bold mr-3 border shadow-inner`}>
                                {initials}
                              </div>
                              <div>
                                <div className="text-sm font-semibold text-slate-800 group-hover:text-brand-700 transition-colors">{sub.raw_name}</div>
                                <div className="text-xs text-slate-500 font-medium max-w-[220px] truncate" title={sub.raw_payload.offer}>
                                  {sub.raw_payload.offer.split(',')[0]}
                                  {sub.raw_payload.offer.includes(',') && (
                                    <span className="text-[10px] bg-slate-100 text-slate-600 px-1 py-0.5 rounded ml-1.5 font-normal">
                                      +{sub.raw_payload.offer.split(',').length - 1} más
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Contact details */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                            <div className="font-semibold text-slate-700">{sub.raw_phone}</div>
                            <div className="text-xs text-slate-400 font-medium">{sub.raw_email || <span className="italic text-slate-300">Sin correo</span>}</div>
                          </td>

                          {/* Nationality */}
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {sub.raw_payload.nationality ? (
                              <span className="font-semibold text-slate-700">{sub.raw_payload.nationality}</span>
                            ) : (
                              <span className="italic text-slate-300 text-xs">Sin especificar</span>
                            )}
                          </td>

                          {/* Status Label */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2.5 py-1 inline-flex text-xs leading-4 font-semibold rounded-full border ${getStatusColor(sub.status)}`}>
                              {getStatusLabel(sub.status)}
                            </span>
                          </td>

                          {/* Actions (hover button) */}
                          <td className="px-6 py-4 whitespace-nowrap text-right text-xs font-semibold">
                            <span className="text-brand-600 group-hover:bg-brand-50 px-3 py-1.5 rounded-md opacity-0 group-hover:opacity-100 transition-all inline-block">
                              Ver Detalles →
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER CONTAINER */}
        <div className="text-center text-xs text-slate-400 font-medium py-3 border-t border-slate-200 bg-white flex-shrink-0">
          Total registros: {totalGeneral} | Mostrando: {totalFiltrados}
        </div>
      </div>
    </AdminLayout>
  );
};

export default CandidateList;