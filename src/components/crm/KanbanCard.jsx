import React from 'react';
import { motion } from '../../lib/framerMotionShim.jsx';
import { DollarSign, User, Clock } from 'lucide-react';

export default function KanbanCard({ lead, onClick, provided }) {
  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
      onClick={() => onClick(lead)}
      className="bg-card rounded-xl p-4 card-shadow border border-border/50 hover:card-shadow-hover transition-all duration-200 cursor-pointer group mb-2"
    >
      <div className="flex items-start justify-between mb-2">
        <h4 className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors truncate flex-1">
          {lead.name}
        </h4>
      </div>
      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1">
        <User className="w-3 h-3" /> {lead.contact}
      </p>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-primary flex items-center gap-1">
          <DollarSign className="w-3 h-3" /> {(lead.value || 0).toLocaleString()}
        </span>
        <span className="text-[10px] text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3" /> {lead.source}
        </span>
      </div>
    </div>
  );
}