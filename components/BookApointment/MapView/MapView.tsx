// components/BookAppointment/MapView/MapView.tsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { ViewToggle } from '../ViewToggle/ViewToggle';
import { Lab } from '../Filters';
import { useSearchParams } from 'next/navigation';

const MapBox = dynamic(
  () => import('./MapBox'),
  {
    ssr: false,
    loading: () => (
      <div className="text-center mt-4 flex items-center justify-center">
        <span>Loading map...</span>
      </div>
    ),
  }
);

interface MapViewProps {
  labs: Lab[]; // already typed
  onViewModeChange: (mode: 'list' | 'map') => void;
}

export const MapView: React.FC<MapViewProps> = ({ labs, onViewModeChange }) => {
  const searchParams = useSearchParams();
  const directionLabId = searchParams.get('directionTo');
  const [showDirectionsInfo, setShowDirectionsInfo] = useState(false);

  useEffect(() => {
    if (directionLabId) {
      setShowDirectionsInfo(true);
      // Hide the info after 5 seconds
      const timer = setTimeout(() => setShowDirectionsInfo(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [directionLabId]);

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-700">Showing Labs on Map</h2>
        <ViewToggle viewMode="map" onViewModeChange={onViewModeChange} />
      </div>

      {showDirectionsInfo && (
        <div className="bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mb-4">
          <p>
            Directions are now showing on the map. Double-click on any lab to
            get directions.
          </p>
        </div>
      )}

      <main>
        <section className="text-center mt-10">
          <div className="relative mt-6 mx-auto max-w-5xl w-[1024] h-[600] my-20">
            <MapBox labs={labs} />
          </div>
        </section>
      </main>
    </>
  );
};
