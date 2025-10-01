'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  Download,
  Filter,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  IndianRupee,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';
import SalesHeader from '@/components/Lab/revenue/SalesHeader';
import SalesMetrics from '@/components/Lab/revenue/SalesMetrics';
import SalesCharts from '@/components/Lab/revenue/SalesCharts';
import SalesTables from '@/components/Lab/revenue/SalesTables';
import SalesInsights from '@/components/Lab/revenue/SalesInsights';
import {
  Booking,
  Employee,
  MonthlyFinancials,
  SortConfig,
} from '@/components/Lab/revenue/types';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Fixed employee data (hardcoded as requested)
const initializeEmployeeData = (): Employee[] => [
  {
    id: 'EMP001',
    name: 'Dr. Sharma',
    role: 'Pathologist',
    monthlySalary: 7500,
    department: 'Lab Operations',
  },
  {
    id: 'EMP002',
    name: 'Priya Patel',
    role: 'Lab Technician',
    monthlySalary: 4500,
    department: 'Lab Operations',
  },
  {
    id: 'EMP003',
    name: 'Rahul Kumar',
    role: 'Lab Technician',
    monthlySalary: 4200,
    department: 'Lab Operations',
  },
  {
    id: 'EMP004',
    name: 'Anita Desai',
    role: 'Receptionist',
    monthlySalary: 2800,
    department: 'Administration',
  },
  {
    id: 'EMP005',
    name: 'Sanjay Mehta',
    role: 'Lab Manager',
    monthlySalary: 6800,
    department: 'Management',
  },
];

// Fixed monthly costs (hardcoded as requested)
const getMonthlyFixedCosts = () => {
  const baseEquipmentCost = 1250;
  const baseInventoryCost = 850;
  const variation = Math.random() * 0.3 + 0.85;
  return {
    equipmentCosts: Math.round(baseEquipmentCost * variation),
    inventoryCosts: Math.round(baseInventoryCost * variation),
  };
};

