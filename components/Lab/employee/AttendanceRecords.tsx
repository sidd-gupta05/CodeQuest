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
} from 'lucide-react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  totalHours: number | null;
  notes: string | null;
  employee?: {
    name: string;
    role: string;
    department: string;
  };
}

interface AttendanceRecordsProps {
  employeeId?: string; // Optional: if provided, shows only for this employee
}

const AttendanceRecords = ({ employeeId }: AttendanceRecordsProps) => {
  const labContext = useContext(LabContext);
  const labId = labContext?.labId || '';
  const employees = labContext?.employeeData || [];

  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>(
    'daily'
  );
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0]
  );

  useEffect(() => {
    if (labId) {
      fetchAttendanceData();
    }
  }, [labId, view, selectedDate, employeeId]);

  const fetchAttendanceData = async () => {
    try {
      setLoading(true);
      setError(null);

      let url = `/api/attendance/get-attendance?labId=${labId}`;

      if (employeeId) {
        url += `&employeeId=${employeeId}`;
      }

      // Add date filters based on view
      const today = new Date();
      switch (view) {
        case 'daily':
          url += `&date=${selectedDate}`;
          break;
        case 'weekly':
          const startOfWeek = new Date(today);
          startOfWeek.setDate(today.getDate() - today.getDay());
          const endOfWeek = new Date(today);
          endOfWeek.setDate(today.getDate() + (6 - today.getDay()));
          url += `&startDate=${startOfWeek.toISOString().split('T')[0]}&endDate=${endOfWeek.toISOString().split('T')[0]}`;
          break;
        case 'monthly':
          const year = today.getFullYear();
          const month = String(today.getMonth() + 1).padStart(2, '0');
          url += `&month=${year}-${month}`;
          break;
        case 'yearly':
          const currentYear = today.getFullYear();
          url += `&year=${currentYear}`;
          break;
      }

      const response = await fetch(url);
      const data = await response.json();

      if (data.success) {
        // Enrich attendance data with employee information
        const enrichedData = data.attendances.map(
          (attendance: AttendanceRecord) => ({
            ...attendance,
            employee: employees.find((emp) => emp.id === attendance.employeeId),
          })
        );
        setAttendanceData(enrichedData);
      } else {
        throw new Error(data.error || 'Failed to fetch attendance data');
      }
    } catch (err: any) {
      console.error('Error fetching attendance data:', err);
      setError(err.message || 'Failed to fetch attendance records');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'ABSENT':
        return <XCircle size={16} className="text-red-600" />;
      case 'HALF_DAY':
        return <AlertCircle size={16} className="text-yellow-600" />;
      case 'LEAVE':
        return <Clock size={16} className="text-blue-600" />;
      default:
        return <Clock size={16} className="text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PRESENT':
        return 'bg-green-100 text-green-800';
      case 'ABSENT':
        return 'bg-red-100 text-red-800';
      case 'HALF_DAY':
        return 'bg-yellow-100 text-yellow-800';
      case 'LEAVE':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timeString: string | null) => {
    if (!timeString) return '--:--';
    return new Date(timeString).toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const calculateStats = () => {
    const total = attendanceData.length;
    const present = attendanceData.filter(
      (att) => att.status === 'PRESENT'
    ).length;
    const absent = attendanceData.filter(
      (att) => att.status === 'ABSENT'
    ).length;
    const halfDay = attendanceData.filter(
      (att) => att.status === 'HALF_DAY'
    ).length;
    const leave = attendanceData.filter((att) => att.status === 'LEAVE').length;

    return { total, present, absent, halfDay, leave };
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
    <div className="bg-white rounded-xl shadow-md p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar size={24} />
            Attendance Records
            {employeeId && (
              <span className="text-sm font-normal text-gray-500">
                for {employees.find((emp) => emp.id === employeeId)?.name}
              </span>
            )}
          </h2>
          <p className="text-gray-600 mt-1">
            Track and manage employee attendance
          </p>
        </div>

        {/* View Controls */}
        <div className="flex flex-wrap gap-2 mt-4 lg:mt-0">
          <select
            value={view}
            onChange={(e) => setView(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
          >
            <option value="daily">Daily View</option>
            <option value="weekly">Weekly View</option>
            <option value="monthly">Monthly View</option>
            <option value="yearly">Yearly View</option>
          </select>

          {view === 'daily' && (
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
          )}
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {stats.present}
          </div>
          <div className="text-sm text-green-600">Present</div>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-600">{stats.absent}</div>
          <div className="text-sm text-red-600">Absent</div>
        </div>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {stats.halfDay}
          </div>
          <div className="text-sm text-yellow-600">Half Day</div>
        </div>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">{stats.leave}</div>
          <div className="text-sm text-blue-600">Leave</div>
        </div>
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-gray-600">{stats.total}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Attendance Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              {!employeeId && (
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                  Employee
                </th>
              )}
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Date
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Check In
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Check Out
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Hours
              </th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {attendanceData.length === 0 ? (
              <tr>
                <td
                  colSpan={employeeId ? 6 : 7}
                  className="px-4 py-8 text-center text-gray-500"
                >
                  No attendance records found for the selected period
                </td>
              </tr>
            ) : (
              attendanceData.map((record) => (
                <tr
                  key={record.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  {!employeeId && (
                    <td className="px-4 py-3">
                      <div>
                        <div className="font-medium text-gray-900">
                          {record.employee?.name || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">
                          {record.employee?.role} •{' '}
                          {record.employee?.department}
                        </div>
                      </div>
                    </td>
                  )}
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatDate(record.date)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(record.status)}`}
                    >
                      {getStatusIcon(record.status)}
                      {record.status.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatTime(record.checkIn)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {formatTime(record.checkOut)}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {record.totalHours ? `${record.totalHours}h` : '--'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                    {record.notes || '-'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination or summary */}
      <div className="mt-4 flex justify-between items-center text-sm text-gray-600">
        <div>Showing {attendanceData.length} records</div>
        <div className="flex items-center gap-2">
          <Filter size={16} />
          <span>{view.charAt(0).toUpperCase() + view.slice(1)} View</span>
        </div>
      </div>
    </div>
  );
};

export default AttendanceRecords;
