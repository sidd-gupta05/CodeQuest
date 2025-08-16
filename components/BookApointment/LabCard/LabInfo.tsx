// components/BookAppointment/LabCard/LabInfo.tsx
import React from 'react';
import { Lab } from '../Filters/types';
import { MapPin } from 'lucide-react';
import Link from 'next/link';

interface LabInfoProps {
  lab: Lab;
}

export const LabInfo: React.FC<LabInfoProps> = ({ lab }) => (
  <div className="w-full sm:w-auto">
    <h3 className="text-lg font-bold text-[#2A787A]">{lab.name}</h3>
    <p className="text-sm text-gray-600">{lab.testType}</p>
    <p className="text-sm text-gray-500">
      <MapPin
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
          marginRight: '5px',
        }}
        size={18}
      />
      {lab.location}{' '}
      <Link
        href="/map"
        className="text-[#2A787A] px-7 hover:text-[#132425] cursor-pointer"
      >
        Get Direction
      </Link>
    </p>
  </div>
);
