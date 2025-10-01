import React from 'react';
import { Download, Filter, Loader2 } from 'lucide-react'; // Import Loader2

interface SalesHeaderProps {
  timeFilter: 'monthly' | 'yearly';
  setTimeFilter: (filter: 'monthly' | 'yearly') => void;
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  exportToPDF: () => void;
  isDownloading: boolean; // Add isDownloading prop
}

const SalesHeader: React.FC<SalesHeaderProps> = ({
  timeFilter,
  setTimeFilter,
  selectedYear,
  setSelectedYear,
  exportToPDF,
  isDownloading,
}) => (
  <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">View:</span>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => setTimeFilter('monthly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeFilter === 'monthly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setTimeFilter('yearly')}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              timeFilter === 'yearly'
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Yearly
          </button>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A6A] focus:border-transparent"
        >
          {[2024].map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <button
          onClick={exportToPDF}
          className="flex items-center gap-2 px-4 py-2 bg-[#006A6A] text-white rounded-lg hover:bg-[#005A5A] transition-colors disabled:bg-[#007A7A] disabled:cursor-not-allowed"
          disabled={isDownloading}
        >
          {isDownloading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Downloading...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Export PDF
            </>
          )}
        </button>
      </div>
    </div>
  </div>
);

export default SalesHeader;
