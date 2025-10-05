//app/dashboard/lab/sales/page.tsx
import React, { useMemo } from 'react';
import {
  Building,
  Wallet,
  Target,
  PieChart as PieChartIcon,
  BarChart3,
  IndianRupee,
} from 'lucide-react';
import { Employee } from './types';

interface SalesInsightsProps {
  computations: {
    totalEmployeeCosts: number;
    totalOperatingCosts: number;
    totalEquipmentCosts: number;
    totalInventoryCosts: number;
    totalNetProfit: number;
    totalRevenue: number;
  };
  employeeData: Employee[];
}

const SalesInsights: React.FC<SalesInsightsProps> = ({
  computations,
  employeeData,
}) => {
  const departmentBreakdown = useMemo(() => {
    const departments: {
      [key: string]: { totalSalary: number; employeeCount: number };
    } = {};

    employeeData.forEach((employee) => {
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
  }, [employeeData]);

  const performanceMetrics = useMemo(() => {
    const totalRevenue = computations.totalRevenue || 1;
    const totalNetProfit = computations.totalNetProfit || 0;
    const totalCosts =
      computations.totalEmployeeCosts +
        computations.totalOperatingCosts +
        computations.totalEquipmentCosts +
        computations.totalInventoryCosts || 1;

    return {
      profitMargin: Math.round((totalNetProfit / totalRevenue) * 100),
      roi: Math.round((totalNetProfit / totalCosts) * 100),
    };
  }, [computations]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Department Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Building className="w-5 h-5 text-gray-600" />
          Department Breakdown
        </h3>
        <div className="space-y-4">
          {employeeData.length === 0 ? (
            <p className="text-center text-sm text-gray-500">
              Add Employees ; No Data Available
            </p>
          ) : (
            departmentBreakdown.map((dept, index) => (
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
                    <IndianRupee className="inline w-3 h-3 mr-1 text-gray-700" />
                    {dept.totalSalary.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-500">per month</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cost Analysis */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Wallet className="w-5 h-5 text-gray-600" />
          Cost Analysis
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
            <span className="text-blue-700 font-medium">Total Salaries</span>
            <span className="text-blue-700 font-semibold">
              <IndianRupee className="inline w-3 h-3 mr-1 text-blue-700" />
              {(computations.totalEmployeeCosts || 0).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
            <span className="text-green-700 font-medium">Total Expenses</span>
            <span className="text-green-700 font-semibold">
              <IndianRupee className="inline w-3 h-3 mr-1 text-green-700" />
              {(
                (computations.totalOperatingCosts || 0) +
                (computations.totalEquipmentCosts || 0) +
                (computations.totalInventoryCosts || 0)
              ).toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-t border-purple-200">
            <span className="text-purple-700 font-semibold">Total Costs</span>
            <span className="text-purple-700 font-bold">
              <IndianRupee className="inline w-3 h-3 mr-1 text-purple-700" />
              {(
                (computations.totalEmployeeCosts || 0) +
                (computations.totalOperatingCosts || 0) +
                (computations.totalEquipmentCosts || 0) +
                (computations.totalInventoryCosts || 0)
              ).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-gray-600" />
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
  );
};

export default SalesInsights;
