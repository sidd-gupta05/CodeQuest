//components/Lab/employee/LeaveApplicationForm.tsx
'use client';
import { useState, useContext } from 'react';
import { LabContext } from '@/app/context/LabContext';
import { X, Calendar, FileText, Clock } from 'lucide-react';

interface LeaveApplicationFormProps {
  employeeId: string;
  employeeName: string;
  onClose: () => void;
  onSuccess: () => void;
}

const LeaveApplicationForm = ({
  employeeId,
  employeeName,
  onClose,
  onSuccess,
}: LeaveApplicationFormProps) => {
  const labContext = useContext(LabContext);
  const labId = labContext?.labId || '';

  const [formData, setFormData] = useState({
    startDate: '',
    endDate: '',
    leaveType: 'CASUAL_LEAVE',
    reason: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const leaveTypes = [
    { value: 'SICK_LEAVE', label: 'Sick Leave' },
    { value: 'CASUAL_LEAVE', label: 'Casual Leave' },
    { value: 'EARNED_LEAVE', label: 'Earned Leave' },
    { value: 'MATERNITY_LEAVE', label: 'Maternity Leave' },
    { value: 'PATERNITY_LEAVE', label: 'Paternity Leave' },
    { value: 'EMERGENCY_LEAVE', label: 'Emergency Leave' },
    { value: 'OTHER', label: 'Other' },
  ];

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
  };

  const calculateLeaveDays = () => {
    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate);
      const end = new Date(formData.endDate);
      const timeDiff = end.getTime() - start.getTime();
      const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
      return daysDiff > 0 ? daysDiff : 0;
    }
    return 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!formData.startDate || !formData.endDate || !formData.reason.trim()) {
        throw new Error('All fields are required');
      }

      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);

      if (endDate < startDate) {
        throw new Error('End date cannot be before start date');
      }

      const response = await fetch('/api/leave/apply-leave', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          employeeId,
          labId,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          leaveType: formData.leaveType,
          reason: formData.reason,
        }),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
        onClose();
      } else {
        throw new Error(data.error || 'Failed to apply for leave');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const leaveDays = calculateLeaveDays();

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
          <h2 className="text-xl font-bold text-gray-900">Apply for Leave</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
            type="button"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Employee Info */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900">{employeeName}</h3>
            <p className="text-sm text-blue-700">
              Employee ID: {employeeId.slice(0, 8)}...
            </p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Leave Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                Start Date
              </label>
              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-1" />
                End Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                required
                min={
                  formData.startDate || new Date().toISOString().split('T')[0]
                }
              />
            </div>
          </div>

          {/* Leave Days Calculation */}
          {leaveDays > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-green-800">
                  Total Leave Days:
                </span>
                <span className="text-lg font-bold text-green-900">
                  {leaveDays} day{leaveDays > 1 ? 's' : ''}
                </span>
              </div>
            </div>
          )}

          {/* Leave Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Leave Type
            </label>
            <select
              name="leaveType"
              value={formData.leaveType}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              required
            >
              {leaveTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Reason */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText size={16} className="inline mr-1" />
              Reason for Leave
            </label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              rows={4}
              placeholder="Please provide a reason for your leave..."
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent resize-none"
              required
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2 px-3 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2 px-3 rounded-lg bg-teal-600 text-white font-medium hover:bg-teal-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors shadow-lg shadow-teal-600/30 flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Applying...
                </>
              ) : (
                'Apply for Leave'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LeaveApplicationForm;
