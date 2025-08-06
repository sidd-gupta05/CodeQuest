'use client';

import { Star, MapPin } from 'lucide-react';

interface BookingHeaderProps {
  selectedLab: any;
  appointmentDate: string;
  appointmentTime: string;
}

export default function BookingHeader({
  selectedLab,
  appointmentDate,
  appointmentTime,
}: BookingHeaderProps) {
  return (
    <div className="flex items-start justify-between">
      <div className="flex items-start sm:items-center">
        <img
          src={selectedLab.image}
          alt={selectedLab.name}
          className="w-16 h-16 rounded-full mr-4 border-2 border-gray-100"
        />
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center">
            <h2 className="text-xl font-bold text-gray-800">
              {selectedLab.name}
            </h2>
            <span className="mt-1 sm:mt-0 sm:ml-3 bg-orange-400 text-white text-xs font-bold px-2 py-1 rounded-md flex items-center w-fit">
              <Star size={14} className="mr-1 fill-current" />
              {selectedLab.rating}
            </span>
          </div>
          <div className="flex items-center text-gray-500 mt-1">
            <MapPin size={16} className="mr-1.5" />
            <p>{selectedLab.location}</p>
          </div>
        </div>
      </div>
      <div className="text-right flex-col hidden sm:flex">
        <p className="text-lg font-bold text-gray-800">
          Appointment Date: {appointmentDate}
        </p>
        <p className="text-lg font-bold text-gray-800">
          Time Slot: {appointmentTime}
        </p>
      </div>
      <div className="text-right sm:hidden mt-4">
        <p className="text-sm font-bold text-gray-800">
          Date: {appointmentDate}
        </p>
        <p className="text-sm font-bold text-gray-800">
          Time: {appointmentTime}
        </p>
      </div>
    </div>
  );
}
