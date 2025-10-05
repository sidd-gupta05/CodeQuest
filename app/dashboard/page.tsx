/* eslint-disable @typescript-eslint/no-explicit-any */
// // app/dashboard/page.tsx
// 'use client';

// import { useContext, useState } from 'react';
// import { LabContext } from '../context/LabContext';
// import BookingChart from '@/components/Lab/BookingChart';
// import PaginatedBookingList from '@/components/Lab/PaginatedBookingList';

// export default function DashboardPage() {
//   const [selectedDate, setSelectedDate] = useState<Date | null>(null);

//   const contextData = useContext(LabContext);
//   const bookingData = contextData?.bookingData || [];
//   const userData = contextData?.userData || {};

//   const handleDateSelect = (date: Date | null) => {
//     setSelectedDate(date);
//   };

//   return (
//     <div className="p-4 md:p-8">
//       <h2 className="text-xl font-semibold">Hey, {userData.firstName} 👋</h2>

//       <div>
//         <div className="my-6">
//           <BookingChart
//             bookings={bookingData}
//             onDateSelect={handleDateSelect}
//           />
//         </div>
//         <div className="mt-6">
//           <PaginatedBookingList
//             bookings={bookingData}
//             selectedDate={selectedDate}
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

'use client';

import { useContext, useEffect, useState } from 'react';
import { LabContext } from '../context/LabContext';
import BookingChart from '@/components/Lab/BookingChart';
import PaginatedBookingList from '@/components/Lab/PaginatedBookingList';

export default function DashboardPage() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const contextData = useContext(LabContext);

  // ✅ Properly typed states
  const [bookingData, setBookingData] = useState<any[]>(contextData?.bookingData || []);
  const [labData, _] = useState<{ labName?: string }>(contextData?.labData || {});
  const userData = contextData?.userData || {};

  const employees =
    (contextData?.employeeData || []).filter(
      (emp) => emp.isFieldCollector === true
    );

  // Log employees to verify data
  console.log('Employees Data:', employees);


  // ✅ Example merging logic inside useEffect (only after context updates)
  useEffect(() => {
    if (contextData?.bookingData && contextData?.labData?.labName) {
      const merged = contextData.bookingData.map((b: any) => ({
        ...b,
        labName: contextData.labData.labName,
      }));
      setBookingData(merged);
    }
  }, [contextData?.bookingData, contextData?.labData]);

  console.log('Lab Data in DashboardPage:', labData);

  const handleDateSelect = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleYearChange = (year: number) => {
    setSelectedYear(year);
    setSelectedDate(null); // reset selected date when year changes
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-xl font-semibold">Hey, {userData.firstName} 👋</h2>

      <div className="my-6">
        <BookingChart
          bookings={bookingData}
          selectedYear={selectedYear}
          onYearChange={handleYearChange}
          onDateSelect={handleDateSelect}
        />
      </div>

      <div className="mt-6">
        <PaginatedBookingList
          bookings={bookingData}
          employees={employees}
          selectedDate={selectedDate}
          selectedYear={selectedYear}
        />
      </div>
    </div>
  );
}
