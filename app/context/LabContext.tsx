// //app/context/LabContext.tsx
// 'use client';

// import { supabase } from '@/utils/supabase/client';
// import {
//     createContext,
//     useEffect,
//     useState,
//     ReactNode,
//     Dispatch,
//     SetStateAction,
// } from 'react';

// // Define the shape of your context
// interface LabContextType {
//     labId: string | null;
//     labData: any;
//     bookingData: any[];
//     userData: any;
//     patients: any[];
//     setLabId?: Dispatch<SetStateAction<string | null>>;
//     setLabData?: Dispatch<SetStateAction<any>>;
//     setBookingData?: Dispatch<SetStateAction<any[]>>;
//     setUserData?: Dispatch<SetStateAction<any>>;
//     setPatients?: Dispatch<SetStateAction<any[]>>;
// }

// // Default value
// export const LabContext = createContext<LabContextType | null>(null);

// // Props for provider
// interface LabProviderProps {
//     children: ReactNode;
// }

// export const LabProvider = ({ children }: LabProviderProps) => {

//     const [labId, setLabId] = useState<string | null>(null);
//     const [labData, setLabData] = useState<any>(null);
//     const [bookingData, setBookingData] = useState<any[]>([]);
//     const [userData, setUserData] = useState<any>(null);
//     const [patients, setPatients] = useState<any[]>([]); // New state for patients

//     useEffect(() => {
//         async function fetchUser() {
//             const {
//                 data: { user },
//             } = await supabase.auth.getUser();

//             if (user) {
//                 const { data, error } = await supabase
//                     .from('users')
//                     .select('firstName, lastName, email, phone')
//                     .eq('id', user.id)
//                     .single();

//                 if (error) {
//                     console.error('Error fetching user:', error.message);
//                 } else if (data) {
//                     setUserData(data);
//                 }
//             }
//         }

//         fetchUser();
//     }, []);

//     useEffect(() => {
//         async function fetchLabId() {
//             const {
//                 data: { user },
//             } = await supabase.auth.getUser();

//             if (user) {
//                 const { data, error } = await supabase
//                     .from('labs')
//                     .select('id')
//                     .eq('userId', user.id)
//                     .single();

//                 if (error) {
//                     console.error('Error fetching labId:', error.message);
//                 } else if (data) {
//                     setLabId(data.id);
//                 }
//             }
//         }

//         fetchLabId();
//     }, []);

//     useEffect(() => {
//         async function fetchLabData() {
//             if (!labId) return;

//             const { data, error } = await supabase
//                 .from('lab_details')
//                 .select('*')
//                 .eq('labId', labId)
//                 .maybeSingle();

//             if (error) {
//                 console.error('Error fetching lab data:', error);
//                 return;
//             }

//             if (data) {
//                 setLabData(data);
//             } else {
//                 console.warn('No lab details found for labId:', labId);
//             }
//         }

//         fetchLabData();
//     }, [labId]);

//     useEffect(() => {
//         const fetchbookingData = async () => {
//             try {
//                 if (labId) {
//                     const { data, error } = await supabase
//                         .from('bookings')
//                         .select(
//                             `*, 
//               patientId(address, firstName, lastName, dateOfBirth, phone, gender), 
//               booking_tests(testId(name)),
//               booking_addons(addons(name))`
//                         )
//                         .eq('labId', labId);

//                     if (error) {
//                         console.error('Error fetching bookings:', error.message);
//                     } else {
//                         console.log('Fetched bookings with addons:', data);
//                         setBookingData(data || []);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Unexpected error:', error);
//             }
//         };

//         fetchbookingData();
//     }, [labId]);

//     useEffect(() => {
//         const fetchPatients = async () => {
//             try {
//                 if (labId) {
//                     const { data, error } = await supabase
//                         .from('patients')
//                         .select(`
//                         id,
//                         firstName,
//                         lastName,
//                         age,
//                         gender,
//                         phone,
//                         address,
//                         bookings!inner(labId)
//                     `)
//                         .eq('bookings.labId', labId);

//                     if (error) {
//                         console.error('Error fetching patients:', error.message);
//                     } else {
//                         console.log('Fetched patients:', data);
//                         setPatients(data || []);
//                     }
//                 }
//             } catch (error) {
//                 console.error('Unexpected error:', error);
//             }
//         };

//         fetchPatients();
//     }, [labId]);

//     return (
//         <LabContext.Provider value={{ labData, labId, bookingData, userData, patients }}>
//             {children}
//         </LabContext.Provider>
//     );
// };





// 'use client';

// import { supabase } from '@/utils/supabase/client';
// import {
//   createContext,
//   useEffect,
//   useState,
//   ReactNode,
//   Dispatch,
//   SetStateAction,
// } from 'react';

// interface LabContextType {
//   labId: string | null;
//   labData: any;
//   bookingData: any[];
//   userData: any;
//   patients: any[];
//   loading: boolean;
//   error: string | null;
//   setLabId?: Dispatch<SetStateAction<string | null>>;
//   setLabData?: Dispatch<SetStateAction<any>>;
//   setBookingData?: Dispatch<SetStateAction<any[]>>;
//   setUserData?: Dispatch<SetStateAction<any>>;
//   setPatients?: Dispatch<SetStateAction<any[]>>;
// }

// export const LabContext = createContext<LabContextType | null>(null);

// interface LabProviderProps {
//   children: ReactNode;
// }

