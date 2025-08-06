// components/BookAppointment/Pagination/Pagination.tsx
import React from 'react';
import { MoreHorizontal } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 3;

    pageNumbers.push(1);

    let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(
      totalPages - 1,
      currentPage + Math.floor(maxPagesToShow / 2)
    );

    if (endPage - startPage + 1 < maxPagesToShow) {
      if (startPage === 2) {
        endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 1);
      } else if (endPage === totalPages - 1) {
        startPage = Math.max(2, endPage - maxPagesToShow + 1);
      }
    }

    if (startPage > 2) {
      pageNumbers.push(null);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    if (endPage < totalPages - 1) {
      pageNumbers.push(null);
    }

    if (totalPages > 1 && !pageNumbers.includes(totalPages)) {
      pageNumbers.push(totalPages);
    }

    return pageNumbers;
  };

  return (
    <div className="flex justify-center my-10 px-4 select-none">
      <nav className="inline-flex flex-wrap overflow-hidden space-x-2">
        <button
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-xl border-2 border-gray-300 bg-white font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Prev
        </button>

        {getPageNumbers().map((page, index) =>
          page === null ? (
            <span
              key={`ellipsis-${index}`}
              className="sm:px-3 py-1 text-xs sm:text-sm text-gray-500 flex items-center justify-center"
            >
              <MoreHorizontal className="h-4 w-4" />
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onPageChange(page)}
              className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border-2 border-b border-gray-300 font-medium rounded-full cursor-pointer ${
                currentPage === page
                  ? 'text-white bg-[#2A787A]'
                  : 'text-gray-500 hover:bg-gray-50 bg-white'
              }`}
            >
              {page}
            </button>
          )
        )}

        <button
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-xl border-2 border-gray-300 bg-white font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </nav>
    </div>
  );
};
