// // components/Lab/employee/EmployeeCard.tsx
// 'use client';
// import {
//   Briefcase,
//   Building2,
//   IndianRupee,
//   Loader,
//   Trash2,
//   Edit2,
//   Save,
//   X,
//   Calendar,
// } from 'lucide-react';
// import { useState } from 'react';

// interface Employee {
//   id: string;
//   name: string;
//   role: string;
//   department: string;
//   monthlySalary: number;
//   createdAt?: string;
//   updatedAt?: string;
// }

// interface EmployeeCardProps {
//   employee: Employee;
// }

// const EmployeeCard = ({ employee }: EmployeeCardProps) => {
//   const [isDeleting, setIsDeleting] = useState(false);
//   const [isEditing, setIsEditing] = useState(false);
//   const [editedEmployee, setEditedEmployee] = useState<Employee>(employee);
//   const [isSaving, setIsSaving] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const handleDelete = async () => {
//     if (
//       !confirm(
//         `Are you sure you want to delete ${employee.name}?`
//       )
//     )
//       return;

//     try {
//       setIsDeleting(true);
//       setError(null);
//       const res = await fetch('/api/employee/delete-employee', {
//         method: 'DELETE',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ employeeId: employee.id }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || 'Failed to delete employee');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Something went wrong while deleting employee');
//     } finally {
//       setIsDeleting(false);
//     }
//   };

//   const handleEdit = () => {
//     setIsEditing(true);
//     setEditedEmployee(employee);
//     setError(null);
//   };

//   const handleCancel = () => {
//     setIsEditing(false);
//     setEditedEmployee(employee);
//     setError(null);
//   };

//   const handleSave = async () => {
//     try {
//       setIsSaving(true);
//       setError(null);

//       // Validation
//       if (!editedEmployee.name.trim()) {
//         setError('Employee name is required');
//         return;
//       }
//       if (!editedEmployee.role.trim()) {
//         setError('Role is required');
//         return;
//       }
//       if (!editedEmployee.department.trim()) {
//         setError('Department is required');
//         return;
//       }
//       if (editedEmployee.monthlySalary < 0) {
//         setError('Salary cannot be negative');
//         return;
//       }

