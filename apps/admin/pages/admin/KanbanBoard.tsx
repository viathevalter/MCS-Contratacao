import React, { useEffect, useState } from 'react';
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
import { FileText, MapPin, Calendar, Plus } from 'lucide-react';
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
    return () => clearInterval(interval);
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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-slate-800">Tablero de Procesos</h1>
            <div className="flex gap-3">
              <button
                onClick={openAddStageModal}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors text-sm font-medium shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Nueva Etapa
              </button>
              <Link to="/admin/candidatos" className="px-4 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors text-sm font-medium shadow-sm">
                Vista de Lista
              </Link>
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
                items={submissions.filter(s => s.status === stage.id)}
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