// components/Lab/BookingModal.tsx
'use client';

import React, { useState } from 'react';
import { User, Phone, Calendar, MapPin, Receipt, Clock, IndianRupee, Loader } from 'lucide-react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

type Booking = {
    bookingId: string;
    booking_tests: { testId: { name: string } }[];
    date: string;
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

    if (!show || !booking) return null;

    const [reportStatus, setReportStatus] = useState(booking.reportStatus || 'BOOKING_PENDING');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    async function handleSave(reportStatus: string) {
        try {
            setIsLoading(true)
            const response = await fetch('/api/bookings/update-report-status', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ bookingId: booking?.bookingId, reportStatus }),
            });

            const data = await response.json();
            if (!response.ok) {
                console.error('Error:', data.error);
                setIsLoading(false)
            } else {
                console.log(data.message);
                setMessage('✅ Details Updated');
                setIsLoading(false)
            }
        } catch (err) {
            console.error(err);
            setIsLoading(false)
        }
        
    }

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
                    <h2 className="text-xl font-bold flex items-center gap-2"># Booking Details</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
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
                            <p>DOB : {booking.patientId?.dateOfBirth ? new Date(booking.patientId.dateOfBirth).toLocaleDateString() : '-'}</p>
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
                                {new Date(booking.date).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}{" "}
                                {new Date(booking.date).toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric" })}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            <IndianRupee className="w-4 h-4 text-[#37AFA2]" />
                            <p className="font-semibold text-[#37AFA2]">{booking.totalAmount.toFixed(2)}</p>
                        </div>
                    </div>
                </div>

                {/* Tests */}
                <div className="mt-4 bg-gray-50 rounded-xl p-4">
                    <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">Tests</h3>
                    <div className="flex flex-wrap gap-2">
                        {booking.booking_tests.map((t, i) => (
                            <span key={i} className="px-3 py-1 rounded-full text-xs text-blue-900 font-medium bg-blue-100">
                                {t.testId?.name || "Unknown Test"}
                            </span>
                        ))}
                    </div>
                </div>

                {/* Report Status */}
                <div className="grid grid-cols-2 gap-4 mt-4 w-full">
                    <div className="w-full bg-gray-50 rounded-xl p-4">
                        <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">Report Status</h3>
                        
                        <Select value={reportStatus} onValueChange={setReportStatus}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select report status" />
                            </SelectTrigger>
                            <SelectContent className='bg-gray-100'>
                                <SelectItem className='hover:bg-blue-100 hover:cursor-pointer' value="TEST_BOOKED">Test Booked</SelectItem>
                                <SelectItem className='hover:bg-blue-100 hover:cursor-pointer' value="SAMPLE_COLLECTED">Sample Collected</SelectItem>
                                <SelectItem className='hover:bg-blue-100 hover:cursor-pointer' value="IN_LAB">In Lab</SelectItem>
                                <SelectItem className='hover:bg-blue-100 hover:cursor-pointer' value="UNDER_REVIEW">Under Review</SelectItem>
                                <SelectItem className='hover:bg-blue-100 hover:cursor-pointer' value="REPORT_READY">Report Ready</SelectItem>
                            </SelectContent>
                        </Select>

                    </div>

                    {/* Reports Upload */}
                    <div className="w-full bg-gray-50 rounded-xl p-4">
                        <label className="block text-sm font-semibold mb-2">Reports</label>
                        <label className="border-2 border-dashed border-gray-300 rounded-md p-2 text-center cursor-pointer relative block">
                            <input type="file" className="absolute inset-0 opacity-0 w-full cursor-pointer" />
                            <div className="flex flex-col items-center justify-center text-gray-600">
                                <p className="text-sm">Upload Reports</p>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex justify-end mt-4 space-x-3">
                    {message && <p className="text-green-600 my-auto mr-auto">{message}</p>}
                    <button onClick={onClose} className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition">
                        Close
                    </button>
                    <button
                        disabled={isLoading}
                        onClick={() => handleSave(reportStatus)}
                        className="px-4 py-2 flex w-16 cursor-pointer justify-center rounded-lg text-white shadow transition" style={{ backgroundColor: "#37AFA2" }}>
                        {isLoading ? <Loader className='animate-spin my-auto justify-center' size={20} /> : "Save"}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default BookingModal;

