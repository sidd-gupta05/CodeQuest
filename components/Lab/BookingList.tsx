// components/Lab/BookingList.tsx
'use client';

import React, { useMemo, useState } from 'react';
import { Download, Eye, ChevronDown, ChevronUp } from 'lucide-react';

type Booking = {
  bookingId: string;
  booking_tests: { testId: { name: string } }[];
  createdAt: string;
  date: string;
  id: string;
  labId: string;
  patientId?: {
    userId?: { firstName?: string; lastName?: string };
    address?: string;
  };
  firstName?: string;
  lastName?: string;
  address?: string;
  status: string;
  totalAmount: number;
  deliveryType?: 'EXPRESS' | 'SUPERFAST' | 'STANDARD' | string;
  booking_addons?: Array<{
    addons: {
      name: string;
    };
  }>;
};

interface BookingListProps {
  bookings: Booking[];
  selectedDate: Date | null;
}

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  selectedDate,
}) => {
  const [expandedBookings, setExpandedBookings] = useState<Set<string>>(
    new Set()
  );

  const toggleBookingExpansion = (bookingId: string) => {
    const newExpanded = new Set(expandedBookings);
    if (newExpanded.has(bookingId)) {
      newExpanded.delete(bookingId);
    } else {
      newExpanded.add(bookingId);
    }
    setExpandedBookings(newExpanded);
  };

  // Enhanced function to determine delivery type
  const getDeliveryType = (booking: Booking): string | undefined => {
    if (booking.deliveryType) {
      return booking.deliveryType;
    }

    if (booking.booking_addons && booking.booking_addons.length > 0) {
      const addonNames = booking.booking_addons.map((addon) =>
        addon.addons.name.toUpperCase()
      );

      if (addonNames.some((name) => name.includes('EXPRESS'))) {
        return 'EXPRESS';
      }
      if (addonNames.some((name) => name.includes('SUPERFAST'))) {
        return 'SUPERFAST';
      }
    }

    return undefined;
  };

  // Sort bookings: Express first, then Superfast, then others
  const sortedBookings = useMemo(() => {
    return [...bookings].sort((a, b) => {
      const getPriority = (booking: Booking) => {
        const type = getDeliveryType(booking);
        if (type === 'EXPRESS') return 2;
        if (type === 'SUPERFAST') return 1;
        return 0;
      };

      return getPriority(b) - getPriority(a);
    });
  }, [bookings]);

  // Filter bookings by selected date
  const filteredBookings = useMemo(() => {
    if (!selectedDate) return sortedBookings;

    return sortedBookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toDateString();
      return bookingDate === selectedDate.toDateString();
    });
  }, [sortedBookings, selectedDate]);

  return (
    <div className="overflow-hidden">
      {/* Desktop View */}
      <div className="hidden md:block">
        <ul className="divide-y divide-gray-200">
          {filteredBookings.map((booking) => {
            const deliveryType = getDeliveryType(booking);
            const patientName =
              booking.firstName && booking.lastName
                ? `${booking.firstName} ${booking.lastName}`
                : booking.patientId?.userId
                  ? `${booking.patientId.userId.firstName || ''} ${
                      booking.patientId.userId.lastName || ''
                    }`
                  : 'Unknown';

            const patientAddress =
              booking.address || booking.patientId?.address || '-';

            const formattedDate = new Date(booking.date).toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
              }
            );

            const isExpanded = expandedBookings.has(booking.id);
            const hasMultipleTests = booking.booking_tests.length > 1;

            return (
              <li key={booking.id} className="px-6 py-4 relative">
                {/* Delivery type indicator stripe - 2 lines */}
                {deliveryType === 'EXPRESS' && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div className="absolute left-1 top-0 bottom-0 w-1 bg-red-400"></div>
                  </>
                )}
                {deliveryType === 'SUPERFAST' && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                    <div className="absolute left-1 top-0 bottom-0 w-1 bg-green-400"></div>
                  </>
                )}

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                  />

                  <div className="ml-4 flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {patientName}
                    </p>
                    <p className="text-xs italic text-gray-500">
                      {patientAddress}
                    </p>
                  </div>

                  <div className="w-32 text-sm text-gray-600">
                    {booking.bookingId}
                  </div>

                  <div className="w-32 text-sm text-gray-600">
                    <div className="flex items-center">
                      <span>
                        {booking.booking_tests[0]?.testId?.name || 'Unknown'}
                      </span>
                      {hasMultipleTests && (
                        <button
                          onClick={() => toggleBookingExpansion(booking.id)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="w-32 text-sm text-gray-600">
                    {formattedDate}
                  </div>

                  <div className="w-20 text-sm text-gray-600">UPI</div>

                  <div className="w-28">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  <div className="w-24 text-sm font-medium text-gray-900">
                    ₹{booking.totalAmount.toFixed(2)}
                  </div>

                  <div className="flex space-x-3 ml-4">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-5 h-5" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Expanded view for multiple tests */}
                {isExpanded && hasMultipleTests && (
                  <div className="mt-3 ml-8 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      All Tests:
                    </p>
                    <ul className="space-y-1">
                      {booking.booking_tests.map((test, index) => (
                        <li key={index} className="text-sm text-gray-600">
                          • {test.testId?.name || 'Unknown Test'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <ul className="divide-y divide-gray-200">
          {filteredBookings.map((booking) => {
            const deliveryType = getDeliveryType(booking);
            const patientName =
              booking.firstName && booking.lastName
                ? `${booking.firstName} ${booking.lastName}`
                : booking.patientId?.userId
                  ? `${booking.patientId.userId.firstName || ''} ${
                      booking.patientId.userId.lastName || ''
                    }`
                  : 'Unknown';

            const patientAddress =
              booking.address || booking.patientId?.address || '-';

            const formattedDate = new Date(booking.date).toLocaleDateString(
              'en-GB',
              {
                day: '2-digit',
                month: 'short',
                year: '2-digit',
              }
            );

            const isExpanded = expandedBookings.has(booking.id);
            const hasMultipleTests = booking.booking_tests.length > 1;

            return (
              <li key={booking.id} className="px-4 py-4 relative">
                {/* Delivery type indicator stripe - 2 lines */}
                {deliveryType === 'EXPRESS' && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-red-500"></div>
                    <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-red-400"></div>
                  </>
                )}
                {deliveryType === 'SUPERFAST' && (
                  <>
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-green-500"></div>
                    <div className="absolute left-1 top-0 bottom-0 w-0.5 bg-green-400"></div>
                  </>
                )}

                <div className="flex items-start justify-between">
                  <div className="flex items-start">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-indigo-600 border-gray-300 rounded mt-1"
                    />
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-900">
                        {patientName}
                      </p>
                      <p className="text-xs italic text-gray-500">
                        {patientAddress}
                      </p>
                      <div className="mt-2">
                        <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                          ID: {booking.bookingId}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="text-gray-400 hover:text-gray-600">
                      <Eye className="w-4 h-4" />
                    </button>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Test</p>
                    <div className="flex items-center">
                      <p className="text-sm text-gray-800">
                        {booking.booking_tests[0]?.testId?.name || 'Unknown'}
                      </p>
                      {hasMultipleTests && (
                        <button
                          onClick={() => toggleBookingExpansion(booking.id)}
                          className="ml-1 text-gray-500 hover:text-gray-700"
                        >
                          {isExpanded ? (
                            <ChevronUp className="w-3 h-3" />
                          ) : (
                            <ChevronDown className="w-3 h-3" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm text-gray-800">{formattedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Payment</p>
                    <p className="text-sm text-gray-800">UPI</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-full ${
                        booking.status === 'CONFIRMED'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Amount</p>
                    <p className="text-sm font-medium text-gray-900">
                      ₹{booking.totalAmount.toFixed(2)}
                    </p>
                  </div>
                </div>

                {/* Expanded view for multiple tests - Mobile */}
                {isExpanded && hasMultipleTests && (
                  <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                    <p className="text-xs font-medium text-gray-700 mb-2">
                      All Tests:
                    </p>
                    <ul className="space-y-1">
                      {booking.booking_tests.map((test, index) => (
                        <li key={index} className="text-xs text-gray-600">
                          • {test.testId?.name || 'Unknown Test'}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BookingList;
