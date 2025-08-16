// components/BookAppointment/LabCard/LabActions.tsx
import React from 'react';
import { Lab } from '../Filters/types';
import { Heart } from 'lucide-react';

interface LabActionsProps {
  lab: Lab;
  onLoveClick: (id: number) => void;
}

export const LabActions: React.FC<LabActionsProps> = ({ lab, onLoveClick }) => (
  <div className="flex items-center gap-2 mt-2 sm:mt-0">
    {lab.nextAvailable !== 'Not Available' ? (
      <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
        ● Available
      </span>
    ) : (
      <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full whitespace-nowrap">
        ● Unavailable
      </span>
    )}
    <button onClick={() => onLoveClick(lab.id)}>
      <Heart
        size={24}
        className={lab.isLoved ? 'text-red-500 fill-current' : 'text-gray-400'}
      />
    </button>
  </div>
);
