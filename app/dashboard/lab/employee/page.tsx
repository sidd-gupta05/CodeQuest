// "use client";
// import { useContext, useState } from 'react';
// import { UserPlus, Users, RefreshCw } from 'lucide-react';
// import { LabContext } from '@/app/context/LabContext';
// import EmployeeCard from '@/components/Lab/employee/EmployeeCard';
// import CreateEmployeeForm from '@/components/Lab/employee/CreateEmployeeFrom';

// const Employee = () => {
//   const { employeeData: employees = [], loading} = useContext(LabContext) || {};
//   const labId = useContext(LabContext)?.labId || '';
//   const [showForm, setShowForm] = useState(false);

//   // Group employees by department
//   const groupedByDepartment = employees.reduce<Record<string, typeof employees>>((acc, employee) => {
//     if (!acc[employee.department]) acc[employee.department] = [];
//     acc[employee.department].push(employee);
//     return acc;
//   }, {});

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
//       <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
//         <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
//           <div>
//             <h1 className="text-xl font-semibold">Employee Management</h1>
//             <p className="text-gray-600 flex items-center gap-2">

//               {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'} Total
//             </p>
//           </div>
//           <div className="flex gap-3">
//             <button
//               onClick={() => setShowForm(true)}
//               className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2"
//             >
//               <UserPlus size={20} />
//               Add Employee
//             </button>
//           </div>
//         </div>

//         {loading ? (
//           <div className="flex items-center justify-center py-20">
//             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
//           </div>
//         ) : employees.length === 0 ? (
//           <div className="bg-white rounded-xl shadow-md p-12 text-center">
//             <Users size={48} className="mx-auto text-gray-400 mb-4" />
//             <h3 className="text-xl font-semibold text-gray-700 mb-2">No Employees Yet</h3>
//             <p className="text-gray-500 mb-6">Get started by adding your first employee</p>
//             <button
//               onClick={() => setShowForm(true)}
//               className="px-6 py-3 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 inline-flex items-center gap-2"
//             >
//               <UserPlus size={20} />
//               Add First Employee
//             </button>
//           </div>
//         ) : (
//           <div className="space-y-8">
//             {Object.entries(groupedByDepartment).map(([department, deptEmployees]) => (
//               <div key={department}>
//                 <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
//                   <div className="w-1 h-8 bg-teal-600 rounded"></div>
//                   {department} ({deptEmployees.length})
//                 </h2>
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                   {deptEmployees.map(emp => (
//                     <EmployeeCard key={emp.id} employee={emp} />
//                   ))}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>

//       {showForm && (
//         <CreateEmployeeForm labId={labId} onClose={() => setShowForm(false)} />
//       )}
//     </div>
//   );
// };

// export default Employee;


"use client";
import { useContext, useState } from 'react';
import { UserPlus, Users } from 'lucide-react';
import { LabContext } from '@/app/context/LabContext';
import EmployeeCard from '@/components/Lab/employee/EmployeeCard';
import CreateEmployeeForm from '@/components/Lab/employee/CreateEmployeeFrom';

const Employee = () => {
  const { employeeData: employees = [] } = useContext(LabContext) || {};
  const labId = useContext(LabContext)?.labId || '';
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-xl font-semibold">Employee Management</h1>
            <p className="text-gray-600 flex items-center gap-2">
              {employees.length} {employees.length === 1 ? 'Employee' : 'Employees'} Total
            </p>
          </div>
          <div className="flex gap-3">
            {employees.length > 0 && (
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 flex items-center gap-2"
              >
                <UserPlus size={20} />
                Add Employee
              </button>
            )}
          </div>
        </div>

        {/* Employee List */}
        {employees.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-12 text-center">
            <Users size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No Employees Yet</h3>
            <p className="text-gray-500 mb-6">Get started by adding your first employee</p>
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-2 rounded-lg bg-teal-600 text-white font-semibold hover:bg-teal-700 transition-all shadow-lg shadow-teal-600/30 inline-flex items-center gap-2"
            >

              Add First Employee
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {employees.map(emp => (
              <EmployeeCard key={emp.id} employee={emp} />
            ))}
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
