// "use client";
// import { useContext, useState } from 'react';
// import { UserPlus, Users } from 'lucide-react';
// import { LabContext } from '@/app/context/LabContext';
// import EmployeeCard from '@/components/Lab/employee/EmployeeCard';
// import CreateEmployeeForm from '@/components/Lab/employee/CreateEmployeeFrom';

// const Employee = () => {
//   const { employeeData: employees = [] } = useContext(LabContext) || {};
//   const labId = useContext(LabContext)?.labId || '';
//   const [showForm, setShowForm] = useState(false);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         {/* Header */}
//         <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
//           <div>
//             <h1 className="text-xl font-semibold">Employee Management</h1>
//             <p className="text-gray-600 flex items-center gap-2">
//               {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'} Total
//             </p>
//           </div>
//           <div className="flex gap-3">
//             {employees.length > 0 && (
//               <button
//                 onClick={() => setShowForm(true)}
//                 className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2"
//               >
//                 <UserPlus size={20} />
//                 Add Employee
//               </button>
//             )}
//           </div>
//         </div>

//         {/* Employee List */}
//         {employees.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-md p-12 text-center">
//             <Users size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No Employees Yet</h3>
//             <p className="text-gray-500 mb-6">Get started by adding your first employee</p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="px-6 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 inline-flex items-center gap-2"
//             >

//               Add First Employee
//             </button>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {employees.map(emp => (
//               <EmployeeCard key={emp.id} employee={emp} />
//             ))}
//           </div>
//         )}
//       </div>

//       {/* Add Employee Form */}
//       {showForm && (
//         <CreateEmployeeForm labId={labId} onClose={() => setShowForm(false)} />
//       )}
//     </div>
//   );
// };

// export default Employee;

// app/employee/page.tsx
'use client';
import { useContext, useState } from 'react';
import { UserPlus, Users, IndianRupee, BarChart3 } from 'lucide-react';
import { LabContext } from '@/app/context/LabContext';
import EmployeeCard from '@/components/Lab/employee/EmployeeCard';
import CreateEmployeeForm from '@/components/Lab/employee/CreateEmployeeFrom';

const Employee = () => {
  const { employeeData: employees = [] } = useContext(LabContext) || {};
  const labId = useContext(LabContext)?.labId || '';
  const [showForm, setShowForm] = useState(false);

  // Calculate statistics
  const totalMonthlySalary = employees.reduce(
    (sum, emp) => sum + emp.monthlySalary,
    0
  );
  const departments = [...new Set(employees.map((emp) => emp.department))];
  const roles = [...new Set(employees.map((emp) => emp.role))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Employee Management
              </h1>
              <p className="text-gray-600 mt-1">
                Manage your lab staff and their details
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

          {/* Statistics Cards */}
          {employees.length > 0 && (
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

        {/* Employee List */}
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
            {/* Department Filter (optional enhancement) */}
            <div className="mb-6">
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-gray-600 font-medium">
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
      </div>

      {/* Add Employee Form */}
      {showForm && (
        <CreateEmployeeForm labId={labId} onClose={() => setShowForm(false)} />
      )}
    </div>
  );
};

export default Employee;
