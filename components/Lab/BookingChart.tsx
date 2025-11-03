//components/Lab/BookingChart.tsx
'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  ChevronLeftCircle,
  ChevronUp,
  ChevronDown,
  ChevronLast,
  ChevronLeft,
} from 'lucide-react';
import LabCalendar from '../labcalender';

export type Booking = {
  bookingId: string;
  date: string;
  totalAmount: number;
  status: string;
};

interface BookingChartProps {
  bookings: Booking[];
  selectedYear: number;
  onYearChange: (year: number) => void;
  onDateSelect: (date: Date | null) => void;
}

const BookingChart: React.FC<BookingChartProps> = ({
  bookings,
  selectedYear,
  onYearChange,
  onDateSelect,
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [zoomedDate, setZoomedDate] = useState<Date | null>(null);
  const [yearDropdownOpen, setYearDropdownOpen] = useState(false);

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

  const years = useMemo(() => {
    const allYears = bookings.map((b) => new Date(b.date).getFullYear());
    return Array.from(new Set(allYears)).sort((a, b) => b - a);
  }, [bookings]);

  // Bookings grouped by month/day
  const monthlyAndDailyData = useMemo(() => {
    const byMonth: Record<string, Record<string, Booking[]>> = {};

    // Initialize all months first with empty objects
    months.forEach((m) => {
      byMonth[m] = {};
    });

    bookings.forEach((b) => {
      const date = new Date(b.date);
      if (date.getFullYear() !== selectedYear) return;

      // Get month in short format (Jan, Feb, etc.)
      const monthKey = date.toLocaleString('en-US', { month: 'short' });
      const dayKey = date.toDateString();

      // Ensure the month key exists in our byMonth object
      if (!byMonth[monthKey]) {
        // If it doesn't exist, create it (this handles any locale issues)
        byMonth[monthKey] = {};
      }

      if (!byMonth[monthKey][dayKey]) {
        byMonth[monthKey][dayKey] = [];
      }
      byMonth[monthKey][dayKey].push(b);
    });

    return byMonth;
  }, [bookings, months, selectedYear]);

  const bookedDates = useMemo(
    () =>
      bookings
        .filter((b) => new Date(b.date).getFullYear() === selectedYear)
        .map((b) => new Date(b.date).toDateString()),
    [bookings, selectedYear]
  );

  // Chart data: monthly or hourly if zoomed
  const chartData = useMemo(() => {
    if (zoomedDate) {
      const dayKey = zoomedDate.toDateString();
      const monthKey = zoomedDate.toLocaleString('en-US', { month: 'short' });
      const daysInMonth = monthlyAndDailyData[monthKey] || {};
      if (daysInMonth[dayKey]) {
        const perHour: Record<string, number> = {};
        daysInMonth[dayKey].forEach((b) => {
          const hour = new Date(b.date).getHours();
          const hourLabel = `${hour}:00`;
          perHour[hourLabel] = (perHour[hourLabel] || 0) + 1;
        });
        return Object.entries(perHour)
          .map(([label, appointments]) => ({ label, appointments }))
          .sort((a, b) => parseInt(a.label) - parseInt(b.label));
      }
      return [];
    }

    // Return monthly data - ensure all months are included even if they have 0 appointments
    return months.map((month) => {
      const monthData = monthlyAndDailyData[month] || {};
      const appointmentsCount = Object.values(monthData).reduce(
        (sum, arr) => sum + arr.length,
        0
      );

      return {
        label: month,
        appointments: appointmentsCount,
      };
    });
  }, [zoomedDate, monthlyAndDailyData, months]);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const dateKey = date.toDateString();
    if (bookedDates.includes(dateKey)) {
      setZoomedDate(date);
      onDateSelect(date);
    } else {
      setZoomedDate(null);
      onDateSelect(null);
    }
  };

  const handleBackToYearly = () => {
    setZoomedDate(null);
    onDateSelect(null);
  };

  const yearListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (yearListRef.current) {
      const selectedEl = yearListRef.current.querySelector(
        `div[data-year='${selectedYear}']`
      );
      if (selectedEl)
        (selectedEl as HTMLDivElement).scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
    }
  }, [yearDropdownOpen, selectedYear]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Chart */}
      <div className="bg-white shadow rounded-lg p-4 relative">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Lab Appointments</h2>
          <div className="relative">
            {!zoomedDate && (
              <div>
                <button
                  onClick={() => setYearDropdownOpen(!yearDropdownOpen)}
                  className="border rounded py-1 px-3 text-sm w-24 text-left bg-white flex justify-between items-center"
                >
                  {selectedYear}
                  {yearDropdownOpen ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>
                {yearDropdownOpen && (
                  <div
                    ref={yearListRef}
                    className="absolute mt-1 max-h-48 w-24 overflow-y-auto border rounded shadow bg-white z-10"
                  >
                    {years.map((year) => (
                      <div
                        key={year}
                        data-year={year}
                        onClick={() => {
                          onYearChange(year);
                          setYearDropdownOpen(false);
                          setSelectedDate(() => {
                            // pick first booked date in this year if exists, else default to Jan 1
                            const firstBooking = bookings.find(
                              (b) => new Date(b.date).getFullYear() === year
                            );
                            if (firstBooking)
                              return new Date(firstBooking.date);
                            return new Date(year, 0, 1); // Jan 1
                          });
                        }}
                        className={`cursor-pointer px-3 py-1 text-sm hover:bg-indigo-100 ${year === selectedYear ? 'bg-indigo-200 font-medium' : ''}`}
                      >
                        {year}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            {zoomedDate && (
              <div className="flex items-center gap-3">
                <button
                  onClick={handleBackToYearly}
                  className="text-sm px-2 flex items-center py-1 border cursor-pointer rounded hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Monthly
                </button>
                <div>
                  <span className="text-sm">
                    {zoomedDate.toLocaleDateString('en-US', {
                      weekday: 'short',
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </div>
            )}
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

      <div className="bg-white shadow rounded-lg p-4">
        <LabCalendar // made another calendar component specifically for lab dashboard
          selectedDate={selectedDate}
          onDateChange={handleDateClick}
          disabled={(date) =>
            date.getFullYear() !== selectedYear ||
            !bookedDates.includes(date.toDateString())
          }
          month={selectedDate.getMonth()}
          year={selectedDate.getFullYear()}
        />
      </div>
    </div>
  );
};

export default BookingChart;
