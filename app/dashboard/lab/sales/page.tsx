//app/dashboard/lab/sales/page.tsx
'use client';

import React, { useState, useRef, useMemo, useEffect, useContext } from 'react';
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
import { exportToPDF } from '@/components/Lab/revenue/PDFExportComponent';
import { LabContext } from '@/app/context/LabContext';
import { supabase } from '@/utils/supabase/client';

// Fixed monthly costs (hardcoded)
const getMonthlyFixedCosts = () => {
  const baseEquipmentCost = 10;
  const baseInventoryCost = 5;
  const variation = Math.random() * 0.3 + 0.85;
  return {
    equipmentCosts: Math.round(baseEquipmentCost * variation),
    inventoryCosts: Math.round(baseInventoryCost * variation),
  };
};

const SalesModule = () => {
  const currentYear = new Date().getFullYear();

  const [timeFilter, setTimeFilter] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(currentYear);
  const [loading, setLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [sortConfig, setSortConfig] = useState<SortConfig>({
    key: 'month',
    direction: 'asc',
  });
  const [labNablCertificate, setLabNablCertificate] = useState<string>('');

  const allbookings = useContext(LabContext)?.bookingData || [];
  const employee = useContext(LabContext)?.employeeData || [];
  const labId = useContext(LabContext)?.labId || '';

  const reportRef = useRef<HTMLDivElement>(null);
  const computationsRef = useRef<any>({});
  const monthlyDataRef = useRef<MonthlyFinancials[]>([]);

  useEffect(() => {
    const fetchLabNablCertificate = async () => {
      if (!labId) return;

      try {
        const { data: labData, error } = await supabase
          .from('labs')
          .select('nablCertificateNumber')
          .eq('id', labId)
          .single();

        if (error) {
          console.error('Error fetching lab NABL certificate:', error);
          return;
        }

        if (labData && labData.nablCertificateNumber) {
          setLabNablCertificate(labData.nablCertificateNumber);
        } else {
          console.warn('No NABL certificate found for lab:', labId);
        }
      } catch (error) {
        console.error('Error fetching lab data:', error);
      }
    };

    fetchLabNablCertificate();
  }, [labId]);

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
          const bookingYear = bookingDate.getFullYear();
          const bookingMonth = bookingDate.getMonth();

          return bookingMonth === index && bookingYear === selectedYear;
        });

        const revenue = monthBookings.reduce(
          (sum, booking) => sum + booking.totalAmount,
          0
        );
        const appointmentCount = monthBookings.length;

        const totalEmployeeCosts = employee.reduce((sum, emp) => {
          const joinDate = new Date(emp.createdAt);
          const joinYear = joinDate.getFullYear();
          const joinMonth = joinDate.getMonth();

          if (
            joinYear < selectedYear ||
            (joinYear === selectedYear && joinMonth <= index)
          ) {
            return sum + emp.monthlySalary;
          }
          return sum;
        }, 0);

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
    setLoading(true);
    try {
      if (allbookings.length > 0) {
        calculateFinancials(allbookings);
      } else {
        console.warn('No booking data available in LabContext');
        calculateFinancials([]);
      }
    } catch (error) {
      console.error('Error processing bookings:', error);
    } finally {
      setLoading(false);
    }
  }, [allbookings.length, selectedYear, employee]);

  const monthOrder = [
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

  const sortedMonthlyData = useMemo(() => {
    const data = [...monthlyDataRef.current];
    if (sortConfig.key) {
      data.sort((a, b) => {
        const aValue = a[sortConfig.key as keyof MonthlyFinancials];
        const bValue = b[sortConfig.key as keyof MonthlyFinancials];

        // Custom sorting for month
        if (sortConfig.key === 'month') {
          return (
            (monthOrder.indexOf(aValue as string) -
              monthOrder.indexOf(bValue as string)) *
            (sortConfig.direction === 'asc' ? 1 : -1)
          );
        }

        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
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
      return [
        {
          month: `Year ${selectedYear}`,
          year: selectedYear,
          ...annualData,
        },
      ];
    }
    return monthlyDataRef.current;
  }, [timeFilter, selectedYear, monthlyDataRef.current]);

  // In your page.tsx, update the handleExportToPDF function:
  const handleExportToPDF = async () => {
    const pdfData = {
      computations: computationsRef.current,
      filteredData,
      employee,
      selectedYear,
      timeFilter,
    };

    await exportToPDF(labNablCertificate, pdfData, setIsDownloading);
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
        <h1 className="text-xl font-semibold text-gray-900 mb-2">
          Sales Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive financial overview based on appointment data
        </p>
      </div>

      <SalesHeader
        selectedYear={selectedYear}
        setSelectedYear={setSelectedYear}
        exportToPDF={handleExportToPDF}
        isDownloading={isDownloading}
        bookingData={allbookings}
        labNablCertificate={labNablCertificate}
      />

      <div ref={reportRef}>
        <SalesMetrics computations={computationsRef.current} />
        <SalesCharts
          timeFilter={timeFilter}
          setTimeFilter={setTimeFilter}
          filteredData={filteredData}
          computations={computationsRef.current}
        />
        <SalesTables
          sortedMonthlyData={sortedMonthlyData}
          employeeData={employee}
          sortConfig={sortConfig}
          handleSort={handleSort}
        />
        <SalesInsights
          computations={computationsRef.current}
          employeeData={employee}
        />
      </div>
    </div>
  );
};

export default SalesModule;
