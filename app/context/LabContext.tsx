//app/context/LabContext.tsx
'use client';

import { supabase } from '@/utils/supabase/client';
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from 'react';

interface AttendanceRecord {
  id: string;
  employeeId: string;
  labId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  status: string;
  totalHours: number | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

interface LabContextType {
  labId: string | null;
  labData: any;
  bookingData: any[];
  employeeData: any[];
  userData: any;
  patients: any[];
  attendanceData: AttendanceRecord[];
  loading: boolean;
  error: string | null;
  setLabId?: Dispatch<SetStateAction<string | null>>;
  setLabData?: Dispatch<SetStateAction<any>>;
  setBookingData?: Dispatch<SetStateAction<any[]>>;
  setUserData?: Dispatch<SetStateAction<any>>;
  setPatients?: Dispatch<SetStateAction<any[]>>;
  setEmployeeData?: Dispatch<SetStateAction<any[]>>;
  setAttendanceData?: Dispatch<SetStateAction<AttendanceRecord[]>>;
}

export const LabContext = createContext<LabContextType | null>(null);

interface LabProviderProps {
  children: ReactNode;
}

export const LabProvider = ({ children }: LabProviderProps) => {
  const [labId, setLabId] = useState<string | null>(null);
  const [labData, setLabData] = useState<any>(null);
  const [bookingData, setBookingData] = useState<any[]>([]);
  const [userData, setUserData] = useState<any>(null);
  const [patients, setPatients] = useState<any[]>([]);
  const [employeeData, setEmployeeData] = useState<any[]>([]);
  const [attendanceData, setAttendanceData] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Get current user
        const {
          data: { user },
          error: userAuthError,
        } = await supabase.auth.getUser();
        if (userAuthError || !user) throw new Error('User not found');

        // 2. User details
        const { data: userDetails } = await supabase
          .from('users')
          .select('firstName, lastName, email, phone')
          .eq('id', user.id)
          .single();
        setUserData(userDetails);

        // 3. Lab Id
        const { data: labRes } = await supabase
          .from('labs')
          .select('id')
          .eq('userId', user.id)
          .single();
        const currentLabId = labRes?.id || null;
        setLabId(currentLabId);
        if (!currentLabId) return;

        // 4. Lab Details
        const { data: labDetails } = await supabase
          .from('lab_details')
          .select('*')
          .eq('labId', currentLabId)
          .maybeSingle();
        setLabData(labDetails || null);

        // 5. Bookings
        const { data: bookings } = await supabase
          .from('bookings')
          .select(
            `*, 
             patientId(address, firstName, lastName, dateOfBirth, phone, gender), 
             booking_tests(testId(name)),
             booking_addons(addons(name)),
             allocatedEmpId(id, name)`
          )
          .eq('labId', currentLabId);
        setBookingData(bookings || []);

        // 6. Patients
        const { data: patientsRes } = await supabase
          .from('patients')
          .select(
            `
            id,
            firstName,
            lastName,
            age,
            gender,
            phone,
            address,
            bookings!inner(labId)
          `
          )
          .eq('bookings.labId', currentLabId);
        setPatients(patientsRes || []);

        // 7. Employees
        const { data: employees } = await supabase
          .from('employee')
          .select(
            'id, name, role, monthlySalary, department, isFieldCollector, createdAt, updatedAt'
          )
          .eq('labId', currentLabId)
          .order('createdAt', { ascending: false });

        setEmployeeData(employees || []);

        // 8. Attendance Data (Last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data: attendances } = await supabase
          .from('attendances')
          .select('*')
          .eq('labId', currentLabId)
          .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
          .order('date', { ascending: false });

        setAttendanceData(attendances || []);
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Realtime subscriptions
  useEffect(() => {
    if (!labId) return;

    const employeeChannel = supabase
      .channel('employee-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'employee' },
        async (payload) => {
          console.log('Realtime employee change:', payload);

          // Refetch full employees list for this lab
          const { data: employees, error } = await supabase
            .from('employee')
            .select('*')
            .eq('labId', labId)
            .order('createdAt', { ascending: false });

          if (!error) {
            setEmployeeData(employees || []);
          } else {
            console.error('Error refetching employees:', error);
          }
        }
      )
      .subscribe();

    const bookingChannel = supabase
      .channel('booking-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'bookings' },
        async (payload) => {
          console.log('Realtime booking change:', payload);

          const { data: bookings, error } = await supabase
            .from('bookings')
            .select(
              `*, 
             patientId(address, firstName, lastName, dateOfBirth, phone, gender), 
             booking_tests(testId(name)),
             booking_addons(addons(name)),
             allocatedEmpId(id, name)`
            )
            .eq('labId', labId);

          if (!error) {
            setBookingData(bookings || []);
          } else {
            console.error('Error refetching bookings:', error);
          }
        }
      )
      .subscribe();

    const attendanceChannel = supabase
      .channel('attendance-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'attendances' },
        async (payload) => {
          console.log('Realtime attendance change:', payload);

          // Refetch attendance data for last 30 days
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

          const { data: attendances, error } = await supabase
            .from('attendances')
            .select('*')
            .eq('labId', labId)
            .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
            .order('date', { ascending: false });

          if (!error) {
            setAttendanceData(attendances || []);
          } else {
            console.error('Error refetching attendance:', error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(employeeChannel);
      supabase.removeChannel(bookingChannel);
      supabase.removeChannel(attendanceChannel);
    };
  }, [labId]);

  // Helper function to get today's attendance for an employee
  const getTodayAttendanceForEmployee = (employeeId: string) => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceData.find(
      (attendance) =>
        attendance.employeeId === employeeId && attendance.date === today
    );
  };

  // Helper function to get employee attendance history
  const getEmployeeAttendanceHistory = (employeeId: string) => {
    return attendanceData.filter(
      (attendance) => attendance.employeeId === employeeId
    );
  };

  // Helper function to get today's overall attendance summary
  const getTodayAttendanceSummary = () => {
    const today = new Date().toISOString().split('T')[0];
    const todayAttendances = attendanceData.filter(
      (attendance) => attendance.date === today
    );

    const present = todayAttendances.filter(
      (att) => att.status === 'PRESENT' || (att.checkIn && !att.checkOut)
    ).length;

    const absent = todayAttendances.filter(
      (att) => att.status === 'ABSENT'
    ).length;

    const completed = todayAttendances.filter(
      (att) => att.checkIn && att.checkOut
    ).length;

    return {
      present,
      absent,
      completed,
      total: employeeData.length,
      notMarked: employeeData.length - todayAttendances.length,
    };
  };

  const contextValue: LabContextType = {
    labId,
    labData,
    bookingData,
    employeeData,
    userData,
    patients,
    attendanceData,
    loading,
    error,
    setLabId,
    setLabData,
    setBookingData,
    setUserData,
    setPatients,
    setEmployeeData,
    setAttendanceData,
    // Add helper functions to context if needed
    // getTodayAttendanceForEmployee,
    // getEmployeeAttendanceHistory,
    // getTodayAttendanceSummary
  };

  return (
    <LabContext.Provider value={contextValue}>{children}</LabContext.Provider>
  );
};
