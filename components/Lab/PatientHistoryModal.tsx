// components/Lab/PatientHistoryModal.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { X, Download, FileText, Calendar, User } from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import { Patient, Booking } from './PatientList';

interface PatientHistoryModalProps {
  patient: Patient | null;
  show: boolean;
  onClose: () => void;
}

const PatientHistoryModal: React.FC<PatientHistoryModalProps> = ({
  patient,
  show,
  onClose,
}) => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (show && patient) {
      fetchPatientBookings();
    }
  }, [show, patient]);

  const fetchPatientBookings = async () => {
    if (!patient) return;

    setLoading(true);
    try {
      const { data: bookingsData, error } = await supabase
        .from('bookings')
        .select(
          `
          id,
          bookingId,
          date,
          status,
          reportStatus,
          reportUrl,
          totalAmount,
          booking_tests (
            testId (
              name
            )
          )
        `
        )
        .eq('patientId', patient.id)
        .order('date', { ascending: false });

      if (error) throw error;

      console.log('Raw bookings data:', bookingsData);

      // Transform the data to match our Booking type
      const transformedBookings: Booking[] = (bookingsData || []).map(
        (booking) => ({
          id: booking.id,
          bookingId: booking.bookingId,
          date: booking.date,
          status: booking.status,
          reportStatus: booking.reportStatus,
          reportUrl: booking.reportUrl,
          totalAmount: booking.totalAmount,
          booking_tests: Array.isArray(booking.booking_tests)
            ? booking.booking_tests.map((test: any) => ({
                testId: {
                  name: test.testId?.name || 'Unknown Test',
                },
              }))
            : [],
        })
      );

      console.log('Transformed bookings:', transformedBookings);
      setBookings(transformedBookings);
    } catch (error) {
      console.error('Error fetching patient bookings:', error);
    } finally {
      setLoading(false);
    }
  };

  const getFileNameFromUrl = (url: string) => {
    if (!url) return 'report.pdf';
    const urlParts = url.split('/');
    return urlParts[urlParts.length - 1];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getReportUrl = (booking: Booking): string | null => {
    if (booking.reportUrl) {
      return booking.reportUrl;
    }

    const lastFourChars = booking.bookingId.slice(-4).toUpperCase();
    const finalFileName = `${lastFourChars}_report.pdf`;
    return `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/bookings/${booking.bookingId}/${finalFileName}`;
  };

  const checkReportExists = async (reportUrl: string): Promise<boolean> => {
    try {
      const response = await fetch(reportUrl, { method: 'HEAD' });
      return response.ok;
    } catch (error) {
      return false;
    }
  };

  if (!show || !patient) return null;

  const fullName =
    `${patient.firstName || ''} ${patient.lastName || ''}`.trim() || 'Unknown';

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Escape') onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose} onKeyDown={handleKeyDown}
      />

      {/* Modal */}
      <div className="relative h-[90vh] overflow-y-auto modal-scroll bg-white rounded-lg shadow-2xl w-full max-w-4xl p-6 mx-4">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <User className="w-5 h-5" />
              Patient History
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {fullName} • {patient.phone || 'No phone'} •{' '}
              {patient.age || 'N/A'} years
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Patient Info */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="text-sm font-semibold mb-3">Patient Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Patient ID:</span>
              <p className="font-medium">{patient.id}</p>
            </div>
            <div>
              <span className="text-gray-600">Name:</span>
              <p className="font-medium">{fullName}</p>
            </div>
            <div>
              <span className="text-gray-600">Phone:</span>
              <p className="font-medium">{patient.phone || '-'}</p>
            </div>
            <div>
              <span className="text-gray-600">Age/Gender:</span>
              <p className="font-medium">
                {patient.age || 'N/A'} / {patient.gender || '-'}
              </p>
            </div>
            <div className="md:col-span-2">
              <span className="text-gray-600">Address:</span>
              <p className="font-medium">{patient.address || '-'}</p>
            </div>
          </div>
        </div>

        {/* Test Reports */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Test Reports History</h3>
            <span className="text-sm text-gray-600">
              {bookings.length} booking{bookings.length !== 1 ? 's' : ''} found
            </span>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
              <p className="text-gray-600 mt-2">Loading patient history...</p>
            </div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">
                No test reports found for this patient
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map((booking) => {
                const reportUrl = getReportUrl(booking);
                const isReportReady = booking.reportStatus === 'REPORT_READY';
                const shouldHaveReport = isReportReady;

                return (
                  <div
                    key={booking.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <p className="font-semibold text-gray-900">
                            #{booking.bookingId}
                          </p>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              isReportReady
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {booking.reportStatus?.replace('_', ' ') ||
                              'PENDING'}
                          </span>
                          <span
                            className={`px-2 py-1 text-xs rounded-full ${
                              booking.status === 'COMPLETED'
                                ? 'bg-blue-100 text-blue-800'
                                : booking.status === 'CONFIRMED'
                                  ? 'bg-green-100 text-green-800'
                                  : 'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span>{formatDate(booking.date)}</span>
                        </div>

                        <div className="mb-2">
                          <p className="text-sm text-gray-600">Tests:</p>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {booking.booking_tests.map((test, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                              >
                                {test.testId?.name || 'Unknown Test'}
                              </span>
                            ))}
                          </div>
                        </div>

                        <p className="text-sm font-medium text-gray-900">
                          Amount: ₹{booking.totalAmount.toFixed(2)}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {shouldHaveReport ? (
                          <a
                            href={reportUrl || '#'}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2 bg-[#007A7A] text-white text-sm rounded-lg hover:bg-[#005A5A] transition"
                            onClick={async (e) => {
                              if (!reportUrl) {
                                e.preventDefault();
                                alert('Report URL not available');
                                return;
                              }

                              // Optional: Check if report actually exists before downloading
                              const exists = await checkReportExists(reportUrl);
                              if (!exists) {
                                e.preventDefault();
                                alert(
                                  'Report file not found. It may have been deleted or not uploaded properly.'
                                );
                              }
                            }}
                          >
                            <Download className="w-4 h-4" />
                            Download Report
                          </a>
                        ) : (
                          <div className="text-center">
                            <FileText className="w-8 h-8 text-gray-300 mx-auto mb-1" />
                            <span className="text-xs text-gray-400 block">
                              No Report
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Debug info - you can remove this in production */}
                    {/* <div className="mt-2 p-2 bg-gray-100 rounded text-xs">
                      <p>Booking ID: {booking.bookingId}</p>
                      <p>Report Status: {booking.reportStatus}</p>
                      <p>
                        Database reportUrl:{' '}
                        {booking.reportUrl ? 'EXISTS' : 'MISSING'}
                      </p>
                      <p>
                        Last 4 chars:{' '}
                        {booking.bookingId.slice(-4).toUpperCase()}
                      </p>
                      <p>Constructed URL: {reportUrl}</p>
                      <p>
                        Should Show Download: {shouldHaveReport ? 'YES' : 'NO'}
                      </p>
                    </div> */}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PatientHistoryModal;
