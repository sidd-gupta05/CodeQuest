// app/dashboard/lab/sales/page.tsx
'use client';

import React, { useState, useRef, useMemo, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
} from 'recharts';
import {
  Download,
  Filter,
  Calendar,
  Users,
  Package,
  DollarSign,
  TrendingUp,
  TrendingDown,
  IndianRupee,
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Building,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  Wallet,
} from 'lucide-react';

// Types based on your Prisma schema
type Booking = {
  id: string;
  bookingId: string;
  date: string;
  totalAmount: number;
  status: string;
  patientId: string;
  labId: string;
};

type Employee = {
  id: string;
  name: string;
  role: string;
  monthlySalary: number;
  department: string;
};

type MonthlyFinancials = {
  month: string;
  year: number;
  revenue: number;
  operatingCosts: number;
  employeeCosts: number;
  equipmentCosts: number;
  inventoryCosts: number;
  netProfit: number;
  appointmentCount: number;
};

const SalesModule = () => {
  // State
  const [timeFilter, setTimeFilter] = useState<'monthly' | 'yearly'>('monthly');
  const [selectedYear, setSelectedYear] = useState<number>(2024);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'asc' | 'desc';
  }>({
    key: 'month',
    direction: 'asc',
  });

  // Refs for persistent data
  const computationsRef = useRef<any>({});
  const employeeDataRef = useRef<Employee[]>([]);
  const monthlyDataRef = useRef<MonthlyFinancials[]>([]);

  // Fixed employee data (hardcoded as requested)
  const initializeEmployeeData = () => {
    employeeDataRef.current = [
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
  };

  // Fixed monthly costs (hardcoded as requested)
  const getMonthlyFixedCosts = (month: string, year: number) => {
    const baseEquipmentCost = 1250;
    const baseInventoryCost = 850;

    // Add some variation to make it realistic
    const variation = Math.random() * 0.3 + 0.85; // 85% to 115% variation

    return {
      equipmentCosts: Math.round(baseEquipmentCost * variation),
      inventoryCosts: Math.round(baseInventoryCost * variation),
    };
  };

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
        // Filter bookings for this month and year
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

        // Calculate costs
        const totalEmployeeCosts = employeeDataRef.current.reduce(
          (sum, emp) => sum + emp.monthlySalary,
          0
        );
        const { equipmentCosts, inventoryCosts } = getMonthlyFixedCosts(
          month,
          selectedYear
        );

        // Operating costs (30% of revenue for lab consumables, utilities, etc.)
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

    // Store computations
    computationsRef.current = {
      totalRevenue: monthlyFinancials.reduce(
        (sum, month) => sum + month.revenue,
        0
      ),
      totalNetProfit: monthlyFinancials.reduce(
        (sum, month) => sum + month.netProfit,
        0
      ),
      totalEmployeeCosts: monthlyFinancials.reduce(
        (sum, month) => sum + month.employeeCosts,
        0
      ),
      totalOperatingCosts: monthlyFinancials.reduce(
        (sum, month) => sum + month.operatingCosts,
        0
      ),
      totalEquipmentCosts: monthlyFinancials.reduce(
        (sum, month) => sum + month.equipmentCosts,
        0
      ),
      totalInventoryCosts: monthlyFinancials.reduce(
        (sum, month) => sum + month.inventoryCosts,
        0
      ),
      totalAppointments: monthlyFinancials.reduce(
        (sum, month) => sum + month.appointmentCount,
        0
      ),
    };
  };

  // Fetch bookings data (simulated)
  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
        // Simulate API call with more realistic data
        const mockBookings: Booking[] = Array.from({ length: 250 }, (_, i) => {
          const date = new Date(
            2024,
            Math.floor(Math.random() * 12),
            Math.floor(Math.random() * 28) + 1
          );
          const totalAmount =
            Math.round((Math.random() * 3000 + 800) * 100) / 100; // 800 to 3800

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

        setBookings(mockBookings);
        initializeEmployeeData();
        calculateFinancials(mockBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [selectedYear]);

  // Sort monthly data
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

  // Handle sort
  const handleSort = (key: string) => {
    setSortConfig({
      key,
      direction:
        sortConfig.key === key && sortConfig.direction === 'asc'
          ? 'desc'
          : 'asc',
    });
  };

  // Filtered data based on time filter
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
          ...annualData,
        },
      ];
    }
    return monthlyDataRef.current;
  }, [timeFilter, selectedYear, monthlyDataRef.current]);

  // Expense breakdown for pie chart
  const expenseBreakdown = useMemo(() => {
    const totalExpenses =
      computationsRef.current.totalOperatingCosts +
      computationsRef.current.totalEmployeeCosts +
      computationsRef.current.totalEquipmentCosts +
      computationsRef.current.totalInventoryCosts;

    return [
      {
        name: 'Employee Salaries',
        value: computationsRef.current.totalEmployeeCosts,
        percentage: Math.round(
          (computationsRef.current.totalEmployeeCosts / totalExpenses) * 100
        ),
      },
      {
        name: 'Operating Costs',
        value: computationsRef.current.totalOperatingCosts,
        percentage: Math.round(
          (computationsRef.current.totalOperatingCosts / totalExpenses) * 100
        ),
      },
      {
        name: 'Equipment',
        value: computationsRef.current.totalEquipmentCosts,
        percentage: Math.round(
          (computationsRef.current.totalEquipmentCosts / totalExpenses) * 100
        ),
      },
      {
        name: 'Inventory',
        value: computationsRef.current.totalInventoryCosts,
        percentage: Math.round(
          (computationsRef.current.totalInventoryCosts / totalExpenses) * 100
        ),
      },
    ];
  }, [computationsRef.current]);

  // Department breakdown
  const departmentBreakdown = useMemo(() => {
    const departments: {
      [key: string]: { totalSalary: number; employeeCount: number };
    } = {};

    employeeDataRef.current.forEach((employee) => {
      if (!departments[employee.department]) {
        departments[employee.department] = { totalSalary: 0, employeeCount: 0 };
      }
      departments[employee.department].totalSalary += employee.monthlySalary;
      departments[employee.department].employeeCount += 1;
    });

    return Object.entries(departments).map(([name, data]) => ({
      name,
      totalSalary: data.totalSalary,
      employeeCount: data.employeeCount,
      annualSalary: data.totalSalary * 12,
    }));
  }, []);

  const COLORS = [
    '#0088FE',
    '#00C49F',
    '#FFBB28',
    '#FF8042',
    '#8884D8',
    '#82CA9D',
  ];

  // Performance metrics
  const performanceMetrics = useMemo(() => {
    const totalRevenue = computationsRef.current.totalRevenue || 1;
    const totalNetProfit = computationsRef.current.totalNetProfit || 0;
    const totalCosts =
      computationsRef.current.totalEmployeeCosts +
        computationsRef.current.totalOperatingCosts +
        computationsRef.current.totalEquipmentCosts +
        computationsRef.current.totalInventoryCosts || 1;

    return {
      profitMargin: Math.round((totalNetProfit / totalRevenue) * 100),
      roi: Math.round((totalNetProfit / totalCosts) * 100),
    };
  }, [computationsRef.current]);

  // Export to PDF function
  const exportToPDF = () => {
    console.log('Exporting data to PDF...');
    alert(
      'PDF export functionality would be implemented here with a library like jsPDF'
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading sales data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Sales Dashboard
        </h1>
        <p className="text-gray-600">
          Comprehensive financial overview based on appointment data
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">View:</span>
            </div>
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setTimeFilter('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeFilter === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setTimeFilter('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  timeFilter === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Yearly
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {[2022, 2023, 2024].map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <button
              onClick={exportToPDF}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Download className="w-4 h-4" />
              Export PDF
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                <IndianRupee className="inline w-4 h-4 mr-1" />
                {(computationsRef.current.totalRevenue || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="w-6 h-6 text-green-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
            <span className="text-sm text-green-600">
              From{' '}
              {(
                computationsRef.current.totalAppointments || 0
              ).toLocaleString()}{' '}
              appointments
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Net Profit</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                <IndianRupee className="inline w-4 h-4 mr-1" />
                {(computationsRef.current.totalNetProfit || 0).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <TrendingUp className="w-6 h-6 text-blue-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">
              {performanceMetrics.profitMargin}% profit margin
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Appointments
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {(
                  computationsRef.current.totalAppointments || 0
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-purple-100 rounded-full">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">
              Avg:{' '}
              {Math.round(
                (computationsRef.current.totalAppointments || 0) / 12
              )}
              /month
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                <IndianRupee className="inline w-4 h-4 mr-1" />
                {(
                  (computationsRef.current.totalEmployeeCosts || 0) +
                  (computationsRef.current.totalOperatingCosts || 0) +
                  (computationsRef.current.totalEquipmentCosts || 0) +
                  (computationsRef.current.totalInventoryCosts || 0)
                ).toLocaleString()}
              </p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <TrendingDown className="w-6 h-6 text-red-600" />
            </div>
          </div>
          <div className="flex items-center mt-2">
            <span className="text-sm text-gray-600">
              Monthly avg: <IndianRupee className="inline w-3 h-3" />
              {Math.round(
                ((computationsRef.current.totalEmployeeCosts || 0) +
                  (computationsRef.current.totalOperatingCosts || 0) +
                  (computationsRef.current.totalEquipmentCosts || 0) +
                  (computationsRef.current.totalInventoryCosts || 0)) /
                  12
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Revenue vs Net Profit Chart */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {timeFilter === 'monthly'
              ? 'Monthly Financial Performance'
              : 'Annual Financial Performance'}
          </h3>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart
              data={filteredData}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} interval={0} />
              <YAxis
                tick={{ fontSize: 12 }}
                tickFormatter={(value) => `₹${(value / 1000).toFixed(0)}k`}
                width={60}
              />
              <Tooltip
                formatter={(value) => [
                  `₹${Number(value).toLocaleString()}`,
                  '',
                ]}
                labelFormatter={(label) => `Month: ${label}`}
              />
              <Legend />
              <Bar
                dataKey="revenue"
                fill="#4f46e5"
                name="Revenue"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="netProfit"
                fill="#10b981"
                name="Net Profit"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Expense Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Expense Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={expenseBreakdown}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percentage }) => `${name}\n${percentage}%`}
                outerRadius={100}
                innerRadius={60}
                fill="#8884d8"
                dataKey="value"
                paddingAngle={2}
              >
                {expenseBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value, name) => [
                  `₹${Number(value).toLocaleString()}`,
                  name,
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Financial Details Table */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Monthly Financial Details
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Detailed breakdown of revenue, expenses, and net profit by month
          </p>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('month')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Month
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('appointmentCount')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Appointments
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('revenue')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Revenue
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Operating Costs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee Costs
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Equipment
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Inventory
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button
                    onClick={() => handleSort('netProfit')}
                    className="flex items-center gap-1 hover:text-gray-700"
                  >
                    Net Profit
                    <ArrowUpDown className="w-4 h-4" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {sortedMonthlyData.map((month) => (
                <tr key={month.month} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {month.month} {month.year}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 text-center">
                    {month.appointmentCount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{month.revenue.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600">
                    ₹{month.operatingCosts.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-red-600">
                    ₹{month.employeeCosts.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-600">
                    ₹{month.equipmentCosts.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-pink-600">
                    ₹{month.inventoryCosts.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <span
                      className={
                        month.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                      }
                    >
                      {month.netProfit >= 0 ? (
                        <ArrowUp className="w-4 h-4 inline mr-1" />
                      ) : (
                        <ArrowDown className="w-4 h-4 inline mr-1" />
                      )}
                      ₹{Math.abs(month.netProfit).toLocaleString()}
                      {month.netProfit < 0 && ' (Loss)'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Table */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200 p-4">
            {sortedMonthlyData.map((month) => (
              <div key={month.month} className="py-4">
                <div className="flex justify-between items-start mb-3">
                  <span className="text-sm font-medium text-gray-900">
                    {month.month} {month.year}
                  </span>
                  <span
                    className={`text-sm font-medium flex items-center ${
                      month.netProfit >= 0 ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {month.netProfit >= 0 ? (
                      <ArrowUp className="w-4 h-4 mr-1" />
                    ) : (
                      <ArrowDown className="w-4 h-4 mr-1" />
                    )}
                    ₹{Math.abs(month.netProfit).toLocaleString()}
                    {month.netProfit < 0 && ' (Loss)'}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Appointments:</span>{' '}
                    {month.appointmentCount}
                  </div>
                  <div>
                    <span className="font-medium">Revenue:</span> ₹
                    {month.revenue.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium text-orange-600">
                      Operating:
                    </span>{' '}
                    ₹{month.operatingCosts.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium text-red-600">Employees:</span>{' '}
                    ₹{month.employeeCosts.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium text-purple-600">
                      Equipment:
                    </span>{' '}
                    ₹{month.equipmentCosts.toLocaleString()}
                  </div>
                  <div>
                    <span className="font-medium text-pink-600">
                      Inventory:
                    </span>{' '}
                    ₹{month.inventoryCosts.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Department Breakdown & Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Department Breakdown */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Building className="w-5 h-5" />
            Department Breakdown
          </h3>
          <div className="space-y-4">
            {departmentBreakdown.map((dept, index) => (
              <div
                key={dept.name}
                className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-gray-900">{dept.name}</p>
                  <p className="text-sm text-gray-500">
                    ({dept.employeeCount} employees)
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">
                    ₹{dept.totalSalary.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Analysis */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Wallet className="w-5 h-5" />
            Cost Analysis
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-blue-700 font-medium">Total Salaries</span>
              <span className="text-blue-700 font-semibold">
                ₹
                {(
                  computationsRef.current.totalEmployeeCosts || 0
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
              <span className="text-green-700 font-medium">Total Expenses</span>
              <span className="text-green-700 font-semibold">
                ₹
                {(
                  (computationsRef.current.totalOperatingCosts || 0) +
                  (computationsRef.current.totalEquipmentCosts || 0) +
                  (computationsRef.current.totalInventoryCosts || 0)
                ).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-t border-purple-200">
              <span className="text-purple-700 font-semibold">Total Costs</span>
              <span className="text-purple-700 font-bold">
                ₹
                {(
                  (computationsRef.current.totalEmployeeCosts || 0) +
                  (computationsRef.current.totalOperatingCosts || 0) +
                  (computationsRef.current.totalEquipmentCosts || 0) +
                  (computationsRef.current.totalInventoryCosts || 0)
                ).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <Target className="w-5 h-5" />
            Performance Metrics
          </h3>
          <div className="space-y-4">
            <div className="text-center p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border">
              <PieChartIcon className="w-8 h-8 text-green-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Profit Margin</p>
              <p className="text-2xl font-bold text-green-600">
                {performanceMetrics.profitMargin}%
              </p>
            </div>
            <div className="text-center p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
              <BarChart3 className="w-8 h-8 text-blue-600 mx-auto mb-2" />
              <p className="text-sm text-gray-600">Return on Investment</p>
              <p className="text-2xl font-bold text-blue-600">
                {performanceMetrics.roi}%
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Employee Salary Breakdown */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Employee Salary Breakdown
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            Monthly salary distribution across departments
          </p>
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Monthly Salary
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Annual Cost
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {employeeDataRef.current.map((employee) => (
                <tr key={employee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {employee.name}
                      </div>
                      <div className="text-sm text-gray-500">{employee.id}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.role}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {employee.department}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ₹{employee.monthlySalary.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    ₹{(employee.monthlySalary * 12).toLocaleString()}
                  </td>
                </tr>
              ))}
              {/* Total Row */}
              <tr className="bg-gray-50 font-semibold">
                <td
                  colSpan={3}
                  className="px-6 py-4 text-sm text-gray-900 text-right"
                >
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹
                  {employeeDataRef.current
                    .reduce((sum, emp) => sum + emp.monthlySalary, 0)
                    .toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹
                  {(
                    employeeDataRef.current.reduce(
                      (sum, emp) => sum + emp.monthlySalary,
                      0
                    ) * 12
                  ).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Mobile View */}
        <div className="md:hidden">
          <div className="divide-y divide-gray-200 p-4">
            {employeeDataRef.current.map((employee) => (
              <div key={employee.id} className="py-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="text-sm font-medium text-gray-900">
                      {employee.name}
                    </span>
                    <span className="text-sm text-gray-500 ml-2">
                      ({employee.id})
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    ₹{employee.monthlySalary.toLocaleString()}/mo
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
                  <div>
                    <span className="font-medium">Role:</span> {employee.role}
                  </div>
                  <div>
                    <span className="font-medium">Dept:</span>{' '}
                    {employee.department}
                  </div>
                  <div className="col-span-2">
                    <span className="font-medium">Annual:</span> ₹
                    {(employee.monthlySalary * 12).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SalesModule;
