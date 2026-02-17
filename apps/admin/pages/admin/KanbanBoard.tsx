import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { FileText, MapPin, Calendar, Plus, Search, Filter } from 'lucide-react';
import AdminLayout from '../../components/AdminLayout';
import { stagingRepo } from '../../lib/stagingRepo';
import { CandidateSubmission, KanbanStage } from '../../types';

// Components
import { KanbanColumn } from './components/KanbanColumn';
import { KanbanCard } from './components/KanbanCard';

const KanbanBoard: React.FC = () => {
  const [submissions, setSubmissions] = useState<CandidateSubmission[]>([]);
  const [stages, setStages] = useState<KanbanStage[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeItem, setActiveItem] = useState<CandidateSubmission | null>(null);
  const [isStageModalOpen, setIsStageModalOpen] = useState(false);
  const [editingStage, setEditingStage] = useState<KanbanStage | null>(null);
  const [stageName, setStageName] = useState('');
  const [stageColor, setStageColor] = useState('#64748b'); // Default slate-500

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProfiles, setSelectedProfiles] = useState<string[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' });
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // 5px movement required to start drag
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // Keep polling for updates

    // Click outside listener
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      clearInterval(interval);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const loadData = async () => {
    const [subsData, stagesData] = await Promise.all([
      stagingRepo.listSubmissions(),
      stagingRepo.listStages()
    ]);
    setSubmissions(subsData);

    // Sort stages by position
    setStages(stagesData.sort((a, b) => a.position - b.position));
  };

  // Get unique profiles (offers) for filter, splitting comma-separated values
  const uniqueProfiles = useMemo(() => {
    const profiles = new Set<string>();
    submissions.forEach(s => {
      if (s.raw_payload.offer) {
        // Split by comma, trim whitespace, and add to set
        s.raw_payload.offer.split(',').forEach(o => profiles.add(o.trim()));
      }
    });
    return Array.from(profiles).sort();
  }, [submissions]);

  // Filter Logic
  const filteredSubmissions = useMemo(() => {
    return submissions.filter(sub => {
      const matchesSearch =
        searchTerm === '' ||
        sub.raw_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.raw_phone.includes(searchTerm) ||
        (sub.raw_email && sub.raw_email.toLowerCase().includes(searchTerm.toLowerCase()));

      let matchesProfile = true;
      if (selectedProfiles.length > 0) {
        // Check if ANY of the selected profiles matches the candidate's offer string
        // We do a loose check: if selected "Tubero", and candidate is "Soldador, Tubero", it matches.
        matchesProfile = selectedProfiles.some(profile =>
          sub.raw_payload.offer.includes(profile)
        );
      }

      let matchesDate = true;
      if (dateRange.start) {
        matchesDate = matchesDate && new Date(sub.created_at) >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        // Add one day to include the end date fully (or handle time component)
        const endDate = new Date(dateRange.end);
        endDate.setHours(23, 59, 59, 999);
        matchesDate = matchesDate && new Date(sub.created_at) <= endDate;
      }

      return matchesSearch && matchesProfile && matchesDate;
    });
  }, [submissions, searchTerm, selectedProfiles, dateRange]);

  const toggleProfileFilter = (profile: string) => {
    setSelectedProfiles(prev =>
      prev.includes(profile)
        ? prev.filter(p => p !== profile)
        : [...prev, profile]
    );
  };

  const openAddStageModal = () => {
    setEditingStage(null);
    setStageName('');
    setStageColor('#64748b');
    setIsStageModalOpen(true);
  };

  const openEditStageModal = (stage: KanbanStage) => {
    setEditingStage(stage);
    setStageName(stage.title);
    // If it's a tailwind class, we can't easily convert to hex for input type=color
    // So we default to grey if it's not a hex code
    setStageColor(stage.color.startsWith('#') ? stage.color : '#64748b');
    setIsStageModalOpen(true);
  };

  const handleSaveStage = async () => {
    if (!stageName.trim()) return;

    if (editingStage) {
      // Update existing stage
      const updated = await stagingRepo.updateStage(editingStage.id, {
        title: stageName,
        color: stageColor
      });
      if (updated) {
        setStages(stages.map(s => s.id === editingStage.id ? updated : s));
        setIsStageModalOpen(false);
      }
    } else {
      // Create new stage
      const newStage: KanbanStage = {
        id: stageName.toLowerCase().replace(/\s+/g, '_'),
        title: stageName,
        color: stageColor,
        position: stages.length
      };

      const created = await stagingRepo.createStage(newStage);
      if (created) {
        setStages([...stages, created]);
        setIsStageModalOpen(false);
      }
    }
    setStageName('');
    setStageColor('#64748b');
  };

  const handleDeleteStage = async (stageId: string) => {
    const stageItems = submissions.filter(s => s.status === stageId);
    if (stageItems.length > 0) {
      alert(`No se puede eliminar la etapa porque contiene ${stageItems.length} candidatos. Muévelos a otra etapa primero.`);
      return;
    }

    if (confirm('¿Estás seguro de que deseas eliminar esta etapa?')) {
      const success = await stagingRepo.deleteStage(stageId);
      if (success) {
        setStages(stages.filter(s => s.id !== stageId));
      }
    }
  };


  const findContainer = (id: string) => {
    if (stages.find(s => s.id === id)) return id;
    const item = submissions.find(s => s.id === id);
    return item?.status;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const item = submissions.find(s => s.id === active.id);
    if (item) {
      setActiveId(String(active.id));
      setActiveItem(item);
    }
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    const overId = over?.id;

    if (!overId || active.id === overId) return;

    // We can handle sorting here later if we want to sort cards within columns
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    const activeId = active.id;
    const overId = over?.id;

    if (!overId) {
      setActiveId(null);
      setActiveItem(null);
      return;
    }

    // Find the destination column
    // If over is a stage, that's the status
    // If over is a card, use its status
    let newStatus = '';
    const overStage = stages.find(s => s.id === overId);

    if (overStage) {
      newStatus = overStage.id;
    } else {
      const overItem = submissions.find(s => s.id === overId);
      if (overItem) {
        newStatus = overItem.status;
      }
    }

    if (newStatus && activeItem && activeItem.status !== newStatus) {
      // Optimistic update
      setSubmissions(prev => prev.map(item =>
        item.id === activeId
          ? { ...item, status: newStatus }
          : item
      ));

      // Persist update
      await stagingRepo.updateSubmission(String(activeId), { status: newStatus });
    }

    setActiveId(null);
    setActiveItem(null);
  };

  return (
    <AdminLayout>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="h-[calc(100vh-140px)] flex flex-col">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <h1 className="text-2xl font-bold text-slate-800">Tablero de Procesos</h1>

            <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto flex-wrap">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-48 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              {/* Date Range Inputs */}
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-2 py-1">
                <Calendar className="text-slate-400 w-4 h-4" />
                <input
                  type="date"
                  className="text-sm border-none focus:ring-0 p-1 text-slate-600 w-32"
                  value={dateRange.start}
                  onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                  title="Fecha Inicio"
                />
                <span className="text-slate-300">-</span>
                <input
                  type="date"
                  className="text-sm border-none focus:ring-0 p-1 text-slate-600 w-32"
                  value={dateRange.end}
                  onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                  title="Fecha Fin"
                />
              </div>

              {/* Profile Filter (Multi-select) */}
              <div className="relative" ref={dropdownRef}>
                <Filter className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="pl-9 pr-8 py-2 border border-slate-200 rounded-lg text-sm w-full md:w-64 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500 text-left flex justify-between items-center"
                >
                  <span className="truncate block max-w-[180px]">
                    {selectedProfiles.length === 0
                      ? "Todos los perfiles"
                      : `${selectedProfiles.length} seleccionado${selectedProfiles.length !== 1 ? 's' : ''}`
                    }
                  </span>
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </button>

                {isProfileDropdownOpen && (
                  <div className="absolute z-50 mt-1 w-72 bg-white shadow-xl rounded-md border border-slate-200 max-h-80 overflow-y-auto">
                    <div className="p-2 border-b border-slate-100 bg-slate-50 sticky top-0">
                      <input
                        type="text"
                        placeholder="Filtrar lista..."
                        className="w-full text-xs px-2 py-1 border border-slate-300 rounded focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                    <div className="p-2 space-y-1">
                      {uniqueProfiles.map((profile) => (
                        <label key={profile} className="flex items-start px-2 py-2 hover:bg-slate-50 rounded cursor-pointer transition-colors">
                          <input
                            type="checkbox"
                            checked={selectedProfiles.includes(profile)}
                            onChange={() => toggleProfileFilter(profile)}
                            className="rounded text-brand-600 focus:ring-brand-500 mt-0.5 mr-2 h-4 w-4 border-slate-300 flex-shrink-0"
                          />
                          <span className="text-sm text-slate-700 leading-tight">{profile}</span>
                        </label>
                      ))}
                      {uniqueProfiles.length === 0 && (
                        <div className="px-2 py-4 text-center text-xs text-slate-400">
                          No hay perfiles disponibles
                        </div>
                      )}
                    </div>
                    <div className="p-2 border-t border-slate-100 bg-slate-50 flex justify-end sticky bottom-0">
                      <button
                        onClick={() => setSelectedProfiles([])}
                        className="text-xs text-brand-600 hover:text-brand-800 font-medium px-2 py-1 hover:bg-brand-50 rounded"
                      >
                        Limpiar selección
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="h-8 w-px bg-slate-200 mx-1 hidden md:block"></div>

              <div className="flex gap-2">
                <button
                  onClick={openAddStageModal}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm whitespace-nowrap"
                >
                  <Plus className="w-4 h-4" />
                  <span className="hidden sm:inline">Nueva Etapa</span>
                </button>
                <Link to="/admin/candidatos" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium shadow-sm whitespace-nowrap">
                  Vista de Lista
                </Link>
              </div>
            </div>
          </div>

          {isStageModalOpen && (
            <div className="mb-4 p-4 bg-white border border-slate-200 rounded-lg shadow-sm flex gap-3 items-center animate-in fade-in slide-in-from-top-2">
              <input
                type="text"
                value={stageName}
                onChange={(e) => setStageName(e.target.value)}
                placeholder="Nombre de la etapa..."
                className="flex-1 px-3 py-2 border border-slate-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                autoFocus
              />
              <div className="flex items-center gap-2 border border-slate-300 rounded-md px-2 py-1 bg-white">
                <input
                  type="color"
                  value={stageColor}
                  onChange={(e) => setStageColor(e.target.value)}
                  className="w-8 h-8 rounded cursor-pointer border-0 p-0 bg-transparent"
                  title="Color de la etapa"
                />
              </div>
              <button
                onClick={handleSaveStage}
                className="px-4 py-2 bg-brand-600 text-white rounded-md text-sm hover:bg-brand-700"
              >
                {editingStage ? 'Guardar' : 'Crear'}
              </button>
              <button
                onClick={() => setIsStageModalOpen(false)}
                className="px-4 py-2 text-slate-500 hover:text-slate-700 text-sm"
              >
                Cancelar
              </button>
            </div>
          )}

          <div className="flex gap-6 overflow-x-auto pb-4 h-full items-start">
            {stages.map(stage => (
              <KanbanColumn
                key={stage.id}
                stage={stage}
                items={filteredSubmissions.filter(s => s.status === stage.id)}
                onEdit={openEditStageModal}
                onDelete={handleDeleteStage}
              />
            ))}

            {stages.length === 0 && (
              <div className="w-full h-40 flex items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-xl">
                Cargando etapas...
              </div>
            )}
          </div>
        </div>

        <DragOverlay>
          {activeItem ? (
            <div className="opacity-90 rotate-2 scale-105 cursor-grabbing">
              <KanbanCard item={activeItem} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </AdminLayout>
  );
};

export default KanbanBoard;