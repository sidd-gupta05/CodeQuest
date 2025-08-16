// components/BookAppointment/ResultsHeader.tsx
import React from 'react';
import { ViewToggle } from './ViewToggle/ViewToggle';

interface ResultsHeaderProps {
  count: number;
  sortBy: string;
  viewMode: 'list' | 'map';
  onSortChange: (value: string) => void;
  onViewModeChange: (mode: 'list' | 'map') => void;
}

export const ResultsHeader: React.FC<ResultsHeaderProps> = ({
  count,
  sortBy,
  viewMode,
  onSortChange,
  onViewModeChange,
}) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
    <h2 className="text-xl font-bold text-gray-700">
      Showing {count} Labs For You
    </h2>
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        <label htmlFor="sort">Sort By</label>
        <select
          id="sort"
          value={sortBy}
          onChange={(e) => onSortChange(e.target.value)}
          className="border rounded-md p-1 bg-white"
        >
          <option value="rating">Rating</option>
          <option value="experience_asc">Experience (Low to High)</option>
          <option value="experience_desc">Experience (High to Low)</option>
        </select>
      </div>
      <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
    </div>
  </div>
);
