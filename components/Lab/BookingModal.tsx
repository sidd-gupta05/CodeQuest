// components/Lab/BookingModal.tsx
'use client';
import React, { useState } from 'react';
import {
  User,
  Phone,
  Calendar,
  MapPin,
  Receipt,
  Clock,
  IndianRupee,
  Loader,
} from 'lucide-react';
import { supabase } from '@/utils/supabase/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import toast from 'react-hot-toast';
import { PDFDocument } from 'pdf-lib-with-encrypt';

type Booking = {
  bookingId: string;
  booking_tests: { testId: { name: string } }[];
  date: string;
  labId: string;
  labName: string;
  patientId?: {
    firstName?: string;
    lastName?: string;
    address?: string;
    dateOfBirth?: string;
    phone?: string;
  };
  reportStatus?: string;
  totalAmount: number;
  status?: string;
};

interface BookingModalProps {
  booking: Booking | null;
  show: boolean;
  onClose: () => void;
  //   onUpdateStatus: (newStatus: string) => void;
}

const BookingModal: React.FC<BookingModalProps> = ({
  booking,
  show,
  onClose,
  //   onUpdateStatus,
}) => {
  const [reportStatus, setReportStatus] = useState(
    booking?.reportStatus || 'TEST_BOOKED'
  );
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [uploadAttemptsLeft, setUploadAttemptsLeft] = useState(() => {
    if (typeof window !== 'undefined' && booking?.bookingId) {
      const stored = localStorage.getItem(
        `uploadAttempts-${booking.bookingId}`
      );
      return stored ? parseInt(stored, 10) : 3;
    }
    return 3;
  });

  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);
  const [confirmedStatus, setConfirmedStatus] = useState(
    booking?.reportStatus || 'TEST_BOOKED'
  );

    if (!show || !booking) return null;

  async function lockPdf(file: File, booking: Booking) {
    // Extract lab initials (first 4 uppercase letters)
    const passInitials: string = getUpperCaseName(booking).slice(0, 4);
    const passFinal: string = getLastNum(booking);

    const password: string = passInitials + passFinal;

    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, {ignoreEncryption: true});

    // Encrypt PDF
    pdfDoc.encrypt({
      userPassword: password,
      ownerPassword: password,
      permissions: {
        printing: 'highResolution',
        modifying: false,
        copying: false,
        annotating: false,
      },
    });

    const lockedPdfBytes = await pdfDoc.save();
    return { lockedPdfBytes, password };
  }

  console.log('Current report status:', reportStatus);

  async function handleSave(reportStatus: string) {
    try {
      setIsLoading(true);

      // ✅ Restrict REPORT_READY without file
      if (reportStatus === 'REPORT_READY' && !uploadedFile) {
        toast.error('Please upload a report file before saving REPORT_READY');
        setIsLoading(false);
        return;
      }

      let reportUrl = null;
      if (uploadedFile) {
        reportUrl = await handleReport();
      }

      const response = await fetch('/api/bookings/update-report-status', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bookingId: booking?.bookingId,
          reportStatus,
          reportUrl, // send uploaded file link
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(`Failed: ${data.error || 'Update failed'}`);
        setIsLoading(false);
      } else {
        toast.success('Report status updated successfully');
        setConfirmedStatus(reportStatus);
        setReportStatus(reportStatus);
        setIsLoading(false);
      }
    } catch (err) {
      console.error(err);
      toast.error('Something went wrong');
      setIsLoading(false);
    }
  }

  // File input change
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const validTypes = ['application/pdf'];

      if (!validTypes.includes(file.type)) {
        toast.error('Only PDF and DOCX files are allowed');
        e.target.value = ''; // clear input
        return;
      }
      
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer, {ignoreEncryption: true});

      if (pdfDoc.isEncrypted) {
        toast.error('Upload unprotected file! Password Protection is enabled by default');
        e.target.value = '';
        return;
      }

      setUploadedFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
      toast.success(`Valid File Selected`);
    } else {
      setUploadedFile(null);
      setImagePreviewUrl(null);
    }
  };

  const parseFileName = (bookingId: string, file: File) => {
    const NEXT_PUBLIC_SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';

    const finalFileName = `${getLastNum(booking)}_report.pdf`;
    return {
      path: `bookings/${bookingId}/${finalFileName}`,
      publicUrl: `${NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/uploads/bookings/${bookingId}/${finalFileName}`,
    };
  };

  const getUpperCaseName = (booking: Booking): string => {
    return booking.labName ? booking.labName.toUpperCase() : '';
  };

  const getLastNum = (booking: Booking): string => {
    return booking.bookingId ? booking.bookingId.slice(-4).toUpperCase() : '';
  };

  // Report upload handler
  const handleReport = async () => {
    if (!uploadedFile || !booking?.bookingId) return null;

    try {
      const { lockedPdfBytes, password } = await lockPdf(uploadedFile, booking);
      console.log({ password });

      const { path, publicUrl } = parseFileName(
        booking.bookingId,
        uploadedFile
      );

      const { error: fileError } = await supabase.storage
        .from('uploads')
        .upload(path, lockedPdfBytes, {
          upsert: true,
          contentType: 'application/pdf',
        });

      if (fileError) throw new Error(fileError.message);

      // TODO: send email to patient with publicUrl + password hint

      setUploadAttemptsLeft((prev) => {
        const next = Math.max(prev - 1, 0);
        if (booking?.bookingId) {
          localStorage.setItem(
            `uploadAttempts-${booking.bookingId}`,
            next.toString()
          );
        }
        if (next === 0) {
          toast.error('File limit is reached. Contact the administrator');
        }
        return next;
      });

      return publicUrl;
    } catch (err) {
      console.error('Error uploading report:', err);
      return null;
    }
  };

  //   console.log('Current report status:', reportStatus);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-4 mx-4">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            # Booking Details {getLastNum(booking)}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
          {/* Patient Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold mb-2">Patient Info</h3>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-[#37AFA2]" />
              <p className="font-medium text-gray-800">
                {booking.patientId?.firstName} {booking.patientId?.lastName}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-[#37AFA2]" />
              <p>{booking.patientId?.phone}</p>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#37AFA2]" />
              <p>
                DOB :{' '}
                {booking.patientId?.dateOfBirth
                  ? new Date(booking.patientId.dateOfBirth).toLocaleDateString()
                  : '-'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#37AFA2]" />
              <p className="truncate">{booking.patientId?.address}</p>
            </div>
          </div>

          {/* Booking Info */}
          <div className="bg-gray-50 rounded-xl p-4 space-y-3">
            <h3 className="text-sm font-semibold mb-2">Booking Info</h3>
            <div className="flex items-center gap-2">
              <Receipt className="w-4 h-4 text-[#37AFA2]" />
              <p>ID : {booking.bookingId}</p>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#37AFA2]" />
              <p>
                {new Date(booking.date).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}{' '}
                {new Date(booking.date).toLocaleTimeString('en-US', {
                  hour: 'numeric',
                  minute: 'numeric',
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <IndianRupee className="w-4 h-4 text-[#37AFA2]" />
              <p className="font-semibold text-[#37AFA2]">
                {booking.totalAmount.toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* Tests */}
        <div className="mt-4 bg-gray-50 rounded-xl p-4">
          <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
            Tests
          </h3>
          <div className="flex flex-wrap gap-2">
            {booking.booking_tests.map((t, i) => (
              <span
                key={i}
                className="px-3 py-1 rounded-full text-xs text-blue-900 font-medium bg-blue-100"
              >
                {t.testId?.name || 'Unknown Test'}
              </span>
            ))}
          </div>
        </div>

        {/* Report Status */}
        <div className="grid grid-cols-2 gap-4 mt-4 w-full">
          <div className="w-full bg-gray-50 rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              Report Status
            </h3>

            <p className={`text-xs mb-2`}>
              Current Status : {reportStatus.replace('_', ' ')}
            </p>

            <Select
              value={reportStatus || 'TEST_BOOKED'}
              onValueChange={setReportStatus}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select report status" />
              </SelectTrigger>
              <SelectContent className="bg-gray-100">
                {[
                  'TEST_BOOKED',
                  'SAMPLE_COLLECTED',
                  'IN_LAB',
                  'UNDER_REVIEW',
                  'REPORT_READY',
                ].map((status, index, arr) => {
                  const confirmedIndex = arr.indexOf(confirmedStatus);
                  const currentIndex = arr.indexOf(status);
                  // Only current status OR next status is enabled
                  const isEnabled =
                    currentIndex === confirmedIndex ||
                    currentIndex === confirmedIndex + 1;

                  return (
                    <SelectItem
                      key={status}
                      value={status}
                      className={`hover:cursor-pointer ${
                        isEnabled
                          ? 'hover:bg-blue-100'
                          : 'opacity-50 cursor-not-allowed'
                      }`}
                      disabled={!isEnabled}
                    >
                      {status.replace('_', ' ')}
                    </SelectItem>
                  );
                })}
              </SelectContent>
            </Select>
          </div>

          {/* Reports Upload */}
          <div className="w-full bg-gray-50 rounded-xl p-4">
            <label className="block text-sm font-semibold mb-2">Reports</label>
            <p
              className={`text-xs mb-2 ${
                uploadAttemptsLeft === 0
                  ? 'text-red-600 font-semibold'
                  : 'text-gray-500'
              }`}
            >
              Uploads remaining : {uploadAttemptsLeft}/3
            </p>

            <label
              className={`border-2 border-dashed rounded-md p-2 text-center relative block ${
                reportStatus === 'REPORT_READY'
                  ? 'border-gray-300 cursor-pointer'
                  : 'border-gray-200 cursor-not-allowed bg-gray-100 opacity-50'
              }`}
            >
              <input
                type="file"
                className="absolute inset-0 opacity-0 w-full"
                onChange={handleFileChange}
                disabled={
                  reportStatus !== 'REPORT_READY' || uploadAttemptsLeft === 0
                }
              />
              <div className="flex flex-col items-center justify-center text-gray-600">
                <p className="text-sm">Upload Reports</p>
                {imagePreviewUrl && (
                  <span className="mt-2 text-xs text-green-600">
                    File ready: {uploadedFile?.name}
                  </span>
                )}
              </div>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end mt-4 space-x-3">
          {message && (
            <p className="text-green-600 my-auto mr-auto">{message}</p>
          )}
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition"
          >
            Close
          </button>
          <button
            disabled={isLoading}
            onClick={() => handleSave(reportStatus)}
            className="px-4 py-2 flex w-16 cursor-pointer justify-center rounded-lg text-white shadow transition"
            style={{ backgroundColor: '#37AFA2' }}
          >
            {isLoading ? (
              <Loader
                className="animate-spin my-auto justify-center"
                size={20}
              />
            ) : (
              'Save'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
