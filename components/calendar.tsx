// import React, { useState } from 'react';
// import { ChevronLeft, ChevronRight } from 'lucide-react';

// interface CalendarProps {
//   selectedDate: Date;
//   onDateChange: (date: Date) => void;
//   disabled?: (date: Date) => boolean; 
// }

// const Calendar = ({ selectedDate, onDateChange }: CalendarProps) => {
//   const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
//   const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
//   const today = new Date();
//   today.setHours(0, 0, 0, 0);

//   const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

//   const handlePrevMonth = () => {
//     if (currentMonth === 0) {
//       setCurrentMonth(11);   
//       setCurrentYear(currentYear - 1);
//     } else {
//       setCurrentMonth(currentMonth - 1);
//     }
//   };

//   const handleNextMonth = () => {
//     if (currentMonth === 11) {
//       setCurrentMonth(0);
//       setCurrentYear(currentYear + 1);
//     } else {
//       setCurrentMonth(currentMonth + 1);
//     }
//   };

//   const getDaysInMonth = (year: number, month: number) => {
//     return new Date(year, month + 1, 0).getDate();
//   };

//   const getFirstDayOfMonth = (year: number, month: number) => {
//     return new Date(year, month, 1).getDay();
//   };

//   const isDateDisabled = (day: number) => {
//     const date = new Date(currentYear, currentMonth, day);
//     date.setHours(0, 0, 0, 0);
//     return date < today;
//   };

//   const generateCalendarDays = () => {
//     const daysInMonth = getDaysInMonth(currentYear, currentMonth);
//     const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
//     const calendarDays = [];

//     for (let i = 0; i < firstDay; i++) {
//       calendarDays.push({ day: null, isCurrentMonth: false });
//     }

//     for (let day = 1; day <= daysInMonth; day++) {
//       calendarDays.push({ day, isCurrentMonth: true });
//     }

//     return calendarDays;
//   };

//   const calendarDays = generateCalendarDays();
//   const monthYearString = new Date(currentYear, currentMonth).toLocaleString(
//     'default',
//     { month: 'long', year: 'numeric' }
//   );

//   return (
//     <div className="w-full text-gray-700">
//       <div className="flex justify-between items-center mb-4">
//         <button
//           onClick={handlePrevMonth}
//           className="p-1 rounded-full hover:bg-gray-100"
//         >
//           <ChevronLeft size={20} />
//         </button>
//         <h4 className="font-bold text-lg">{monthYearString}</h4>
//         <button
//           onClick={handleNextMonth}
//           className="p-1 rounded-full hover:bg-gray-100"
//         >
//           <ChevronRight size={20} />
//         </button>
//       </div>
//       <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
//         {daysOfWeek.map((day) => (
//           <div key={day} className="font-medium text-gray-400">
//             {day}
//           </div>
//         ))}
//         {calendarDays.map((date, i) => {
//           if (!date.isCurrentMonth) {
//             return <div key={i}></div>;
//           }
//           const isSelected =
//             selectedDate.getDate() === date.day &&
//             selectedDate.getMonth() === currentMonth &&
//             selectedDate.getFullYear() === currentYear;
//           const isDisabled = isDateDisabled(date.day);
//           return (
//             <div
//               key={i}
//               onClick={() =>
//                 !isDisabled &&
//                 onDateChange(new Date(currentYear, currentMonth, date.day))
//               }
//               className={`flex items-center justify-center w-9 h-9 mx-auto rounded-full cursor-pointer ${
//                 isDisabled
//                   ? 'text-gray-300 cursor-not-allowed'
//                   : isSelected
//                     ? 'bg-[#37AFA2] text-white'
//                     : 'hover:bg-gray-100'
//               }`}
//             >
//               {date.day}
//             </div>
//           );
//         })}
//       </div>
//     </div>
//   );
// };

// export default Calendar;

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
  disabled?: (date: Date) => boolean; // optional custom disable rule
}

const Calendar = ({ selectedDate, onDateChange, disabled }: CalendarProps) => {
  const [currentMonth, setCurrentMonth] = useState(selectedDate.getMonth());
  const [currentYear, setCurrentYear] = useState(selectedDate.getFullYear());
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (day: number) => {
    const date = new Date(currentYear, currentMonth, day);
    date.setHours(0, 0, 0, 0);

    // ✅ use custom rule if provided, else just block past days
    if (disabled) {
      return disabled(date);
    }
    return date < today;
  };

  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const calendarDays = [];

    for (let i = 0; i < firstDay; i++) {
      calendarDays.push({ day: null, isCurrentMonth: false });
    }

    for (let day = 1; day <= daysInMonth; day++) {
      calendarDays.push({ day, isCurrentMonth: true });
    }

    return calendarDays;
  };

  const calendarDays = generateCalendarDays();
  const monthYearString = new Date(currentYear, currentMonth).toLocaleString(
    'default',
    { month: 'long', year: 'numeric' }
  );

  return (
    <div className="w-full text-gray-700">
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={handlePrevMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronLeft size={18} />
        </button>
        <h4 className="font-bold text-base">{monthYearString}</h4>
        <button
          onClick={handleNextMonth}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <ChevronRight size={18} />
        </button>
      </div>
      <div className="grid grid-cols-7 gap-y-2 text-center text-sm">
        {daysOfWeek.map((day) => (
          <div key={day} className="font-medium text-gray-400">
            {day}
          </div>
        ))}
        {calendarDays.map((date, i) => {
          if (!date.isCurrentMonth) {
            return <div key={i}></div>;
          }

          const isSelected =
            selectedDate.getDate() === date.day &&
            selectedDate.getMonth() === currentMonth &&
            selectedDate.getFullYear() === currentYear;

          const isDisabled = isDateDisabled(date.day!);

          return (
            <div
              key={i}
              onClick={() =>
                !isDisabled &&
                onDateChange(new Date(currentYear, currentMonth, date.day!))
              }
              className={`flex items-center justify-center w-9 h-9 mx-auto rounded-full cursor-pointer ${
                isDisabled
                  ? 'text-gray-300 cursor-not-allowed'
                  : isSelected
                  ? 'bg-[#37AFA2] text-white'
                  : 'hover:bg-gray-100'
              }`}
            >
              {date.day}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
