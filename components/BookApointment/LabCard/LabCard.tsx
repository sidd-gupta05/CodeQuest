// components/BookAppointment/LabCard/LabCard.tsx
import React from 'react';
import { Lab } from '../Filters/types';
import { motion } from 'framer-motion';
import { LabInfo } from './LabInfo';
import { LabAvailability } from './LabAvailability';
import { LabActions } from './LabActions';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface LabCardProps {
  lab: Lab;
  onLoveClick: (id: number) => void;
}

export const LabCard: React.FC<LabCardProps> = ({ lab, onLoveClick }) => (
  <motion.div
    layout
    initial={{ opacity: 0, x: -100 }}
    whileInView={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -100, transition: { duration: 0.3 } }}
    viewport={{ once: true, amount: 0.2 }}
    transition={{ duration: 0.5, ease: 'easeInOut' }}
    className="bg-white p-4 rounded-lg border shadow-md flex flex-col sm:flex-row gap-4 items-start"
  >
    <Image
      src={lab?.image || '/placeholder-lab.png'}
      alt={lab?.name || 'Lab Image'}
      width={80}
      height={80}
      className="sm:w-24 sm:h-24 rounded-lg object-cover"
    />
    <div className="flex-1 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <LabInfo lab={lab} />
        <LabActions lab={lab} onLoveClick={onLoveClick} />
      </div>
      <div className="flex flex-col sm:flex-row justify-between items-start mt-4 gap-4">
        <LabAvailability lab={lab} />
      </div>
      <div className="border-t mt-4 pt-2 flex flex-wrap justify-between items-center text-sm text-gray-500 gap-2">
        <div className="flex items-center gap-1">
          <Star size={16} className="text-yellow-400 fill-current" />
          <span className="font-bold text-gray-700">{lab.rating}</span>
        </div>
        <p>{lab.experience} Years of Experience</p>
      </div>
    </div>
  </motion.div>
);
