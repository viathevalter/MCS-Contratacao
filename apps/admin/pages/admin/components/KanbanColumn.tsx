import React, { useState } from 'react';
import { useDroppable } from '@dnd-kit/core';
import { KanbanStage, CandidateSubmission } from '../../../types';
import { KanbanCard } from './KanbanCard';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

interface Props {
    stage: KanbanStage;
    items: CandidateSubmission[];
    onEdit: (stage: KanbanStage) => void;
    onDelete: (stageId: string) => void;
}

export const KanbanColumn: React.FC<Props> = ({ stage, items, onEdit, onDelete }) => {
    const { setNodeRef, isOver } = useDroppable({
        id: stage.id,
    });

    const [showMenu, setShowMenu] = useState(false);

    // Helper to determine text color based on background luminance
    const getContrastYIQ = (hexcolor: string) => {
        if (!hexcolor.startsWith('#')) return 'text-slate-700'; // Default for tailwind classes (usually exist on light bg)

        const r = parseInt(hexcolor.substring(1, 3), 16);
        const g = parseInt(hexcolor.substring(3, 5), 16);
        const b = parseInt(hexcolor.substring(5, 7), 16);

        const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
        return (yiq >= 128) ? 'text-slate-700' : 'text-white';
    };

    const isHexColor = stage.color.startsWith('#');
    const headerStyle = isHexColor ? { backgroundColor: stage.color } : {};
    const headerClass = isHexColor
        ? getContrastYIQ(stage.color)
        : `${stage.color} text-slate-700`; // Existing behavior for tailwind classes

    return (
        <div className="flex flex-col w-80 flex-shrink-0 bg-slate-100 rounded-xl max-h-full shadow-sm border border-slate-200 group">
            <div
                className={`p-4 font-bold border-b border-slate-200 flex justify-between items-center bg-opacity-20 rounded-t-xl relative ${headerClass}`}
                style={headerStyle}
            >
                <div className="flex items-center gap-2">
                    <span>{stage.title}</span>
                    <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs shadow-sm font-mono backdrop-blur-sm">{items.length}</span>
                </div>

                <div className="relative">
                    <button
                        onClick={() => setShowMenu(!showMenu)}
                        className={`p-1 hover:bg-black/10 rounded-md transition-colors opacity-0 group-hover:opacity-100 ${isHexColor && getContrastYIQ(stage.color) === 'text-white' ? 'text-white' : 'text-slate-600'}`}
                    >
                        <MoreHorizontal className="w-4 h-4" />
                    </button>

                    {showMenu && (
                        <>
                            <div
                                className="fixed inset-0 z-10"
                                onClick={() => setShowMenu(false)}
                            />
                            <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-lg border border-slate-200 py-1 z-20 overflow-hidden">
                                <button
                                    onClick={() => {
                                        onEdit(stage);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                                >
                                    <Pencil className="w-3.5 h-3.5" />
                                    Editar
                                </button>
                                <button
                                    onClick={() => {
                                        onDelete(stage.id);
                                        setShowMenu(false);
                                    }}
                                    className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                                >
                                    <Trash2 className="w-3.5 h-3.5" />
                                    Eliminar
                                </button>
                            </div>
                        </>
                    )}
                </div>
            </div>

            <div
                ref={setNodeRef}
                className={`p-3 space-y-3 overflow-y-auto flex-1 min-h-[150px] transition-colors ${isOver ? 'bg-slate-200/50' : ''}`}
            >
                {items.map(item => (
                    <KanbanCard key={item.id} item={item} />
                ))}

                {items.length === 0 && (
                    <div className={`text-center py-10 transition-colors border-2 border-dashed rounded-lg mx-2 my-4
                ${isOver ? 'border-brand-400 bg-brand-50/30' : 'border-slate-200 text-slate-400'}`}>
                        <span className="text-xs italic">Arrastra candidatos aquí</span>
                    </div>
                )}
            </div>
        </div>
    );
};
