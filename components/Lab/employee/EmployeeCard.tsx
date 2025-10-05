// components/Lab/employee/EmployeeCard.tsx
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
} from 'lucide-react';
import { useState } from 'react';

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

interface EmployeeCardProps {
  employee: Employee;
}

const EmployeeCard = ({ employee }: EmployeeCardProps) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedEmployee, setEditedEmployee] = useState<Employee>(employee);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isFieldCollector, setIsFieldCollector] = useState(employee.isFieldCollector);

  const handleDelete = async () => {
    if (
      !confirm(
        `Are you sure you want to delete ${employee.name}?`
      )
    )
      return;

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

      // Validation
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
              {/* <Calendar size={12} /> */}
              <span>Added: {formatDate(employee.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-1 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
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

      <div className="space-y-3">
        <div className="flex items-center gap-2 text-gray-700">
          <Briefcase size={18} className="text-teal-600 flex-shrink-0" />
          {isEditing ? (

            <div className='block w-full'>

              <div className='flex gap-2 mb-2'>
                <input type="checkbox" name="isFieldCollector" id="isFieldCollector" checked={isFieldCollector} disabled={isFieldCollector} onChange={(e) => {
                  const checked = e.target.checked;
                  setIsFieldCollector(checked);
                  handleChange('role', checked ? 'Field Collector' : '');

                }} /><span><p className='text-sm font-medium text-gray-700'>Is Field Collector ?</p></span>
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

      {/* Edit mode indicator */}
      {/* {isEditing && (
        <div className="absolute top-2 right-2">
          <div className="bg-blue-100 text-blue-600 text-xs px-2 py-1 rounded-full font-medium">
            Editing
          </div>
        </div>
      )} */}
    </div>
  );
};

export default EmployeeCard;
