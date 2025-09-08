// //components/Booking/TimeSlots.tsx
// 'use client';

// import { ChevronLeft, ChevronRight, Star, MapPin, Heart } from 'lucide-react';

// interface TimeSlotsProps {
//   selectedTime: string;
//   onTimeChange: (time: string) => void;
//   timeSlots: {
//     Morning: string[];
//     Afternoon: string[];
//     Evening: string[];
//   };
// }

// export default function TimeSlots({
//   selectedTime,
//   onTimeChange,
//   timeSlots,
// }: TimeSlotsProps) {
//   return (
//     <div className="space-y-5">
//       {Object.entries(timeSlots).map(([period, slots]) => (
//         <div key={period}>
//           <p className="text-sm font-medium text-gray-500 mb-2">{period}</p>
//           <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-sm">
//             {slots.map((time, i) => {
//               const isDisabled = time === '-';
//               const isSelected = selectedTime === time;
//               return (
//                 <button
//                   key={i}
//                   disabled={isDisabled}
//                   onClick={() => onTimeChange(time)}
//                   className={`p-2 border rounded-md transition-colors ${
//                     isDisabled
//                       ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
//                       : isSelected
//                         ? 'border-transparent bg-[#37AFA2] text-white font-semibold'
//                         : 'border-gray-200 hover:border-teal-400'
//                   }`}
//                 >
//                   {time}
//                 </button>
//               );
//             })}
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// }


import React from "react";

interface TimeSlotsProps {
  slots: string[];
  selectedTime: string | null;
  onTimeChange: (time: string) => void;
  selectedDate: Date | null;
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  slots,
  selectedTime,
  onTimeChange,
  selectedDate,
}) => {
  const now = new Date();

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-60 overflow-y-auto pr-1">
      {slots.length === 0 && (
        <p className="text-gray-500 text-sm col-span-full">
          No available slots for this day.
        </p>
      )}

      {slots.map((slot) => {
        const [hour, minute] = slot.split(":").map(Number);
        const slotDate = selectedDate
          ? new Date(
              selectedDate.getFullYear(),
              selectedDate.getMonth(),
              selectedDate.getDate(),
              hour,
              minute
            )
          : null;

        const isPast = slotDate ? slotDate < now : false;
        const isSelected = selectedTime === slot;

        return (
          <button
            key={slot}
            onClick={() => !isPast && onTimeChange(slot)}
            disabled={isPast}
            className={`px-3 py-2 rounded-lg text-sm font-medium transition-all
              ${
                isPast
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : isSelected
                  ? "bg-[#37AFA2] text-white shadow-md"
                  : "bg-white border hover:bg-gray-50"
              }`}
          >
            {slot}
          </button>
        );
      })}
    </div>
  );
};

export default TimeSlots;
