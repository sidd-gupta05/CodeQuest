'use client';

import { ChevronLeft, ChevronRight, Star, MapPin, Heart } from 'lucide-react';

interface TimeSlotsProps {
  selectedTime: string;
  onTimeChange: (time: string) => void;
  timeSlots: {
    Morning: string[];
    Afternoon: string[];
    Evening: string[];
  };
}

export default function TimeSlots({
  selectedTime,
  onTimeChange,
  timeSlots,
}: TimeSlotsProps) {
  return (
    <div className="space-y-5">
      {Object.entries(timeSlots).map(([period, slots]) => (
        <div key={period}>
          <p className="text-sm font-medium text-gray-500 mb-2">{period}</p>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm">
            {slots.map((time, i) => {
              const isDisabled = time === '-';
              const isSelected = selectedTime === time;
              return (
                <button
                  key={i}
                  disabled={isDisabled}
                  onClick={() => onTimeChange(time)}
                  className={`p-2 border rounded-md transition-colors ${
                    isDisabled
                      ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                      : isSelected
                        ? 'border-transparent bg-[#37AFA2] text-white font-semibold'
                        : 'border-gray-200 hover:border-teal-400'
                  }`}
                >
                  {time}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
