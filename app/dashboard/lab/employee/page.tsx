//app/dashboard/lab/employee/page.tsx
'use client';
import { useContext, useState } from 'react';
import {
  UserPlus,
  Users,
  IndianRupee,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { LabContext } from '@/app/context/LabContext';
import EmployeeCard from '@/components/Lab/employee/EmployeeCard';
import CreateEmployeeForm from '@/components/Lab/employee/CreateEmployeeFrom';
import AttendanceRecords from '@/components/Lab/employee/AttendanceRecords';
import LeaveApplicationForm from '@/components/Lab/employee/LeaveApplicationForm';
import LeaveManagement from '@/components/Lab/employee/LeaveManagement';

const Employee = () => {
  const { employeeData: employees = [] } = useContext(LabContext) || {};
  const labId = useContext(LabContext)?.labId || '';
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState<
    'employees' | 'attendance' | 'leaves'
  >('employees');

  // Calculate statistics
  const totalMonthlySalary = employees.reduce(
    (sum, emp) => sum + emp.monthlySalary,
    0
  );
  const departments = [...new Set(employees.map((emp) => emp.department))];
  const roles = [...new Set(employees.map((emp) => emp.role))];

  // Calculate attendance stats
  const today = new Date().toISOString().split('T')[0];
  const presentCount = employees.filter((emp) => {
    // This would need to be calculated from actual attendance data
    return true; // Placeholder
  }).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Employee Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your lab staff, attendance, and leave applications
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2 w-fit"
            >
              <UserPlus size={20} />
              Add Employee
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 mb-6">
            <button
              onClick={() => setActiveTab('employees')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'employees'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users size={18} />
              Employees ({employees.length})
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'attendance'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={18} />
              Attendance Records
            </button>
            <button
              onClick={() => setActiveTab('leaves')}
              className={`px-4 py-2 font-medium text-sm border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === 'leaves'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar size={18} />
              Leave Management
            </button>
          </div>

          {/* Statistics Cards - Show only on employees tab */}
          {activeTab === 'employees' && employees.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Employees</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {employees.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <IndianRupee className="text-green-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">
                      Monthly Salary Expense
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      {totalMonthlySalary.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <BarChart3 className="text-purple-600" size={20} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Departments</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {departments.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Employees Tab Content */}
        {activeTab === 'employees' && (
          <>
            {employees.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Users size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Employees Yet
                </h3>
                <p className="text-gray-500 mb-6">
                  Get started by adding your first employee to your lab
                </p>
                <button
                  onClick={() => setShowForm(true)}
                  className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 inline-flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Add First Employee
                </button>
              </div>
            ) : (
              <>
                {/* Department Filter */}
                <div className="mb-6">
                  <div className="flex flex-wrap gap-2">
                    <span className="text-sm text-gray-600 my-auto font-medium">
                      Departments:
                    </span>
                    {departments.map((dept) => (
                      <span
                        key={dept}
                        className="px-3 py-1 bg-teal-100 text-teal-800 text-sm rounded-full font-medium"
                      >
                        {dept}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {employees.map((emp) => (
                    <EmployeeCard key={emp.id} employee={emp} />
                  ))}
                </div>
              </>
            )}
          </>
        )}

        {/* Attendance Tab Content */}
        {activeTab === 'attendance' && (
          <div className="space-y-6">
            {employees.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Employees Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Add employees first to start tracking attendance
                </p>
                <button
                  onClick={() => {
                    setActiveTab('employees');
                    setShowForm(true);
                  }}
                  className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 inline-flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Add Employee
                </button>
              </div>
            ) : (
              <>
                {/* Quick Attendance Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <Users className="text-green-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Total Employees</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {employees.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <Calendar className="text-blue-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Today's Date</p>
                        <p className="text-lg font-bold text-gray-900">
                          {new Date().toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <BarChart3 className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Departments</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {departments.length}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl p-4 shadow-md border border-gray-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-100 rounded-lg">
                        <IndianRupee className="text-teal-600" size={20} />
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Salary Expense</p>
                        <p className="text-lg font-bold text-gray-900">
                          {totalMonthlySalary.toLocaleString('en-IN')}/mo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Attendance Records Component */}
                <AttendanceRecords />
              </>
            )}
          </div>
        )}

        {/* Leave Management Tab Content */}
        {activeTab === 'leaves' && (
          <div className="space-y-6">
            {employees.length === 0 ? (
              <div className="bg-white rounded-xl shadow-md p-12 text-center">
                <Calendar size={48} className="mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">
                  No Employees Found
                </h3>
                <p className="text-gray-500 mb-6">
                  Add employees first to manage leave applications
                </p>
                <button
                  onClick={() => {
                    setActiveTab('employees');
                    setShowForm(true);
                  }}
                  className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 inline-flex items-center gap-2"
                >
                  <UserPlus size={20} />
                  Add Employee
                </button>
              </div>
            ) : (
              <LeaveManagement />
            )}
          </div>
        )}
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <CreateEmployeeForm labId={labId} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default Employee;