//       const res = await fetch('/api/employee/update-employee', {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           id: employee.id,
//           name: editedEmployee.name,
//           role: editedEmployee.role,
//           department: editedEmployee.department,
//           monthlySalary: editedEmployee.monthlySalary,
//         }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         setIsEditing(false);
//         setError(null);
//       } else {
//         setError(data.error || 'Failed to update employee');
//       }
//     } catch (err) {
//       console.error(err);
//       setError('Something went wrong while updating employee');
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleChange = (field: keyof Employee, value: string | number) => {
//     setEditedEmployee((prev) => ({
//       ...prev,
//       [field]: value,
//     }));
//     if (error) setError(null);
//   };

//   const formatDate = (dateString?: string) => {
//     if (!dateString) return 'N/A';
//     try {
//       return new Date(dateString).toLocaleDateString('en-IN', {
//         day: '2-digit',
//         month: '2-digit',
//         year: 'numeric',
//       });
//     } catch {
//       return 'Invalid Date';
//     }
//   };

//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map((part) => part.charAt(0).toUpperCase())
//       .join('')
//       .slice(0, 2);
//   };

//   return (
//     <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 relative group">
//       {/* Error Message */}
//       {error && (
//         <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
//           {error}
//         </div>
//       )}

//       <div className="flex items-start justify-between mb-4">
//         <div className="flex items-center gap-3">
//           <div className="w-14 aspect-square bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
//             {getInitials(employee.name)}
//           </div>

//           <div className="min-w-0 flex-1">
//             {isEditing ? (
//               <input
//                 type="text"
//                 value={editedEmployee.name}
//                 onChange={(e) => handleChange('name', e.target.value)}
//                 className="text-lg font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//                 placeholder="Employee Name"
//               />
//             ) : (
//               <h3 className="text-lg font-bold text-gray-800 truncate">
//                 {employee.name}
//               </h3>
//             )}
//             <p className="text-sm text-gray-500 truncate">
//               ID: {employee.id.slice(0, 8)}...
//             </p>
//             <div className="flex flex-row items-center gap-1 text-xs text-gray-400 mt-1">
//               {/* <Calendar size={12} /> */}
//               <span>Added: {formatDate(employee.createdAt)}</span>
//             </div>
//           </div>
//         </div>

//         {/* Action buttons */}
//         <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
//           {isEditing ? (
//             <>
//               <button
//                 onClick={handleSave}
//                 disabled={isSaving}
//                 className="p-2 rounded-full ml-3 hover:bg-green-100 text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Save Changes"
//               >
//                 {isSaving ? (
//                   <Loader size={18} className="animate-spin" />
//                 ) : (
//                   <Save size={18} />
//                 )}
//               </button>
//               <button
//                 onClick={handleCancel}
//                 disabled={isSaving}
//                 className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Cancel"
//               >
//                 <X size={18} />
//               </button>
//             </>
//           ) : (
//             <>
//               <button
//                 onClick={handleEdit}
//                 className="p-2 ml-3 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
//                 title="Edit Employee"
//               >
//                 <Edit2 size={18} />
//               </button>
//               <button
//                 onClick={handleDelete}
//                 disabled={isDeleting}
//                 className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
//                 title="Delete Employee"
//               >
//                 {isDeleting ? (
//                   <Loader size={18} className="animate-spin" />
//                 ) : (
//                   <Trash2 size={18} />
//                 )}
//               </button>
//             </>
//           )}
//         </div>
//       </div>

//       <div className="space-y-3">
//         <div className="flex items-center gap-2 text-gray-700">
//           <Briefcase size={18} className="text-teal-600 flex-shrink-0" />
//           {isEditing ? (
//             <input
//               type="text"
//               value={editedEmployee.role}
//               onChange={(e) => handleChange('role', e.target.value)}
//               className="text-sm font-medium bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               placeholder="Role"
//             />
//           ) : (
//             <span className="text-sm font-medium">{employee.role}</span>
//           )}
//         </div>

//         <div className="flex items-center gap-2 text-gray-700">
//           <Building2 size={18} className="text-teal-600 flex-shrink-0" />
//           {isEditing ? (
//             <input
//               type="text"
//               value={editedEmployee.department}
//               onChange={(e) => handleChange('department', e.target.value)}
//               className="text-sm font-medium bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               placeholder="Department"
//             />
//           ) : (
//             <span className="text-sm font-medium">{employee.department}</span>
//           )}
//         </div>

//         <div className="flex items-center gap-2 text-gray-700">
//           <IndianRupee size={18} className="text-teal-600 flex-shrink-0" />
//           {isEditing ? (
//             <input
//               type="number"
//               value={editedEmployee.monthlySalary}
//               onChange={(e) =>
//                 handleChange('monthlySalary', Number(e.target.value))
//               }
//               className="text-sm font-medium bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
//               min="0"
//               step="100"
//             />
//           ) : (
//             <span className="text-sm font-medium">
//               {employee.monthlySalary.toLocaleString('en-IN')} / month
//             </span>
//           )}
//         </div>
//       </div>

//       {/* Edit mode indicator */}
//       {/* {isEditing && (
//         <div className="absolute top-2 right-2">
//           <div className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
//             Editing
//           </div>
//         </div>
//       )} */}
//     </div>
//   );
// };

// export default EmployeeCard;

// // app/dashboard/lab/employee/page.tsx
// components/Lab/employee/EmployeeCard.tsx (updated with LabContext)
'use client';
import {
  Briefcase,
  Building2,
  IndianRupee,
  Loader,
  Trash2,
  Edit2,
  Save,
  X,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import { useState, useEffect, useContext } from 'react';
import { LabContext } from '@/app/context/LabContext';

interface Employee {
  id: string;
  name: string;
  role: string;
  department: string;
  monthlySalary: number;
  isFieldCollector: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  totalHours: number | null;
}

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const labContext = useContext(LabContext);
  const labId = labContext?.labId || '';

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFieldCollector, setIsFieldCollector] = useState(
    employee.isFieldCollector
  );

  // Attendance states
  const [todayAttendance, setTodayAttendance] =
    useState<AttendanceRecord | null>(null);
  const [isMarkingAttendance, setIsMarkingAttendance] = useState(false);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);

  // Fetch today's attendance
  useEffect(() => {
    if (labId) {
      fetchTodayAttendance();
    }
  }, [employee.id, labId]);

  const fetchTodayAttendance = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const response = await fetch(
        `/api/attendance/get-attendance?employeeId=${employee.id}&labId=${labId}&date=${today}`
      );
      const data = await response.json();

      if (data.success && data.attendances && data.attendances.length > 0) {
        setTodayAttendance(data.attendances[0]);
      } else {
        setTodayAttendance(null);
      }
    } catch (error) {
      console.error('Error fetching attendance:', error);
    }
  };

  const markAttendance = async (action: 'checkIn' | 'checkOut' | 'absent') => {
    if (!labId) {
      setError('Lab ID not found');
      return;
    }

    try {
      setIsMarkingAttendance(true);
      setError(null);

      const now = new Date().toISOString();
      const today = new Date().toISOString().split('T')[0];

      let payload: any = {
        employeeId: employee.id,
        labId,
        date: today,
      };

      if (action === 'checkIn') {
        payload.checkIn = now;
        payload.status = 'PRESENT';
      } else if (action === 'checkOut') {
        payload.checkOut = now;
        payload.status = 'PRESENT';
      } else if (action === 'absent') {
        payload.status = 'ABSENT';
      }

      const response = await fetch('/api/attendance/mark-attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setTodayAttendance(data.attendance);
        setShowAttendanceModal(false);
        // The realtime subscription in LabContext will update the global state
      } else {
        setError(data.error || 'Failed to mark attendance');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while marking attendance');
    } finally {
      setIsMarkingAttendance(false);
    }
  };

  const getAttendanceStatus = () => {
    if (!todayAttendance) return 'not-marked';
    if (todayAttendance.status === 'ABSENT') return 'absent';
    if (todayAttendance.checkIn && todayAttendance.checkOut) return 'completed';
    if (todayAttendance.checkIn && !todayAttendance.checkOut)
      return 'checked-in';
    return 'not-marked';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'checked-in':
        return 'text-blue-600 bg-blue-100';
      case 'absent':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Present';
      case 'checked-in':
        return 'Checked In';
      case 'absent':
        return 'Absent';
      default:
        return 'Not Marked';
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleDelete = async () => {
    if (!confirm(`Are you sure you want to delete ${employee.name}?`)) return;

    try {
      setIsDeleting(true);
      setError(null);
      const res = await fetch('/api/employee/delete-employee', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ employeeId: employee.id }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Failed to delete employee');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while deleting employee');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
    setEditedEmployee(employee);
    setError(null);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedEmployee(employee);
    setError(null);
    setIsFieldCollector(employee.isFieldCollector);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);

      if (!editedEmployee.name.trim()) {
        setError('Employee name is required');
        return;
      }
      if (!editedEmployee.role.trim()) {
        setError('Role is required');
        return;
      }
      if (!editedEmployee.department.trim()) {
        setError('Department is required');
        return;
      }
      if (editedEmployee.monthlySalary < 0) {
        setError('Salary cannot be negative');
        return;
      }

      const res = await fetch('/api/employee/update-employee', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: employee.id,
          name: editedEmployee.name,
          role: editedEmployee.role,
          department: editedEmployee.department,
          monthlySalary: editedEmployee.monthlySalary,
          isFieldCollector: isFieldCollector,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsEditing(false);
        setError(null);
      } else {
        setError(data.error || 'Failed to update employee');
      }
    } catch (err) {
      console.error(err);
      setError('Something went wrong while updating employee');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof Employee, value: string | number) => {
    setEditedEmployee((prev) => ({
      ...prev,
      [field]: value,
    }));
    if (error) setError(null);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const attendanceStatus = getAttendanceStatus();

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 p-6 border border-gray-100 relative group">
      {/* Error Message */}
      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-14 aspect-square bg-gradient-to-br from-teal-400 to-teal-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg">
            {getInitials(employee.name)}
          </div>

          <div className="min-w-0 flex-1">
            {isEditing ? (
              <input
                type="text"
                value={editedEmployee.name}
                onChange={(e) => handleChange('name', e.target.value)}
                className="text-lg font-bold text-gray-800 bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                placeholder="Employee Name"
              />
            ) : (
              <h3 className="text-lg font-bold text-gray-800 truncate">
                {employee.name}
              </h3>
            )}
            <p className="text-sm text-gray-500 truncate">
              ID: {employee.id.slice(0, 8)}...
            </p>
            <div className="flex flex-row items-center gap-1 text-xs text-gray-400 mt-1">
              <span>Added: {formatDate(employee.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
          {/* Attendance Quick Action */}
          <button
            onClick={() => setShowAttendanceModal(true)}
            className="p-2 rounded-full hover:bg-green-100 text-green-600 transition-colors"
            title="Mark Attendance"
          >
            <Clock size={18} />
          </button>

          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="p-2 rounded-full ml-3 hover:bg-green-100 text-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Save Changes"
              >
                {isSaving ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Save size={18} />
                )}
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Cancel"
              >
                <X size={18} />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleEdit}
                className="p-2 ml-3 rounded-full hover:bg-blue-100 text-blue-600 transition-colors"
                title="Edit Employee"
              >
                <Edit2 size={18} />
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="p-2 rounded-full hover:bg-red-100 text-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                title="Delete Employee"
              >
                {isDeleting ? (
                  <Loader size={18} className="animate-spin" />
                ) : (
                  <Trash2 size={18} />
                )}
              </button>
            </>
          )}
        </div>
      </div>

      {/* Attendance Status Badge */}
      <div className="mb-4">
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(attendanceStatus)}`}
        >
          {attendanceStatus === 'completed' && <CheckCircle size={14} />}
          {attendanceStatus === 'absent' && <XCircle size={14} />}
          {getStatusText(attendanceStatus)}
        </span>
        {todayAttendance &&
          (todayAttendance.checkIn || todayAttendance.checkOut) && (
            <div className="flex gap-4 mt-2 text-xs text-gray-600">
              {todayAttendance.checkIn && (
                <span>In: {formatTime(todayAttendance.checkIn)}</span>
              )}
              {todayAttendance.checkOut && (
                <span>Out: {formatTime(todayAttendance.checkOut)}</span>
              )}
            </div>
          )}
      </div>

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700">
          <Briefcase size={18} className="text-teal-600 flex-shrink-0" />
          {isEditing ? (
            <div className="block w-full">
              <div className="flex gap-2 mb-2">
                <input
                  type="checkbox"
                  name="isFieldCollector"
                  id="isFieldCollector"
                  checked={isFieldCollector}
                  disabled={isFieldCollector}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setIsFieldCollector(checked);
                    handleChange('role', checked ? 'Field Collector' : '');
                  }}
                />
                <span>
                  <p className="text-sm font-medium text-gray-700">
                    Is Field Collector ?
                  </p>
                </span>
              </div>

              <input
                type="text"
                value={editedEmployee.role}
                onChange={(e) => handleChange('role', e.target.value)}
                className={`text-sm font-medium ${isFieldCollector ? 'bg-gray-100 cursor-not-allowed' : 'bg-gray-50'} border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent`}
                placeholder="Role"
                disabled={isFieldCollector}
              />
            </div>
          ) : (
            <span className="text-sm font-medium">{employee.role}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <Building2 size={18} className="text-teal-600 flex-shrink-0" />
          {isEditing ? (
            <input
              type="text"
              value={editedEmployee.department}
              onChange={(e) => handleChange('department', e.target.value)}
              className="text-sm font-medium bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              placeholder="Department"
            />
          ) : (
            <span className="text-sm font-medium">{employee.department}</span>
          )}
        </div>

        <div className="flex items-center gap-2 text-gray-700">
          <IndianRupee size={18} className="text-teal-600 flex-shrink-0" />
          {isEditing ? (
            <input
              type="number"
              value={editedEmployee.monthlySalary}
              onChange={(e) =>
                handleChange('monthlySalary', Number(e.target.value))
              }
              className="text-sm font-medium bg-gray-50 border border-gray-300 rounded px-2 py-1 w-full focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              min="0"
              step="100"
            />
          ) : (
            <span className="text-sm font-medium">
              {employee.monthlySalary.toLocaleString('en-IN')} / month
            </span>
          )}
        </div>
      </div>

      {/* Attendance Modal */}
      {showAttendanceModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-sm w-full">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-lg font-bold text-gray-900">
                Mark Attendance
              </h2>
              <button
                onClick={() => setShowAttendanceModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                type="button"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Clock className="text-teal-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-800">{employee.name}</h3>
                <p className="text-sm text-gray-600">{employee.role}</p>
              </div>

              <div className="space-y-3">
                {!todayAttendance?.checkIn && (
                  <button
                    onClick={() => markAttendance('checkIn')}
                    disabled={isMarkingAttendance}
                    className="w-full py-3 px-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isMarkingAttendance ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Check In
                      </>
                    )}
                  </button>
                )}

                {todayAttendance?.checkIn && !todayAttendance?.checkOut && (
                  <button
                    onClick={() => markAttendance('checkOut')}
                    disabled={isMarkingAttendance}
                    className="w-full py-3 px-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                  >
                    {isMarkingAttendance ? (
                      <Loader size={18} className="animate-spin" />
                    ) : (
                      <>
                        <CheckCircle size={18} />
                        Check Out
                      </>
                    )}
                  </button>
                )}

                <button
                  onClick={() => markAttendance('absent')}
                  disabled={isMarkingAttendance}
                  className="w-full py-3 px-4 rounded-lg border border-red-300 text-red-600 font-medium hover:bg-red-50 disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  <XCircle size={18} />
                  Mark Absent
                </button>
              </div>

              {todayAttendance && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-medium text-gray-700 mb-2">
                    Today's Record
                  </h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-gray-600">Status:</span>
                      <span
                        className={`ml-2 font-medium ${getStatusColor(attendanceStatus)} px-2 py-1 rounded`}
                      >
                        {getStatusText(attendanceStatus)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Check In:</span>
                      <span className="ml-2 font-medium">
                        {formatTime(todayAttendance.checkIn)}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Check Out:</span>
                      <span className="ml-2 font-medium">
                        {formatTime(todayAttendance.checkOut)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeCard;
