//components/Lab/revenue/SalesTables.tsx
import React from 'react';
import { ArrowUpDown, ArrowUp, ArrowDown, IndianRupee } from 'lucide-react';
import { MonthlyFinancials, Employee, SortConfig } from './types';

interface SalesTablesProps {
  sortedMonthlyData: MonthlyFinancials[];
  employeeData: Employee[];
  sortConfig: SortConfig;
  handleSort: (key: string) => void;
}

const SalesTables: React.FC<SalesTablesProps> = ({
  sortedMonthlyData,
  employeeData,
  sortConfig,
  handleSort,
}) => (
  <>
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
      <div className="md:hidden divide-y divide-gray-200 p-4">
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
                <span className="font-medium text-orange-600">Operating:</span>{' '}
                ₹{month.operatingCosts.toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-red-600">Employees:</span> ₹
                {month.employeeCosts.toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-purple-600">Equipment:</span>{' '}
                ₹{month.equipmentCosts.toLocaleString()}
              </div>
              <div>
                <span className="font-medium text-pink-600">Inventory:</span> ₹
                {month.inventoryCosts.toLocaleString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>

    {/* Employee Salary Breakdown Table */}
    <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900">
          Employee Salary Breakdown
        </h3>
        <p className="text-sm text-gray-600 mt-1">
          Monthly salary distribution across departments
        </p>
      </div>

      {/* Desktop Table */}
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
          {employeeData.length === 0 ? (
            <tbody className="text-center text-gray-500">
              <tr>
                <td className="py-5 text-sm" colSpan={5}>
                  Add Employees ; No Data Available
                </td>
              </tr>
            </tbody>
          ) : (
            <tbody className="divide-y divide-gray-200">
              {employeeData.map((employee) => (
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
              <tr className="bg-gray-50 font-semibold">
                <td
                  colSpan={3}
                  className="px-6 py-4 text-sm text-gray-900 text-right"
                >
                  Total:
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹
                  {employeeData
                    .reduce((sum, emp) => sum + emp.monthlySalary, 0)
                    .toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  ₹
                  {(
                    employeeData.reduce(
                      (sum, emp) => sum + emp.monthlySalary,
                      0
                    ) * 12
                  ).toLocaleString()}
                </td>
              </tr>
            </tbody>
          )}
        </table>
      </div>

      {/* Mobile Table */}
      <div className="md:hidden divide-y divide-gray-200 p-4">
        {employeeData.map((employee) => (
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
                <span className="font-medium">Dept:</span> {employee.department}
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
  </>
);

export default SalesTables;
