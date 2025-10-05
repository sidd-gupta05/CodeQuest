//components/LabTestTracker.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/utils/supabase/client';
import {
  Eye,
  Download,
  RotateCw,
  Check,
  Clock,
  Search,
  Filter,
  Calendar,
  User,
  Phone,
  MapPin,
} from 'lucide-react';
import { NewStepper } from './NewStepper';
import Navbar from './navbar';
import Footer from './footer';
import Image from 'next/image';

interface Booking {
  id: string;
  bookingId: string;
  date: string;
  status: string;
  reportStatus: string;
  totalAmount: number;
  booking_addons: { id: string; addonId: string; name: string }[];
  booking_tests: { id: string; testId: string; name: string }[];
  patient: {
    id: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
  };
  lab: {
    id: string;
    labLocation: string;
    labName: string;
  };
}

const statusConfig: Record<
  string,
  { bg: string; text: string; border: string; icon: any }
> = {
  PENDING: {
    bg: 'bg-gradient-to-r from-amber-50 to-orange-50',
    text: 'text-amber-700',
    border: 'border-amber-200',
    icon: Clock,
  },
  CONFIRMED: {
    bg: 'bg-gradient-to-r from-emerald-50 to-green-50',
    text: 'text-emerald-700',
    border: 'border-emerald-200',
    icon: Check,
  },
};

const reportSteps = [
  { key: 'TEST_BOOKED', label: 'Test Booked' },
  { key: 'SAMPLE_COLLECTED', label: 'Sample Collected' },
  { key: 'IN_LAB', label: 'In Lab for Testing' },
  { key: 'UNDER_REVIEW', label: 'Report Under Review' },
  { key: 'REPORT_READY', label: 'Report Ready' },
];

