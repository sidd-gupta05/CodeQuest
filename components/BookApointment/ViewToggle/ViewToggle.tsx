// components/BookAppointment/ViewToggle/ViewToggle.tsx
import React from 'react';
import { Rows2, MapPin } from 'lucide-react';

interface ViewToggleProps {
  viewMode: 'list' | 'map';
  onViewModeChange: (mode: 'list' | 'map') => void;
}

export const ViewToggle: React.FC<ViewToggleProps> = ({
  viewMode,
  onViewModeChange,
}) => (
  <div className="flex items-center gap-2">
    <button
      onClick={() => onViewModeChange('list')}
      className={`p-3 rounded-2xl transition-colors ${
        viewMode === 'list' ? 'bg-[#1e5f61]' : 'bg-gray-100 hover:bg-[#1e5f61]'
      }`}
      aria-label="View as list"
    >
      <Rows2
        className={`h-5 w-5 transition-colors ${
          viewMode === 'list' ? 'text-white' : 'text-black hover:text-white'
        }`}
      />
    </button>
    <button
      onClick={() => onViewModeChange('map')}
      className={`p-3 rounded-2xl transition-colors ${
        viewMode === 'map' ? 'bg-[#1e5f61]' : 'bg-gray-100 hover:bg-[#1e5f61]'
      }`}
      aria-label="View on map"
    >
      <MapPin
        className={`h-5 w-5 transition-colors ${
          viewMode === 'map' ? 'text-white' : 'text-black hover:text-white'
        }`}
      />
    </button>
  </div>
);
