"use client";

import React from "react";
import { Download, Eye, RotateCcw } from "lucide-react";

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
}

const BookingList: React.FC<BookingListProps> = ({ bookings }) => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <ul className="divide-y divide-gray-200">
                {bookings.map((booking) => {
                    const patientName =
                        booking.firstName && booking.lastName
                            ? `${booking.firstName} ${booking.lastName}`
                            : booking.patientId?.userId
                                ? `${booking.patientId.userId.firstName || ""} ${booking.patientId.userId.lastName || ""
                                }`
                                : "Unknown";

                    const patientAddress =
                        booking.address || booking.patientId?.address || "-";

                    const formattedDate = new Date(booking.date).toLocaleDateString(
                        "en-GB",
                        {
                            day: "2-digit",
                            month: "short",
                            year: "2-digit",
                        }
                    );

                    return (
                        <li key={booking.id} className="px-6 py-4 flex items-center">
                            
                            <input
                                type="checkbox"
                                className="h-4 w-4 text-indigo-600 border-gray-300 rounded"
                            />

                            {/* <div className="h-10 w-10 rounded-full bg-gray-200 ml-4" /> */}
                            
                            <div className="ml-4 flex-1">
                                <p className="text-sm font-medium text-gray-900">
                                    {patientName}
                                </p>
                                <p className="text-xs italic text-gray-500">{patientAddress}</p>
                            </div>

                           
                            <div className="w-32 text-sm text-gray-600">
                                {booking.bookingId}
                            </div>

                           
                            <div className="w-32 text-sm text-gray-600">{booking.booking_tests[0]?.testId?.name || "Unknown"}</div>

                            
                            <div className="w-32 text-sm text-gray-600">{formattedDate}</div>

                           
                            <div className="w-20 text-sm text-gray-600">UPI</div>

                            <div className="w-28">
                                <span
                                    className={`px-2 py-1 text-xs font-medium rounded-full ${booking.status === "CONFIRMED"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
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
    );
};

export default BookingList;