const SalesModule = () => {
  const [timeFilter, setTimeFilter] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false); // New state for download status
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'month',
    direction: 'asc',
  });

  const reportRef = useRef<HTMLDivElement>(null); // Ref for the content to be downloaded
  const computationsRef = useRef<any>({});
  const employeeDataRef = useRef<Employee[]>([]);
  const monthlyDataRef = useRef<MonthlyFinancials[]>([]);

  // Calculate financials from bookings
  const calculateFinancials = (bookingsData: Booking[]) => {
    const months = [
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
    ];

    const monthlyFinancials: MonthlyFinancials[] = months.map(
      (month, index) => {
        const monthBookings = bookingsData.filter((booking) => {
          const bookingDate = new Date(booking.date);
          return (
            bookingDate.getMonth() === index &&
            bookingDate.getFullYear() === selectedYear
          );
        });

        const revenue = monthBookings.reduce(
          (sum, booking) => sum + booking.totalAmount,
          0
        );
        const appointmentCount = monthBookings.length;
        const totalEmployeeCosts = employeeDataRef.current.reduce(
          (sum, emp) => sum + emp.monthlySalary,
          0
        );
        const { equipmentCosts, inventoryCosts } = getMonthlyFixedCosts();
        const operatingCosts = revenue * 0.3;
        const totalCosts =
          totalEmployeeCosts + operatingCosts + equipmentCosts + inventoryCosts;
        const netProfit = revenue - totalCosts;

        return {
          month,
          year: selectedYear,
          revenue: Math.round(revenue),
          operatingCosts: Math.round(operatingCosts),
          employeeCosts: totalEmployeeCosts,
          equipmentCosts,
          inventoryCosts,
          netProfit: Math.round(netProfit),
          appointmentCount,
        };
      }
    );

    monthlyDataRef.current = monthlyFinancials;

    computationsRef.current = {
      totalRevenue: monthlyFinancials.reduce((sum, m) => sum + m.revenue, 0),
      totalNetProfit: monthlyFinancials.reduce(
        (sum, m) => sum + m.netProfit,
        0
      ),
      totalEmployeeCosts: monthlyFinancials.reduce(
        (sum, m) => sum + m.employeeCosts,
        0
      ),
      totalOperatingCosts: monthlyFinancials.reduce(
        (sum, m) => sum + m.operatingCosts,
        0
      ),
      totalEquipmentCosts: monthlyFinancials.reduce(
        (sum, m) => sum + m.equipmentCosts,
        0
      ),
      totalInventoryCosts: monthlyFinancials.reduce(
        (sum, m) => sum + m.inventoryCosts,
        0
      ),
      totalAppointments: monthlyFinancials.reduce(
        (sum, m) => sum + m.appointmentCount,
        0
      ),
    };
  };

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        const mockBookings: Booking[] = Array.from({ length: 250 }, (_, i) => {
          const date = new Date(
            2024,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          );
          const totalAmount =
            Math.round((Math.random() * 3000 + 800) * 100) / 100;

          return {
            id: `booking-${i}`,
            bookingId: `BK${String(i + 1).padStart(4, '0')}`,
            date: date.toISOString(),
            totalAmount,
            status: ['CONFIRMED', 'COMPLETED', 'PENDING'][
              Math.floor(Math.random() * 3)
            ],
            patientId: `patient-${i}`,
            labId: 'lab-1',
          };
        });

        employeeDataRef.current = initializeEmployeeData();
        calculateFinancials(mockBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, [selectedYear]);

  const sortedMonthlyData = useMemo(() => {
    const data = [...monthlyDataRef.current];
    if (sortConfig.key) {
      data.sort((a, b) => {
        if (
          a[sortConfig.key as keyof MonthlyFinancials] <
          b[sortConfig.key as keyof MonthlyFinancials]
        ) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (
          a[sortConfig.key as keyof MonthlyFinancials] >
          b[sortConfig.key as keyof MonthlyFinancials]
        ) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return data;
  }, [sortConfig, monthlyDataRef.current]);

  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  const filteredData = useMemo(() => {
    if (timeFilter === 'yearly') {
      const annualData = monthlyDataRef.current.reduce(
        (acc, month) => ({
          revenue: acc.revenue + month.revenue,
          netProfit: acc.netProfit + month.netProfit,
          employeeCosts: acc.employeeCosts + month.employeeCosts,
          operatingCosts: acc.operatingCosts + month.operatingCosts,
          equipmentCosts: acc.equipmentCosts + month.equipmentCosts,
          inventoryCosts: acc.inventoryCosts + month.inventoryCosts,
          appointmentCount: acc.appointmentCount + month.appointmentCount,
        }),
        {
          revenue: 0,
          netProfit: 0,
          employeeCosts: 0,
          operatingCosts: 0,
          equipmentCosts: 0,
          inventoryCosts: 0,
          appointmentCount: 0,
        }
      );
      return [{
        month: `Year ${selectedYear}`,
        year: selectedYear,
        ...annualData
      }];
    }
    return monthlyDataRef.current;
  }, [timeFilter, selectedYear, monthlyDataRef.current]);

  const exportToPDF = async () => {
    setIsDownloading(true);
    const input = reportRef.current;

    if (!input) {
      console.error('Report content not found');
      setIsDownloading(false);
      return;
    }

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

      let position = 0;
      let heightLeft = pdfHeight;

      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pdf.internal.pageSize.getHeight();

      while (heightLeft >= 0) {
        position = heightLeft - pdfHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
        heightLeft -= pdf.internal.pageSize.getHeight();
      }

      pdf.save(`Sales_Report_${selectedYear}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate PDF report.');
    } finally {
      setIsDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6 sm:p-8 lg:p-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sales Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive financial overview based on appointment data
        </p>
      </div>

      <SalesHeader
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        exportToPDF={exportToPDF}
        isDownloading={isDownloading}
      />

      {/* This div is what will be captured for the PDF. It excludes the header. */}
      <div ref={reportRef}>
        <SalesMetrics computations={computationsRef.current} />
        <SalesCharts
          timeFilter={timeFilter}
          filteredData={filteredData}
          computations={computationsRef.current}
        />
        <SalesTables
          sortedMonthlyData={sortedMonthlyData}
          employeeData={employeeDataRef.current}
          sortConfig={sortConfig}
          handleSort={handleSort}
        />
        <SalesInsights
          computations={computationsRef.current}
          employeeData={employeeDataRef.current}
        />
      </div>
    </div>
  );
};

export default SalesModule;
