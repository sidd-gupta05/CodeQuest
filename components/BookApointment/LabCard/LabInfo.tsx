// components/BookAppointment/LabCard/LabInfo.tsx
'use client';

import React from 'react';
import { Lab } from '../Filters/types';
import { MapPin } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

interface LabInfoProps {
  lab: Lab;
}

export const LabInfo: React.FC<LabInfoProps> = ({ lab }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleGetDirections = () => {
    // Update URL with direction parameter and set view to map
    const params = new URLSearchParams(searchParams.toString());
    params.set('directionTo', lab.id.toString());
    params.set('view', 'map');

    // Update the URL without navigating away
    // const newUrl = `?${params.toString()}`;
    // window.history.pushState({}, '', newUrl);
    router.push(`?${params.toString()}`);

    // Dispatch a custom event to notify the parent component about the view change
    window.dispatchEvent(new CustomEvent('viewModeChange', { detail: 'map' }));

    // Also trigger a popstate event to refresh any components listening to URL changes
    window.dispatchEvent(new Event('popstate'));
  };

  return (
    <div className="w-full sm:w-auto">
      <h3 className="text-lg font-bold text-[#2A787A]">{lab.name}</h3>
      <p className="text-sm mb-1 text-gray-600">{lab.testType}</p>
      <p className="text-sm text-gray-500">
        {/* <MapPin
          style={{
            display: 'inline-block',
            verticalAlign: 'middle',
            marginRight: '5px',
          }}
          size={18}
        /> */}
        {lab.location}{' '}
        <button
          onClick={handleGetDirections}
          className="text-[#2A787A] px-7 hover:text-[#132425] cursor-pointer"
        >
          Get Direction
        </button>
      </p>
    </div>
  );
};
