import React, { useMemo } from 'react';
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
} from 'recharts';
import { MonthlyFinancials } from './types';

interface SalesChartsProps {
  timeFilter: 'monthly' | 'yearly';
  filteredData: MonthlyFinancials[];
  computations: {
    totalEmployeeCosts: number;
    totalOperatingCosts: number;
    totalEquipmentCosts: number;
    totalInventoryCosts: number;
  };
}

const COLORS = [
  '#4f46e5', // Revenue: Indigo
  '#10b981', // Net Profit: Emerald
  '#f97316', // Operating Costs: Orange
  '#ef4444', // Employee Costs: Red
  '#8b5cf6', // Equipment: Violet
  '#ec4899', // Inventory: Pink
];

const SalesCharts: React.FC<SalesChartsProps> = ({
  timeFilter,
  filteredData,
  computations,
}) => {
  const expenseBreakdown = useMemo(() => {
    const totalExpenses =
      computations.totalOperatingCosts +
      computations.totalEmployeeCosts +
      computations.totalEquipmentCosts +
      computations.totalInventoryCosts;

    if (totalExpenses === 0) {
      return [];
    }

    return [
      {
        name: 'Employee Salaries',
        value: computations.totalEmployeeCosts,
        percentage: Math.round(
          (computations.totalEmployeeCosts / totalExpenses) * 100
        ),
      },
      {
        name: 'Operating Costs',
        value: computations.totalOperatingCosts,
        percentage: Math.round(
          (computations.totalOperatingCosts / totalExpenses) * 100
        ),
      },
      {
        name: 'Equipment',
        value: computations.totalEquipmentCosts,
        percentage: Math.round(
          (computations.totalEquipmentCosts / totalExpenses) * 100
        ),
      },
      {
        name: 'Inventory',
        value: computations.totalInventoryCosts,
        percentage: Math.round(
          (computations.totalInventoryCosts / totalExpenses) * 100
        ),
      },
    ];
  }, [computations]);

  return (
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
              formatter={(value: number, name: string) => [
                `₹${value.toLocaleString()}`,
                name,
              ]}
              labelFormatter={(label) => `Month: ${label}`}
            />
            <Legend />
            <Bar
              dataKey="revenue"
              fill={COLORS[0]}
              name="Revenue"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="netProfit"
              fill={COLORS[1]}
              name="Net Profit"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Expense Breakdown */}
      <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center justify-center">
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
              label={(props) => {
                const { name, percentage } = props;
                return `${name} ${percentage ?? ''}%`;
              }}
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
  );
};

export default SalesCharts;
