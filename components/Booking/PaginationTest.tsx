// components/Booking/PaginationTest.tsx
'use client';

import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';

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
      <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-lg border border-gray-200">
        No tests found matching your search.
      </p>
    );
  }

  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 6;

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total pages is less than or equal to maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always include first page
      pageNumbers.push(1);

      let startPage = Math.max(2, currentPage - 2);
      let endPage = Math.min(totalPages - 1, currentPage + 2);

      // Adjust if we're near the beginning
      if (currentPage <= 3) {
        endPage = Math.min(totalPages - 1, maxPagesToShow - 1);
      }

      // Adjust if we're near the end
      if (currentPage >= totalPages - 2) {
        startPage = Math.max(2, totalPages - (maxPagesToShow - 2));
      }

      // Add ellipsis after first page if needed
      if (startPage > 2) {
        pageNumbers.push(null); // null represents ellipsis
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }

      // Add ellipsis before last page if needed
      if (endPage < totalPages - 1) {
        pageNumbers.push(null);
      }

      // Always include last page
      if (totalPages > 1) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers;
  };

  return (
    <div className="mb-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        {tests.map(({ category, name }) => {
          const uniqueId = `${category}-${name.replace(/\s+/g, '-')}`;
          return (
            <div
              key={uniqueId}
              className={`flex items-start p-3 rounded-lg border transition-all duration-200 ${
                selectedTests.includes(name)
                  ? 'border-[#2A787A] bg-[#F0F7F7]'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
              }`}
            >
              <input
                type="checkbox"
                id={uniqueId}
                checked={selectedTests.includes(name)}
                onChange={() => onTestToggle(name)}
                className="mt-1 w-4 h-4 text-[#2A787A] bg-white border-gray-300 rounded focus:ring-[#2A787A]"
              />
              <label
                htmlFor={uniqueId}
                className="ml-3 text-sm text-gray-700 cursor-pointer flex flex-col"
              >
                <span className="font-medium">{name}</span>
                <span className="text-xs text-gray-500 mt-1">({category})</span>
              </label>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium ${
              currentPage === 1
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <ChevronLeft size={16} className="mr-1" />
            Prev
          </button>

          <div className="flex gap-1 mx-2">
            {getPageNumbers().map((page, index) =>
              page === null ? (
                <span
                  key={`ellipsis-${index}`}
                  className="w-8 h-8 flex items-center justify-center text-gray-500"
                >
                  <MoreHorizontal size={16} />
                </span>
              ) : (
                <button
                  key={page}
                  onClick={() => onPageChange(page)}
                  className={`w-8 h-8 rounded-full text-sm font-medium ${
                    currentPage === page
                      ? 'bg-[#2A787A] text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              )
            )}
          </div>

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center px-3 py-2 rounded-xl border border-gray-300 text-sm font-medium ${
              currentPage === totalPages
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            Next
            <ChevronRight size={16} className="ml-1" />
          </button>
        </div>
      )}

      <p className="text-center text-sm text-gray-500 mt-4 bg-gray-50 py-2 rounded-lg">
        Showing {(currentPage - 1) * 6 + 1} to{' '}
        {Math.min(currentPage * 6, totalTests)} of {totalTests} tests
      </p>
    </div>
  );
}