// export const LabProvider = ({ children }: LabProviderProps) => {
//   const [labId, setLabId] = useState<string | null>(null);
//   const [labData, setLabData] = useState<any>(null);
//   const [bookingData, setBookingData] = useState<any[]>([]);
//   const [userData, setUserData] = useState<any>(null);
//   const [patients, setPatients] = useState<any[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       setLoading(true);
//       try {
//         const { data: { user } } = await supabase.auth.getUser();
//         if (!user) throw new Error('User not found');

//         // Fetch user details
//         const { data: userDetails, error: userError } = await supabase
//           .from('users')
//           .select('firstName, lastName, email, phone')
//           .eq('id', user.id)
//           .single();

//         if (userError) throw userError;
//         setUserData(userDetails);

//         // Fetch labId
//         const { data: labRes, error: labError } = await supabase
//           .from('labs')
//           .select('id')
//           .eq('userId', user.id)
//           .single();

//         if (labError) throw labError;
//         setLabId(labRes?.id || null);

//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || 'Failed to fetch user/lab data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   useEffect(() => {
//     if (!labId) return;

//     const fetchLabData = async () => {
//       setLoading(true);
//       try {
//         const { data, error: labDataError } = await supabase
//           .from('lab_details')
//           .select('*')
//           .eq('labId', labId)
//           .maybeSingle();

//         if (labDataError) throw labDataError;
//         setLabData(data || null);

//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || 'Failed to fetch lab data');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchLabData();
//   }, [labId]);

//   useEffect(() => {
//     if (!labId) return;

//     const fetchBookings = async () => {
//       setLoading(true);
//       try {
//         const { data, error: bookingError } = await supabase
//           .from('bookings')
//           .select(
//             `*, 
//              patientId(address, firstName, lastName, dateOfBirth, phone, gender), 
//              booking_tests(testId(name)),
//              booking_addons(addons(name))`
//           )
//           .eq('labId', labId);

//         if (bookingError) throw bookingError;
//         setBookingData(data || []);
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || 'Failed to fetch bookings');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchBookings();
//   }, [labId]);

//   useEffect(() => {
//     if (!labId) return;

//     const fetchPatients = async () => {
//       setLoading(true);
//       try {
//         const { data, error: patientError } = await supabase
//           .from('patients')
//           .select(`
//             id,
//             firstName,
//             lastName,
//             age,
//             gender,
//             phone,
//             address,
//             bookings!inner(labId)
//           `)
//           .eq('bookings.labId', labId);

//         if (patientError) throw patientError;
//         setPatients(data || []);
//       } catch (err: any) {
//         console.error(err);
//         setError(err.message || 'Failed to fetch patients');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchPatients();
//   }, [labId]);

//   return (
//     <LabContext.Provider
//       value={{
//         labData,
//         labId,
//         bookingData,
//         userData,
//         patients,
//         loading,
//         error,
//       }}
//     >
//       {children}
//     </LabContext.Provider>
//   );
// };





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

interface LabContextType {
  labId: string | null;
  labData: any;
  bookingData: any[];
  userData: any;
  patients: any[];
  loading: boolean;
  error: string | null;
  setLabId?: Dispatch<SetStateAction<string | null>>;
  setLabData?: Dispatch<SetStateAction<any>>;
  setBookingData?: Dispatch<SetStateAction<any[]>>;
  setUserData?: Dispatch<SetStateAction<any>>;
  setPatients?: Dispatch<SetStateAction<any[]>>;
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // --- 1. Get current user ---
        const { data: { user }, error: userAuthError } = await supabase.auth.getUser();
        if (userAuthError || !user) throw new Error('User not found');

        // --- 2. User details ---
        const { data: userDetails, error: userError } = await supabase
          .from('users')
          .select('firstName, lastName, email, phone')
          .eq('id', user.id)
          .single();

        if (userError) throw userError;
        setUserData(userDetails);

        // --- 3. Lab Id ---
        const { data: labRes, error: labError } = await supabase
          .from('labs')
          .select('id')
          .eq('userId', user.id)
          .single();

        if (labError) throw labError;
        const currentLabId = labRes?.id || null;
        setLabId(currentLabId);

        if (!currentLabId) return;

        // --- 4. Lab Details ---
        const { data: labDetails, error: labDetailsError } = await supabase
          .from('lab_details')
          .select('*')
          .eq('labId', currentLabId)
          .maybeSingle();

        if (labDetailsError) throw labDetailsError;
        setLabData(labDetails || null);

        // --- 5. Bookings ---
        const { data: bookings, error: bookingError } = await supabase
          .from('bookings')
          .select(
            `*, 
             patientId(address, firstName, lastName, dateOfBirth, phone, gender), 
             booking_tests(testId(name)),
             booking_addons(addons(name))`
          )
          .eq('labId', currentLabId);

        if (bookingError) throw bookingError;
        setBookingData(bookings || []);

        // --- 6. Patients ---
        const { data: patientsRes, error: patientError } = await supabase
          .from('patients')
          .select(`
            id,
            firstName,
            lastName,
            age,
            gender,
            phone,
            address,
            bookings!inner(labId)
          `)
          .eq('bookings.labId', currentLabId);

        if (patientError) throw patientError;
        setPatients(patientsRes || []);

      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong while fetching data');
      } finally {
        setLoading(false); // only once at the end
      }
    };

    fetchAllData();
  }, []);

  return (
    <LabContext.Provider
      value={{
        labData,
        labId,
        bookingData,
        userData,
        patients,
        loading,
        error,
      }}
    >
      {children}
    </LabContext.Provider>
  );
};

