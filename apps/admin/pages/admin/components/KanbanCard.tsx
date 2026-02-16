import React from 'react';
import { Link } from 'react-router-dom';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { MapPin, Briefcase, Phone } from 'lucide-react';
import { CandidateSubmission } from '../../../types';

interface Props {
    item: CandidateSubmission;
}

export const KanbanCard: React.FC<Props> = ({ item }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: item.id,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    // Format date
    const date = new Date(item.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={`bg-white p-4 rounded-lg shadow-sm border border-slate-200 group relative
        ${isDragging ? 'opacity-0' : 'opacity-100 hover:shadow-md hover:border-brand-300'} 
        transition-all cursor-grab active:cursor-grabbing`
            }
        >
            <div className="flex justify-between items-start mb-2">
                <span className="font-bold text-slate-800 text-sm line-clamp-1 pr-2">{item.raw_name}</span>
                <span className="text-[10px] text-slate-400 font-mono bg-slate-50 px-1.5 py-0.5 rounded whitespace-nowrap">{date}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-1" title={item.raw_payload.offer}>
                <Briefcase className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{item.raw_payload.offer}</span>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-600 mb-3" title="Teléfono">
                <Phone className="w-3 h-3 text-slate-400 flex-shrink-0" />
                <span className="truncate">{item.raw_phone}</span>
            </div>

            <div className="flex justify-between items-center text-xs mt-2 border-t border-slate-50 pt-2">
                <div className="flex items-center gap-1 text-slate-500">
                    <MapPin className="w-3 h-3 text-slate-300" />
                    <span className="truncate max-w-[120px]">
                        {item.raw_payload.location ? item.raw_payload.location.split(',')[0] : 'Sin ubicación'}
                    </span>
                </div>

                {/* Prevent Link drag interference by stopping propagation on click/mousedown, 
                 or essentially make it separate from drag handle. 
                 But Dnd-kit handles clicks well usually. */}
                <Link
                    to={`/admin/candidatos/${item.id}`}
                    className="text-brand-600 hover:text-brand-800 font-medium hover:underline z-10 relative"
                    onPointerDown={(e) => e.stopPropagation()}
                >
                    Ver
                </Link>
            </div>
        </div>
    );
};
