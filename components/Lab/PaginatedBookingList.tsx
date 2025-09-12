// // components/Lab/PaginatedBookingList.tsx
// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import BookingList from './BookingList';

// interface PaginatedBookingListProps {
//   bookings: any[];
//   selectedDate: Date | null;
// }

// const PaginatedBookingList: React.FC<PaginatedBookingListProps> = ({
//   bookings,
//   selectedDate,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // // Calculate total pages
//   // const totalPages = Math.ceil(bookings.length / itemsPerPage);

//   // // Get current page items
//   // const currentItems = bookings.slice(
//   //   (currentPage - 1) * itemsPerPage,
//   //   currentPage * itemsPerPage
//   // );

//   // Filter bookings by selectedDate (moved from BookingList)
//   const filteredBookings = useMemo(() => {
//     if (!selectedDate) return bookings;
//     return bookings.filter((booking) => {
//       const bookingDate = new Date(booking.date).toDateString();
//       return bookingDate === selectedDate.toDateString();
//     });
//   }, [bookings, selectedDate]);

//   // Reset to page 1 when date changes
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedDate]);

//   // Calculate total pages
//   const totalPages = Math.ceil(filteredBookings.length / itemsPerPage);

//   // Get current page items
//   const currentItems = filteredBookings.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   // Handle page change
//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   // Generate page numbers
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return pages;
//   };

//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       {/* Header with patient count */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h3 className="text-base font-semibold text-gray-800">
//           Patient List ( {bookings.length}{' '}
//           {bookings.length === 1 ? 'Patient' : 'Patients'} )
//         </h3>
//       </div>

//       {/* Booking List */}
//       <div className="p-0">
//         <BookingList bookings={currentItems} selectedDate={selectedDate} />
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-700">
//               Showing{' '}
//               <span className="font-medium">
//                 {(currentPage - 1) * itemsPerPage + 1}
//               </span>{' '}
//               to{' '}
//               <span className="font-medium">
//                 {Math.min(currentPage * itemsPerPage, bookings.length)}
//               </span>{' '}
//               of <span className="font-medium">{bookings.length}</span> patients
//             </div>

