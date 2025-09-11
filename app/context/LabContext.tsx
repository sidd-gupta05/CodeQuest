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

// Define the shape of your context
interface LabContextType {
    labId: string | null;
    labData: any;
    bookingData: any[];
    userData: any;
    patients: any[];
    setLabId?: Dispatch<SetStateAction<string | null>>;
    setLabData?: Dispatch<SetStateAction<any>>;
    setBookingData?: Dispatch<SetStateAction<any[]>>;
    setUserData?: Dispatch<SetStateAction<any>>;
    setPatients?: Dispatch<SetStateAction<any[]>>;
}

// Default value
export const LabContext = createContext<LabContextType | null>(null);

// Props for provider
interface LabProviderProps {
    children: ReactNode;
}

export const LabProvider = ({ children }: LabProviderProps) => {
    const [labId, setLabId] = useState<string | null>(null);
    const [labData, setLabData] = useState<any>(null);
    const [bookingData, setBookingData] = useState<any[]>([]);
    const [userData, setUserData] = useState<any>(null);
    const [patients, setPatients] = useState<any[]>([]); // New state for patients

    useEffect(() => {
        async function fetchUser() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const { data, error } = await supabase
                    .from('users')
                    .select('firstName, lastName, email, phone')
                    .eq('id', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching user:', error.message);
                } else if (data) {
                    setUserData(data);
                }
            }
        }

        fetchUser();
    }, []);

    useEffect(() => {
        async function fetchLabId() {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (user) {
                const { data, error } = await supabase
                    .from('labs')
                    .select('id')
                    .eq('userId', user.id)
                    .single();

                if (error) {
                    console.error('Error fetching labId:', error.message);
                } else if (data) {
                    setLabId(data.id);
                }
            }
        }

        fetchLabId();
    }, []);

    useEffect(() => {
        async function fetchLabData() {
            if (!labId) return;

            const { data, error } = await supabase
                .from('lab_details')
                .select('*')
                .eq('labId', labId)
                .maybeSingle();

            if (error) {
                console.error('Error fetching lab data:', error);
                return;
            }

            if (data) {
                setLabData(data);
            } else {
                console.warn('No lab details found for labId:', labId);
            }
        }

        fetchLabData();
    }, [labId]);

    useEffect(() => {
        const fetchbookingData = async () => {
            try {
                if (labId) {
                    const { data, error } = await supabase
                        .from('bookings')
                        .select(
                            `*, 
              patientId(address, userId(firstName, lastName)), 
              booking_tests(testId(name)),
              booking_addons(addons(name))`
                        )
                        .eq('labId', labId);

                    if (error) {
                        console.error('Error fetching bookings:', error.message);
                    } else {
                        console.log('Fetched bookings with addons:', data);
                        setBookingData(data || []);
                    }
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        fetchbookingData();
    }, [labId]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                if (labId) {
                    const { data, error } = await supabase
                        .from('bookings')
                        .select(
                            `patient:patients(id, address, user:userId (id, firstName, lastName, email, phone))`
                        )
                        .eq('labId', labId);

                    if (error) {
                        console.error('Error fetching patients:', error.message);
                    } else {
                        // Deduplicate patients by ID
                        const uniquePatientsMap: Record<string, any> = {};
                        data?.forEach((b: any) => {
                            if (b.patient && !uniquePatientsMap[b.patient.id]) {
                                uniquePatientsMap[b.patient.id] = b.patient;
                            }
                        });
                        const uniquePatients = Object.values(uniquePatientsMap);

                        // console.log('Fetched patients:', uniquePatients);
                        setPatients(uniquePatients);
                    }
                }
            } catch (error) {
                console.error('Unexpected error:', error);
            }
        };

        fetchPatients();
    }, [labId]);

    return (
        <LabContext.Provider value={{ labData, labId, bookingData, userData, patients }}>
            {children}
        </LabContext.Provider>
    );
};
