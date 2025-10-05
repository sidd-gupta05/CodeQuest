//components/Lab/employee/LeaveManagement.tsx
'use client';
import { useState, useEffect, useContext } from 'react';
import { LabContext } from '@/app/context/LabContext';
import {
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Filter,
  User,
  FileText,
} from 'lucide-react';

interface LeaveApplication {
  id: string;
  employeeId: string;
  labId: string;
  startDate: string;
  endDate: string;
  leaveType: string;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  approvedBy: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
  employee?: {
    name: string;
    role: string;
    department: string;
  };
}

const LeaveManagement = () => {
  const labContext = useContext(LabContext);
  const labId = labContext?.labId || '';
  const employees = labContext?.employeeData || [];

  const [leaves, setLeaves] = useState<LeaveApplication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [selectedLeave, setSelectedLeave] = useState<LeaveApplication | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  useEffect(() => {
    if (labId) {
      fetchLeaves();
    }
  }, [labId, filterStatus]);

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/leave/get-leaves?labId=${labId}`;

      if (filterStatus !== 'ALL') {
        url += `&status=${filterStatus}`;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        setLeaves(data.leaves || []);
      } else {
        throw new Error(data.error || 'Failed to fetch leave applications');
      }
    } catch (err: any) {
      console.error('Error fetching leaves:', err);
      setError(err.message || 'Failed to fetch leave applications');
    } finally {
      setLoading(false);
    }
  };

  const updateLeaveStatus = async (
    leaveId: string,
    status: 'APPROVED' | 'REJECTED',
    notes?: string
  ) => {
    try {
      setError(null);

      const response = await fetch('/api/leave/update-leave-status', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          leaveId,
          status,
          notes,
        }),
      });

      const data = await response.json();

      if (data.success) {
        fetchLeaves(); // Refresh the list
        setShowDetailsModal(false);
      } else {
        throw new Error(data.error || 'Failed to update leave status');
      }
    } catch (err: any) {
      console.error('Error updating leave status:', err);
      setError(err.message || 'Failed to update leave status');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800';
      case 'REJECTED':
        return 'bg-red-100 text-red-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CANCELLED':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'REJECTED':
        return <XCircle size={16} className="text-red-600" />;
      case 'PENDING':
        return <Clock size={16} className="text-yellow-600" />;
      case 'CANCELLED':
        return <AlertCircle size={16} className="text-gray-600" />;
      default:
        return <Clock size={16} className="text-gray-600" />;
    }
  };

  const getLeaveTypeColor = (leaveType: string) => {
    switch (leaveType) {
      case 'SICK_LEAVE':
        return 'bg-blue-100 text-blue-800';
      case 'CASUAL_LEAVE':
        return 'bg-purple-100 text-purple-800';
      case 'EARNED_LEAVE':
        return 'bg-green-100 text-green-800';
      case 'MATERNITY_LEAVE':
        return 'bg-pink-100 text-pink-800';
      case 'PATERNITY_LEAVE':
        return 'bg-teal-100 text-teal-800';
      case 'EMERGENCY_LEAVE':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateLeaveDays = (startDate: string, endDate: string) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const timeDiff = end.getTime() - start.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1;
    return daysDiff > 0 ? daysDiff : 0;
  };

  const calculateStats = () => {
    const total = leaves.length;
    const pending = leaves.filter((leave) => leave.status === 'PENDING').length;
    const approved = leaves.filter(
      (leave) => leave.status === 'APPROVED'
    ).length;
    const rejected = leaves.filter(
      (leave) => leave.status === 'REJECTED'
    ).length;
    const cancelled = leaves.filter(
      (leave) => leave.status === 'CANCELLED'
    ).length;

    return { total, pending, approved, rejected, cancelled };
  };

  const stats = calculateStats();

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar size={24} />
              Leave Management
            </h2>
            <p className="text-gray-600 mt-1">
              Manage and approve employee leave applications
            </p>
          </div>

          {/* Filter Controls */}
          <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
            <button
              onClick={fetchLeaves}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors flex items-center gap-2"
            >
              <Filter size={16} />
              Refresh
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.total}
            </div>
            <div className="text-sm text-blue-600">Total</div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {stats.pending}
            </div>
            <div className="text-sm text-yellow-600">Pending</div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.approved}
            </div>
            <div className="text-sm text-green-600">Approved</div>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.rejected}
            </div>
            <div className="text-sm text-red-600">Rejected</div>
          </div>
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.cancelled}
            </div>
            <div className="text-sm text-gray-600">Cancelled</div>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
            {error}
          </div>
        )}
      </div>

      {/* Leave Applications Table */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Employee
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Leave Type
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Duration
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Days
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Applied On
                </th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {leaves.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    No leave applications found
                  </td>
                </tr>
              ) : (
                leaves.map((leave) => (
                  <tr
                    key={leave.id}
                    className="border-b border-gray-100 hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {leave.employee?.name || 'Unknown Employee'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {leave.employee?.role} • {leave.employee?.department}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getLeaveTypeColor(leave.leaveType)}`}
                      >
                        {leave.leaveType.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {formatDate(leave.startDate)} -{' '}
                      {formatDate(leave.endDate)}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-900">
                      {calculateLeaveDays(leave.startDate, leave.endDate)} days
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(leave.status)}`}
                      >
                        {getStatusIcon(leave.status)}
                        {leave.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-500">
                      {formatDate(leave.createdAt)}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            setSelectedLeave(leave);
                            setShowDetailsModal(true);
                          }}
                          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                        >
                          View
                        </button>
                        {leave.status === 'PENDING' && (
                          <>
                            <button
                              onClick={() =>
                                updateLeaveStatus(leave.id, 'APPROVED')
                              }
                              className="px-3 py-1 text-sm bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() =>
                                updateLeaveStatus(leave.id, 'REJECTED')
                              }
                              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                            >
                              Reject
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Leave Details Modal */}
      {showDetailsModal && selectedLeave && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-xl">
              <h2 className="text-xl font-bold text-gray-900">
                Leave Application Details
              </h2>
              <button
                onClick={() => setShowDetailsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100"
                type="button"
              >
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Employee Info */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="text-blue-600" size={20} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-blue-900">
                      {selectedLeave.employee?.name || 'Unknown Employee'}
                    </h3>
                    <p className="text-sm text-blue-700">
                      {selectedLeave.employee?.role} •{' '}
                      {selectedLeave.employee?.department}
                    </p>
                  </div>
                </div>
              </div>

              {/* Leave Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Leave Type
                  </label>
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${getLeaveTypeColor(selectedLeave.leaveType)}`}
                  >
                    {selectedLeave.leaveType.replace('_', ' ')}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div
                    className={`inline-flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-medium ${getStatusColor(selectedLeave.status)}`}
                  >
                    {getStatusIcon(selectedLeave.status)}
                    {selectedLeave.status}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedLeave.startDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedLeave.endDate)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Total Days
                  </label>
                  <p className="text-gray-900">
                    {calculateLeaveDays(
                      selectedLeave.startDate,
                      selectedLeave.endDate
                    )}{' '}
                    days
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Applied On
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedLeave.createdAt)}
                  </p>
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText size={16} className="inline mr-1" />
                  Reason for Leave
                </label>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <p className="text-gray-700 whitespace-pre-wrap">
                    {selectedLeave.reason}
                  </p>
                </div>
              </div>

              {/* Notes (if any) */}
              {selectedLeave.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Admin Notes
                  </label>
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-700 whitespace-pre-wrap">
                      {selectedLeave.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons for Pending Leaves */}
              {selectedLeave.status === 'PENDING' && (
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() =>
                      updateLeaveStatus(selectedLeave.id, 'APPROVED')
                    }
                    className="flex-1 py-2 px-3 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <CheckCircle size={18} />
                    Approve Leave
                  </button>
                  <button
                    onClick={() =>
                      updateLeaveStatus(selectedLeave.id, 'REJECTED')
                    }
                    className="flex-1 py-2 px-3 rounded-lg bg-red-600 text-white font-medium hover:bg-red-700 transition-colors flex items-center justify-center gap-2"
                  >
                    <XCircle size={18} />
                    Reject Leave
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveManagement;