//             <div className="flex space-x-2">
//               {/* Previous button */}
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded-md text-sm font-medium ${
//                   currentPage === 1
//                     ? 'text-gray-400 cursor-not-allowed'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 Previous
//               </button>

//               {/* Page numbers */}
//               {getPageNumbers().map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded-md text-sm font-medium ${
//                     currentPage === page
//                       ? 'bg-indigo-600 text-white'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}

//               {/* Next button */}
//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 rounded-md text-sm font-medium ${
//                   currentPage === totalPages
//                     ? 'text-gray-400 cursor-not-allowed'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaginatedBookingList;




// // components/Lab/PaginatedBookingList.tsx
// 'use client';

// import React, { useEffect, useMemo, useState } from 'react';
// import BookingList from './BookingList';

// interface PaginatedBookingListProps {
//   bookings: any[];
//   selectedDate: Date | null;
// }

// const PaginatedBookingList: React.FC<PaginatedBookingListProps> = ({
//   bookings,
//   selectedDate,
// }) => {
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 5;

//   // --- Helper for delivery priority ---
//   const getDeliveryType = (booking: any): string | undefined => {
//     if (booking.deliveryType) return booking.deliveryType;

//     if (booking.booking_addons?.length) {
//       const addonNames = booking.booking_addons.map((a: any) =>
//         a.addons.name.toUpperCase()
//       );
//       if (addonNames.some((n: string) => n.includes('EXPRESS'))) return 'EXPRESS';
//       if (addonNames.some((n: string) => n.includes('SUPERFAST'))) return 'SUPERFAST';
//     }
//     return undefined;
//   };

//   const getPriority = (deliveryType?: string) => {
//     if (deliveryType === 'EXPRESS') return 2;
//     if (deliveryType === 'SUPERFAST') return 1;
//     return 0;
//   };

//   // --- Filter + Sort ---
//   const filteredAndSortedBookings = useMemo(() => {
//     let result = bookings;

//     if (selectedDate) {
//       result = result.filter((booking) => {
//         const bookingDate = new Date(booking.date).toDateString();
//         return bookingDate === selectedDate.toDateString();
//       });
//     }

//     return [...result].sort((a, b) => {
//       const dateTimeA = new Date(a.date).getTime();
//       const dateTimeB = new Date(b.date).getTime();

//       if (dateTimeA === dateTimeB) {
//         // Same datetime → prioritize delivery type
//         return getPriority(getDeliveryType(b)) - getPriority(getDeliveryType(a));
//       }

//       return dateTimeA - dateTimeB; // earlier datetime first
//     });
//   }, [bookings, selectedDate]);

//   // --- Pagination ---
//   useEffect(() => {
//     setCurrentPage(1);
//   }, [selectedDate]);

//   const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage);

//   const currentItems = filteredAndSortedBookings.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   const handlePageChange = (page: number) => {
//     setCurrentPage(page);
//   };

//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisiblePages = 5;

//     let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
//     let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

//     if (endPage - startPage + 1 < maxVisiblePages) {
//       startPage = Math.max(1, endPage - maxVisiblePages + 1);
//     }

//     for (let i = startPage; i <= endPage; i++) {
//       pages.push(i);
//     }

//     return pages;
//   };

//   return (
//     <div className="bg-white shadow rounded-lg overflow-hidden">
//       {/* Header */}
//       <div className="px-6 py-4 border-b border-gray-200">
//         <h3 className="text-base font-semibold text-gray-800">
//           Appointments ( {filteredAndSortedBookings.length}{' '}
//           {filteredAndSortedBookings.length === 1 ? 'Booking' : 'Bookings'} )
//         </h3>
//       </div>

//       {/* Booking List */}
//       <div className="p-0">
//         <BookingList bookings={currentItems} selectedDate={selectedDate} />
//       </div>

//       {/* Pagination */}
//       {totalPages > 1 && (
//         <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
//           <div className="flex items-center justify-between">
//             <div className="text-sm text-gray-700">
//               Showing{' '}
//               <span className="font-medium">
//                 {(currentPage - 1) * itemsPerPage + 1}
//               </span>{' '}
//               to{' '}
//               <span className="font-medium">
//                 {Math.min(currentPage * itemsPerPage, filteredAndSortedBookings.length)}
//               </span>{' '}
//               of <span className="font-medium">{filteredAndSortedBookings.length}</span>{' '}
//               patients
//             </div>

//             <div className="flex space-x-2">
//               <button
//                 onClick={() => handlePageChange(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className={`px-3 py-1 rounded-md text-sm font-medium ${
//                   currentPage === 1
//                     ? 'text-gray-400 cursor-not-allowed'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 Previous
//               </button>

//               {getPageNumbers().map((page) => (
//                 <button
//                   key={page}
//                   onClick={() => handlePageChange(page)}
//                   className={`px-3 py-1 rounded-md text-sm font-medium ${
//                     currentPage === page
//                       ? 'bg-indigo-600 text-white'
//                       : 'text-gray-700 hover:bg-gray-100'
//                   }`}
//                 >
//                   {page}
//                 </button>
//               ))}

//               <button
//                 onClick={() => handlePageChange(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className={`px-3 py-1 rounded-md text-sm font-medium ${
//                   currentPage === totalPages
//                     ? 'text-gray-400 cursor-not-allowed'
//                     : 'text-gray-700 hover:bg-gray-100'
//                 }`}
//               >
//                 Next
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default PaginatedBookingList;


'use client';

import React, { useEffect, useMemo, useState } from 'react';
import BookingList from './BookingList';

interface PaginatedBookingListProps {
  bookings: any[];
  selectedDate: Date | null;
  selectedYear: number;
}

const PaginatedBookingList: React.FC<PaginatedBookingListProps> = ({
  bookings,
  selectedDate,
  selectedYear
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  // --- Delivery priority helpers ---
  const getDeliveryType = (booking: any): string | undefined => {
    if (booking.deliveryType) return booking.deliveryType;

    // if (booking.booking_addons?.length) {
    //   const addonNames = booking.booking_addons.map((a: any) => a.addons.name.toUpperCase());
    //   if (addonNames.some(n => n.includes('EXPRESS'))) return 'EXPRESS';
    //   if (addonNames.some(n => n.includes('SUPERFAST'))) return 'SUPERFAST';
    // }
    // return undefined;

    if (booking.booking_addons?.length) {
      const addonNames: string[] = booking.booking_addons.map(
        (a: any) => a.addons.name.toUpperCase()
      );
      if (addonNames.some((n: string) => n.includes('EXPRESS'))) return 'EXPRESS';
      if (addonNames.some((n: string) => n.includes('SUPERFAST'))) return 'SUPERFAST';
    }
    return undefined;

  };

  const getPriority = (deliveryType?: string) => {
    if (deliveryType === 'EXPRESS') return 2;
    if (deliveryType === 'SUPERFAST') return 1;
    return 0;
  };

  // --- Filter + sort bookings ---
  const filteredAndSortedBookings = useMemo(() => {
    let result = bookings;

    // Filter by year
    result = result.filter(b => new Date(b.date).getFullYear() === selectedYear);

    // Filter by date if selected
    if (selectedDate) {
      result = result.filter(b => new Date(b.date).toDateString() === selectedDate.toDateString());
    }

    return [...result].sort((a, b) => {
      const timeA = new Date(a.date).getTime();
      const timeB = new Date(b.date).getTime();
      if (timeA === timeB) return getPriority(getDeliveryType(b)) - getPriority(getDeliveryType(a));
      return timeA - timeB;
    });
  }, [bookings, selectedDate, selectedYear]);

  // Reset page on date/year change
  useEffect(() => { setCurrentPage(1); }, [selectedDate, selectedYear]);

  const totalPages = Math.ceil(filteredAndSortedBookings.length / itemsPerPage);
  const currentItems = filteredAndSortedBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const getPageNumbers = () => {
    const pages: number[] = [];
    const maxVisiblePages = 5;
    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    if (end - start + 1 < maxVisiblePages) start = Math.max(1, end - maxVisiblePages + 1);
    for (let i = start; i <= end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-base font-semibold text-gray-800">
          Bookings ( {filteredAndSortedBookings.length} )
        </h3>
      </div>

      <div className="p-0">
        <BookingList bookings={currentItems} selectedDate={selectedDate} />
      </div>

      {totalPages > 1 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
            <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredAndSortedBookings.length)}</span> of{' '}
            <span className="font-medium">{filteredAndSortedBookings.length}</span> patients
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === 1 ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Previous
            </button>

            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded-md text-sm font-medium ${page === currentPage ? 'bg-green-500 text-white' : 'text-gray-700 hover:bg-gray-100'}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`px-3 py-1 rounded-md text-sm font-medium ${currentPage === totalPages ? 'text-gray-400 cursor-not-allowed' : 'text-gray-700 hover:bg-gray-100'}`}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaginatedBookingList;

