//components/Lab/BookingList.tsx
'use client';

import React, { useMemo } from 'react';
import { Download, Eye } from 'lucide-react';

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
};

interface BookingListProps {
  bookings: Booking[];
  selectedDate: Date | null;
}

const BookingList: React.FC<BookingListProps> = ({
  bookings,
  selectedDate,
}) => {
  // Filter bookings by selected date
  const filteredBookings = useMemo(() => {
    if (!selectedDate) return bookings;

    return bookings.filter((booking) => {
      const bookingDate = new Date(booking.date).toDateString();
      return bookingDate === selectedDate.toDateString();
    });
  }, [bookings, selectedDate]);

  return (
    <div className="bg-white shadow rounded-lg overflow-hidden ">
      {/* Desktop View */}
      <div className="hidden md:block">
        <ul className="divide-y divide-gray-200">
          {filteredBookings.map((booking) => {
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

            return (
              <li key={booking.id} className="px-6 py-4 flex items-center">
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
                  {booking.booking_tests[0]?.testId?.name || 'Unknown'}
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
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <ul className="divide-y divide-gray-200">
          {filteredBookings.map((booking) => {
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

            return (
              <li key={booking.id} className="px-4 py-4">
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
                    <p className="text-sm text-gray-800">
                      {booking.booking_tests[0]?.testId?.name || 'Unknown'}
                    </p>
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
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default BookingList;
