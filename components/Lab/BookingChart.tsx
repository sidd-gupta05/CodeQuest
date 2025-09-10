// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import Calendar from '@/components/calendar';

// type Booking = {
//   bookingId: string;
//   date: string;
//   totalAmount: number;
//   status: string;
// };

// interface BookingChartProps {
//   bookings: Booking[];
// }

// const BookingChart: React.FC<BookingChartProps> = ({ bookings }) => {
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());

//   // ✅ Group bookings by month
//   const monthlyData = useMemo(() => {
//     const grouped: Record<string, number> = {};
//     bookings.forEach((b) => {
//       const d = new Date(b.date);
//       const key = d.toLocaleString("default", { month: "short" });
//       grouped[key] = (grouped[key] || 0) + 1;
//     });

//     return Object.entries(grouped).map(([month, count]) => ({
//       month,
//       appointments: count,
//     }));
//   }, [bookings]);

//   // ✅ Filtered data for selected month
//   const filteredData = useMemo(() => {
//     const month = selectedDate.toLocaleString("default", { month: "short" });
//     return monthlyData.filter((d) => d.month === month);
//   }, [monthlyData, selectedDate]);

//   // ✅ Mark booked dates in calendar
//   const bookedDates = useMemo(
//     () => bookings.map((b) => new Date(b.date).toDateString()),
//     [bookings]
//   );

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Chart */}
//       <div className="bg-white shadow rounded-lg p-4">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-base font-semibold">Lab Appointments</h2>
//           <span className="text-sm text-gray-500">
//             {selectedDate.toLocaleString("default", {
//               month: "long",
//               year: "numeric",
//             })}
//           </span>
//         </div>
//         <ResponsiveContainer width="100%" height={250}>
//           <BarChart data={filteredData.length ? filteredData : monthlyData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="month" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="appointments" fill="#37AFA2" radius={[6, 6, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Calendar */}
//       <div className="bg-white shadow rounded-lg p-4">
//         <Calendar
//           selectedDate={selectedDate}
//           onDateChange={setSelectedDate}
//           disabled={(date) => !bookedDates.includes(date.toDateString())} // only enable booked dates
//         />
//       </div>
//     </div>
//   );
// };

// export default BookingChart;

// "use client";

// import React, { useMemo, useState } from "react";
// import {
//   BarChart,
//   Bar,
//   XAxis,
//   YAxis,
//   Tooltip,
//   ResponsiveContainer,
//   CartesianGrid,
// } from "recharts";
// import Calendar from "@/components/calendar";
// import { ChevronLeftCircle, SkipBack } from "lucide-react";

// type Booking = {
//   bookingId: string;
//   date: string;
//   totalAmount: number;
//   status: string;
// };

// interface BookingChartProps {
//   bookings: Booking[];
// }

// const BookingChart: React.FC<BookingChartProps> = ({ bookings }) => {
//   const [selectedDate, setSelectedDate] = useState<Date>(new Date());
//   const [zoomedDate, setZoomedDate] = useState<Date | null>(null); // track zoomed day

//   const months = useMemo(
//     () =>
//       [
//         "Jan", "Feb", "Mar", "Apr", "May", "Jun",
//         "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
//       ],
//     []
//   );

//   // Group bookings by month and day
//   const monthlyAndDailyData = useMemo(() => {
//     const byMonth: Record<string, Record<string, Booking[]>> = {};
//     bookings.forEach((b) => {
//       const date = new Date(b.date);
//       const monthKey = date.toLocaleString("default", { month: "short" });
//       const dayKey = date.toDateString();

//       if (!byMonth[monthKey]) byMonth[monthKey] = {};
//       if (!byMonth[monthKey][dayKey]) byMonth[monthKey][dayKey] = [];
//       byMonth[monthKey][dayKey].push(b);
//     });
//     return byMonth;
//   }, [bookings]);

//   const bookedDates = useMemo(
//     () => bookings.map((b) => new Date(b.date).toDateString()),
//     [bookings]
//   );

//   // Prepare chart data
//   const chartData = useMemo(() => {
//     if (zoomedDate) {
//       // Zoom into the selected date -> appointments per hour
//       const dayKey = zoomedDate.toDateString();
//       const monthKey = zoomedDate.toLocaleString("default", { month: "short" });
//       const daysInMonth = monthlyAndDailyData[monthKey] || {};

//       if (daysInMonth[dayKey]) {
//         const perHour: Record<string, number> = {};
//         daysInMonth[dayKey].forEach((b) => {
//           const hour = new Date(b.date).getHours();
//           perHour[`${hour}:00`] = (perHour[`${hour}:00`] || 0) + 1;
//         });

//         return Object.entries(perHour).map(([hour, count]) => ({
//           label: hour,
//           appointments: count,
//         }));
//       }
//     }

//     // Default yearly/monthly view: all months
//     return months.map((month) => ({
//       label: month,
//       appointments: Object.keys(monthlyAndDailyData[month] || {}).length
//         ? Object.values(monthlyAndDailyData[month]).reduce(
//             (sum, arr) => sum + arr.length,
//             0
//           )
//         : 0,
//     }));
//   }, [zoomedDate, monthlyAndDailyData, months]);

//   // Handle date click
//   const handleDateClick = (date: Date) => {
//     setSelectedDate(date);
//     setZoomedDate(date);
//   };

//   // Switch back to yearly/monthly view
//   const handleBackToYearly = () => {
//     setZoomedDate(null);
//   };