const LabTestTracker = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);

  useEffect(() => {
    async function fetchBookings() {
      setLoading(true);
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) return;

        const response = await fetch('/api/bookings/get-user-bookings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id }),
        });

        const data = await response.json();
        if (!response.ok) {
          console.error('Error fetching bookings:', data.error, data.details);
        } else {
          setBookings(data.bookings);
        }
      } catch (err) {
        console.error('Fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchBookings();
  }, []);

  //real-time stepper update
  useEffect(() => {
    let channel: any;

    const setupRealtime = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // 1. Get all patients of this user
      const { data: patients, error } = await supabase
        .from('patients')
        .select('id')
        .eq('userId', user.id);

      if (error || !patients?.length) return;

      const patientIds = patients.map((p) => p.id);

      // 2. Subscribe to bookings for all those patientIds
      channel = supabase
        .channel(`user-patients-${user.id}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'bookings',
            filter: `patientId=in.(${patientIds.join(',')})`,
          },
          (payload) => {
            setBookings((prev) =>
              prev.map((b) =>
                b.id === payload.new.id ? { ...b, ...payload.new } : b
              )
            );
          }
        )
        .subscribe();
    };

    setupRealtime();

    return () => {
      if (channel) supabase.removeChannel(channel);
    };
  }, []);

  useEffect(() => {
    if (selectedBooking) {
      // Lock body scroll
      document.body.classList.add('overflow-hidden');
    } else {
      // Restore body scroll
      document.body.classList.remove('overflow-hidden');
    }

    // Cleanup if component unmounts
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, [selectedBooking]);

  // Sync selectedBooking with latest bookings data
  useEffect(() => {
    if (selectedBooking) {
      const updated = bookings.find((b) => b.id === selectedBooking.id);
      if (updated) {
        setSelectedBooking(updated);
      }
    }
  }, [bookings]);

  // Filter & paginate
  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      booking.lab.labName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      `${booking.patient.firstName} ${booking.patient.lastName}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      selectedStatus === 'All' || booking.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const totalItems = filteredBookings.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getLastNum = (booking: Booking): string => {
    return booking.bookingId ? booking.bookingId.slice(-4).toUpperCase() : '';
  };
  const getDownloadUrl = (booking: Booking) => {
    const finalFileName = `${getLastNum(booking)}_report.pdf`;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/bookings/${booking.bookingId}/${finalFileName}`;
  };

  const currentStepIndex = selectedBooking
    ? reportSteps.findIndex((s) => s.key === selectedBooking.reportStatus)
    : -1;
  const percentPerStep = 100 / (reportSteps.length - 1);

  if (loading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #91D8C1 15%, #FFF 70% )',
        }}
      >
        <div className="text-white">
          <Navbar />
        </div>

        <div className="flex flex-col justify-center items-center my-auto">
          <div className="mx-auto">
            <Image
              width={80}
              height={80}
              src="/report-loading.gif"
              alt="Loading..."
            />
          </div>
          <div className="mt-2 text-center text-slate-700 font-semibold">
            Gathering your bookings . . .
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Navbar />

      <div className="px-4 py-8">
        <div className="px-4 md:px-8 lg:px-12 py-8 max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-[#178087] via-[#2B7C7E] to-[#22465A] bg-clip-text text-transparent mb-4">
              Track Reports
            </h1>
            <p className="text-slate-600 text-lg font-medium max-w-2xl mx-auto">
              Monitor your test results and booking status in real-time
            </p>
          </div>

          {/* Table Card */}
          <div className="bg-white/80 backdrop-blur-sm border border-white/50 shadow-xl rounded-3xl overflow-hidden">
            {/* Integrated Filter Header */}
            <div className="bg-gradient-to-r from-slate-50 via-green-50 to-indigo-50 px-8 py-6 border-b border-slate-200">
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
                {/* Filter Controls */}
                <div className="flex flex-wrap gap-4">
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
                    <select
                      value={selectedStatus}
                      onChange={(e) => {
                        setSelectedStatus(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="pl-10 pr-8 py-3 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 bg-white hover:border-[#178087] focus:border-[#178087] focus:ring-2 focus:ring-[#178087]/20 transition-all duration-200 cursor-pointer shadow-sm"
                    >
                      <option value="All">All Status</option>
                      <option value="PENDING">Pending</option>
                      <option value="CONFIRMED">Confirmed</option>
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedStatus('All');
                      setCurrentPage(1);
                    }}
                    className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-amber-600 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl hover:from-amber-100 hover:to-orange-100 hover:border-amber-300 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <RotateCw className="w-4 h-4" />
                    Reset Filters
                  </button>
                </div>

                {/* Search Bar */}
                <div className="relative w-full lg:w-96">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search by Booking ID, Lab, or Patient"
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value);
                      setCurrentPage(1);
                    }}
                    className="pl-12 pr-4 py-3 border text-gray-700 border-slate-200 rounded-xl w-full text-sm font-medium bg-white/90 placeholder:text-slate-400 focus:ring-2 focus:ring-[#178087]/20 focus:border-[#178087] hover:border-slate-300 transition-all duration-200 shadow-sm"
                  />
                </div>
              </div>
            </div>

            {/* Table Content */}
            <div className="bg-white">
              <div className="overflow-x-auto">
                <table className="min-w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Booking Details
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Lab Information
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Patient Info
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {paginatedBookings.length > 0 ? (
                      paginatedBookings.map((booking, index) => {
                        const statusInfo = statusConfig[booking.status];
                        const StatusIcon = statusInfo?.icon;

                        return (
                          <tr
                            key={booking.id}
                            className="hover:bg-gradient-to-r hover:from-slate-50 hover:to-blue-50 transition-all duration-200 group"
                          >
                            <td className="px-6 py-5">
                              <div className="flex flex-col space-y-1">
                                <span className="font-mono text-sm font-bold text-[#178087] bg-[#178087]/10 px-3 py-1 rounded-lg inline-block w-fit">
                                  {booking.bookingId}
                                </span>
                                <div className="flex items-center text-xs text-slate-500">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  {new Date(booking.date).toLocaleDateString(
                                    'en-US',
                                    {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric',
                                      hour: '2-digit',
                                      minute: '2-digit',
                                    }
                                  )}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col space-y-1">
                                <span className="font-semibold text-slate-900 text-sm">
                                  {booking.lab.labName}
                                </span>
                                <div className="flex items-center text-xs text-slate-500">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {booking.lab.labLocation ||
                                    'Location not specified'}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex flex-col space-y-1">
                                <div className="flex items-center">
                                  <span className="font-medium text-slate-900 text-sm">
                                    {booking.patient.firstName}{' '}
                                    {booking.patient.lastName}
                                  </span>
                                </div>
                                <div className="flex items-center text-xs text-slate-500">
                                  {booking.patient.phone}
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div
                                className={`inline-flex items-center px-3 py-2 rounded-xl border text-xs font-semibold ${statusInfo ? `${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}` : 'bg-slate-50 text-slate-700 border-slate-200'}`}
                              >
                                {StatusIcon && (
                                  <StatusIcon className="w-3 h-3 mr-1.5" />
                                )}
                                {booking.status}
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <div className="flex gap-3">
                                {/* View Details Button */}
                                <button
                                  onClick={() => setSelectedBooking(booking)}
                                  className="group/btn hover:cursor-pointer flex items-center justify-center w-9 h-9 text-slate-400 hover:text-[#178087] hover:bg-[#178087]/10 rounded-xl transition-all duration-200 border border-transparent hover:border-[#178087]/20"
                                  title="View Details"
                                >
                                  <Eye className="w-4 h-4" />
                                </button>

                                {/* Download / Open PDF */}
                                <button
                                  className="group/btn flex items-center justify-center w-9 h-9 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-xl transition-all duration-200 border border-transparent hover:border-emerald-200"
                                  title="View Report"
                                >
                                  <a
                                    href={getDownloadUrl(booking)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                  >
                                    <Download className="w-4 h-4" />
                                  </a>
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={5} className="px-6 py-12 text-center">
                          <div className="flex flex-col items-center justify-center space-y-4">
                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                              <Search className="w-8 h-8 text-slate-400" />
                            </div>
                            <div>
                              <h3 className="font-semibold text-slate-900 mb-1">
                                No bookings found
                              </h3>
                              <p className="text-slate-500 text-sm">
                                Try adjusting your search or filter criteria
                              </p>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalItems > 0 && (
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Show</span>
                        <select
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="border border-slate-200 rounded-lg px-3 py-1.5 text-sm font-medium bg-white hover:border-slate-300 focus:border-[#178087] focus:ring-1 focus:ring-[#178087]/20 transition-all duration-200"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={25}>25</option>
                        </select>
                        <span className="font-medium">entries</span>
                      </div>
                      <div className="hidden sm:block text-slate-500">
                        Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                        {Math.min(currentPage * itemsPerPage, totalItems)} of{' '}
                        {totalItems}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                        (pageNum) => (
                          <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 ${
                              pageNum === currentPage
                                ? 'bg-[#178087] text-white border-[#178087] shadow-md'
                                : 'text-slate-700 border-slate-200 bg-white hover:border-[#178087] hover:text-[#178087] hover:bg-[#178087]/5'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Modal */}
          {selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] relative animate-in fade-in zoom-in-95 duration-300 border border-slate-200 overflow-hidden">
                {/* Close Button */}
                <button
                  onClick={() => setSelectedBooking(null)}
                  className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center text-slate-500 hover:cursor-pointer bg-slate-200 rounded-full transition-all duration-200 z-10"
                  aria-label="Close Modal"
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Scrollable Content */}
                <div className="overflow-y-auto max-h-[90vh] modal-scroll p-8">
                  {/* Progress Section */}
                  {selectedBooking.status !== 'PENDING' ? (
                    <div className="bg-gradient-to-br from-white to-slate-50 rounded-2xl border border-slate-100 mb-6 p-6">
                      <h3 className="font-semibold text-slate-900 mb-6 text-center">
                        Report Progress
                      </h3>
                      <NewStepper status={selectedBooking.reportStatus} />
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200 p-6 mb-6 text-center">
                      <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Clock className="w-8 h-8 text-amber-600" />
                      </div>
                      <h3 className="font-semibold text-amber-900 mb-2">
                        Booking Pending
                      </h3>
                      <p className="text-amber-700 text-sm leading-relaxed">
                        Your booking is pending as the payment is being
                        processed. You’ll be notified once it’s confirmed.
                      </p>
                    </div>
                  )}

                  {/*Booking Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Left Column */}
                    <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-2xl p-6 border border-slate-100">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#178087] rounded-full"></div>
                        Booking Information
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Booking ID
                          </p>
                          <p className="font-mono text-sm font-bold text-[#178087] bg-white px-3 py-2 rounded-lg border">
                            {selectedBooking.bookingId}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Date
                          </p>
                          <p className=" text-slate-900 flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(selectedBooking.date).toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                              }
                            )}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Time
                          </p>
                          <p className="text-slate-900 flex items-center gap-2">
                            <Clock className="w-4 h-4 text-slate-400" />
                            {new Date(selectedBooking.date).toLocaleTimeString(
                              'en-US',
                              {
                                hour: '2-digit',
                                minute: '2-digit',
                              }
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="bg-gradient-to-br from-slate-50 to-emerald-50 rounded-2xl p-6 border border-slate-100">
                      <div className="space-y-4">
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Patient
                          </p>
                          <p className="text-slate-900 flex items-center gap-2">
                            <User className="w-4 h-4 text-slate-400" />
                            {selectedBooking.patient.firstName}{' '}
                            {selectedBooking.patient.lastName}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Phone
                          </p>
                          <p className="text-slate-900 flex items-center gap-2">
                            <Phone className="w-4 h-4 text-slate-400" />
                            {selectedBooking.patient.phone}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                            Lab
                          </p>
                          <p className="text-slate-900 flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-slate-400" />
                            {selectedBooking.lab.labName}
                          </p>
                        </div>
                        <div>
                          <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <p className="text-xs font-medium text-slate-500 uppercase tracking-wide mb-1">
                              Total Amount
                            </p>
                            <p className="font-bold text-lg text-emerald-600 flex items-center gap-2">
                              <span className="text-sm">₹</span>
                              {selectedBooking.totalAmount.toLocaleString(
                                'en-IN'
                              )}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Booking Details Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Tests Section */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Booked Tests
                        <span className="ml-auto bg-blue-100 text-blue-700 text-xs font-bold px-2 py-1 rounded-full">
                          {selectedBooking.booking_tests.length}
                        </span>
                      </h3>
                      <div className="space-y-2">
                        {selectedBooking.booking_tests.length > 0 ? (
                          selectedBooking.booking_tests.map(
                            (test: any, index: number) => (
                              <span
                                key={test.id}
                                className="inline-block bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 mr-2 rounded-full border border-blue-200"
                              >
                                {test.testId?.name || `Test #${index + 1}`}
                              </span>
                            )
                          )
                        ) : (
                          <p className="text-sm text-slate-500 italic">
                            No tests booked
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Add-ons Section */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl p-6 border border-purple-100">
                      <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Add-ons
                        <span className="ml-auto bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full">
                          {selectedBooking.booking_addons.length}
                        </span>
                      </h3>
                      <div className="space-y-2">
                        {selectedBooking.booking_addons.length > 0 ? (
                          selectedBooking.booking_addons.map(
                            (addon: any, index: number) => (
                              <span
                                key={addon.id}
                                className="inline-block bg-purple-100 text-purple-700 text-xs font-medium px-3 py-1 mr-2 rounded-full border border-purple-200"
                              >
                                {addon.addonId?.name || `Add-on #${index + 1}`}
                              </span>
                            )
                          )
                        ) : (
                          <p className="text-sm text-slate-500 italic">
                            No add-ons selected
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default LabTestTracker;
