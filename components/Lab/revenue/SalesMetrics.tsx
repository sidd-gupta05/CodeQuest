//app/dashboard/lab/sales/page.tsx
import React from 'react';
import { IndianRupee, TrendingUp, TrendingDown, Users } from 'lucide-react';

interface SalesMetricsProps {
  computations: {
    totalRevenue: number;
    totalNetProfit: number;
    totalAppointments: number;
    totalEmployeeCosts: number;
    totalOperatingCosts: number;
    totalEquipmentCosts: number;
    totalInventoryCosts: number;
  };
}

const SalesMetrics: React.FC<SalesMetricsProps> = ({ computations }) => {
  const totalExpenses =
    (computations.totalEmployeeCosts || 0) +
    (computations.totalOperatingCosts || 0) +
    (computations.totalEquipmentCosts || 0) +
    (computations.totalInventoryCosts || 0);

  const profitMargin = Math.round(
    ((computations.totalNetProfit || 0) / (computations.totalRevenue || 1)) *
      100
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {/* Total Revenue */}
      <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              <IndianRupee className="inline w-4 h-4 mr-1" />
              {(computations.totalRevenue || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-indigo-100 rounded-full">
            <TrendingUp className="w-6 h-6 text-indigo-600" />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-600">
            From {(computations.totalAppointments || 0).toLocaleString()}{' '}
            appointments
          </span>
        </div>
      </div>

      {/* Net Profit */}
      <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Net Profit</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              <IndianRupee className="inline w-4 h-4 mr-1" />
              {(computations.totalNetProfit || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-green-100 rounded-full">
            <IndianRupee className="w-6 h-6 text-green-600" />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-sm text-green-600">
            {profitMargin}% profit margin
          </span>
        </div>
      </div>

      {/* Total Appointments */}
      <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">
              Total Appointments
            </p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {(computations.totalAppointments || 0).toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-purple-100 rounded-full">
            <Users className="w-6 h-6 text-purple-600" />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-600">
            Avg: {Math.round((computations.totalAppointments || 0) / 12)} /month
          </span>
        </div>
      </div>

      {/* Total Expenses */}
      <div className="bg-white rounded-lg shadow-sm p-6 transform transition-transform hover:scale-105">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">Total Expenses</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              <IndianRupee className="inline w-4 h-4 mr-1" />
              {totalExpenses.toLocaleString()}
            </p>
          </div>
          <div className="p-3 bg-red-100 rounded-full">
            <TrendingDown className="w-6 h-6 text-red-600" />
          </div>
        </div>
        <div className="flex items-center mt-2">
          <span className="text-sm text-gray-600">
            Monthly avg: <IndianRupee className="inline w-3 h-3" />
            {Math.round(totalExpenses / 12).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default SalesMetrics;
