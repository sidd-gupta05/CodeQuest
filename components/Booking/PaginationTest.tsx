// components/Booking/PaginationTest.tsx
'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationTestProps {
  tests: Array<{ category: string; name: string }>;
  selectedTests: string[];
  onTestToggle: (testName: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalTests: number;
}

export default function PaginationTest({
  tests,
  selectedTests,
  onTestToggle,
  currentPage,
  totalPages,
  onPageChange,
  totalTests,
}: PaginationTestProps) {
  if (totalTests === 0) {
    return (
      <p className="text-gray-500 text-center py-4">
        No tests found matching your search.
      </p>
    );
  }

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4 mb-4">
        {tests.map(({ category, name }) => {
          const uniqueId = `${category}-${name.replace(/\s+/g, '-')}`;
          return (
            <div key={uniqueId} className="flex items-center">
              <input
                type="checkbox"
                id={uniqueId}
                checked={selectedTests.includes(name)}
                onChange={() => onTestToggle(name)}
                className="w-4 h-4 text-[#37AFA2] bg-gray-100 border-gray-300 rounded focus:ring-[#37AFA2]"
              />
              <label
                htmlFor={uniqueId}
                className="ml-2 text-sm text-gray-700 cursor-pointer"
              >
                {name}
                <span className="text-xs text-gray-500 ml-1">({category})</span>
              </label>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`p-2 rounded-full ${
              currentPage === 1
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#37AFA2] hover:bg-gray-100'
            }`}
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`w-8 h-8 rounded-full text-sm ${
                  currentPage === page
                    ? 'bg-[#37AFA2] text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`p-2 rounded-full ${
              currentPage === totalPages
                ? 'text-gray-400 cursor-not-allowed'
                : 'text-[#37AFA2] hover:bg-gray-100'
            }`}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mt-2">
        Showing {(currentPage - 1) * 6 + 1} to{' '}
        {Math.min(currentPage * 6, totalTests)} of {totalTests} tests
      </p>
    </div>
  );
}