//   return (
//     <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//       {/* Chart */}
//       <div className="bg-white shadow rounded-lg p-4 relative">
//         <div className="flex items-center justify-between mb-3">
//           <h2 className="text-base font-semibold">
//             Lab Appointments
//           </h2>
//           <div className="flex items-center gap-2">
//             {zoomedDate && (
//               <button
//                 onClick={handleBackToYearly}
//                 className="text-sm px-2 flex items-center py-1 bg-gray-200 rounded hover:bg-gray-300"
//               >
//                 <ChevronLeftCircle className="w-4 h-4 mr-1" /> Back
//               </button>
//             )}
//             <span className="text-sm text-gray-500">
//               {zoomedDate
//                 ? zoomedDate.toDateString()
//                 : selectedDate?.toLocaleString("default", {
//                     month: "long",
//                     year: "numeric",
//                   })}
//             </span>
//           </div>
//         </div>
//         <ResponsiveContainer width="100%" height={300}>
//           <BarChart data={chartData}>
//             <CartesianGrid strokeDasharray="3 3" />
//             <XAxis dataKey="label" />
//             <YAxis />
//             <Tooltip />
//             <Bar dataKey="appointments" fill="#37AFA2" radius={[6, 6, 0, 0]} />
//           </BarChart>
//         </ResponsiveContainer>
//       </div>

//       {/* Calendar */}
//       <div className="bg-white shadow rounded-lg p-4">
//         <Calendar
//           selectedDate={selectedDate}
//           onDateChange={handleDateClick}
//           disabled={(date) => !bookedDates.includes(date.toDateString())}
//         />
//       </div>
//     </div>
//   );
// };

// export default BookingChart;

//components/Lab/BookingChart.tsx
'use client';

import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import Calendar from '@/components/calendar';
import { ChevronLeftCircle } from 'lucide-react';

type Booking = {
  bookingId: string;
  date: string;
  totalAmount: number;
  status: string;
};

interface BookingChartProps {
  bookings: Booking[];
  onDateSelect: (date: Date | null) => void; // Add callback prop
}

const BookingChart: React.FC<BookingChartProps> = ({
  bookings,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [zoomedDate, setZoomedDate] = useState<Date | null>(null);

  const months = useMemo(
    () => [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ],
    []
  );

  // Group bookings by month and day
  const monthlyAndDailyData = useMemo(() => {
    const byMonth: Record<string, Record<string, Booking[]>> = {};

    // Initialize all months with empty data
    months.forEach((month) => {
      byMonth[month] = {};
    });

    bookings.forEach((b) => {
      const date = new Date(b.date);
      const monthKey = date.toLocaleString('default', { month: 'short' });
      const dayKey = date.toDateString();

      if (!byMonth[monthKey]) byMonth[monthKey] = {};
      if (!byMonth[monthKey][dayKey]) byMonth[monthKey][dayKey] = [];
      byMonth[monthKey][dayKey].push(b);
    });
    return byMonth;
  }, [bookings, months]);

  const bookedDates = useMemo(
    () => bookings.map((b) => new Date(b.date).toDateString()),
    [bookings]
  );

  // Prepare chart data
  const chartData = useMemo(() => {
    if (zoomedDate) {
      // Zoom into the selected date -> appointments per hour
      const dayKey = zoomedDate.toDateString();
      const monthKey = zoomedDate.toLocaleString('default', { month: 'short' });
      const daysInMonth = monthlyAndDailyData[monthKey] || {};

      if (daysInMonth[dayKey]) {
        const perHour: Record<string, number> = {};
        daysInMonth[dayKey].forEach((b) => {
          const hour = new Date(b.date).getHours();
          const hourLabel = `${hour}:00`;
          perHour[hourLabel] = (perHour[hourLabel] || 0) + 1;
        });

        // Convert to array and sort by hour
        return Object.entries(perHour)
          .map(([hour, count]) => ({
            label: hour,
            appointments: count,
          }))
          .sort((a, b) => {
            const aHour = parseInt(a.label.split(':')[0]);
            const bHour = parseInt(b.label.split(':')[0]);
            return aHour - bHour;
          });
      }
      return [];
    }

    // Default yearly/monthly view: all months
    return months.map((month) => {
      const monthData = monthlyAndDailyData[month] || {};
      return {
        label: month,
        appointments: Object.keys(monthData).length
          ? Object.values(monthData).reduce((sum, arr) => sum + arr.length, 0)
          : 0,
      };
    });
  }, [zoomedDate, monthlyAndDailyData, months]);

  // Handle date click
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);

    // Check if the date has bookings
    const dateKey = date.toDateString();
    const hasBookings = bookedDates.includes(dateKey);

    if (hasBookings) {
      setZoomedDate(date);
      onDateSelect(date); // Notify parent component
    } else {
      onDateSelect(null); // Notify parent component
    }
  };

  // Switch back to yearly/monthly view
  const handleBackToYearly = () => {
    setZoomedDate(null);
    onDateSelect(null); // Notify parent component
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Lab Appointments</h2>
          <div className="flex items-center gap-2">
            {zoomedDate && (
              <button
                onClick={handleBackToYearly}
                className="text-sm px-2 flex items-center py-1 bg-gray-200 rounded hover:bg-gray-300"
              >
                <ChevronLeftCircle className="w-4 h-4 mr-1" /> Back
              </button>
            )}
            <span className="text-sm text-gray-500">
              {zoomedDate
                ? zoomedDate.toLocaleDateString('en-US', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })
                : selectedDate.toLocaleString('default', {
                    month: 'long',
                    year: 'numeric',
                  })}
            </span>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" tick={{ fontSize: 12 }} />
            <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="appointments" fill="#37AFA2" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Calendar */}
      <div className="bg-white shadow rounded-lg p-4">
        <Calendar
          selectedDate={selectedDate}
          onDateChange={handleDateClick}
          disabled={(date) => !bookedDates.includes(date.toDateString())}
        />
      </div>
    </div>
  );
};

export default BookingChart;
