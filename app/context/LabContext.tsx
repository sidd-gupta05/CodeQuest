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
  setLabId?: Dispatch<SetStateAction<string | null>>;
  setLabData?: Dispatch<SetStateAction<any>>;
  setBookingData?: Dispatch<SetStateAction<any[]>>;
  setUserData?: Dispatch<SetStateAction<any>>;
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

  return (
    <LabContext.Provider value={{ labData, labId, bookingData, userData }}>
      {children}
    </LabContext.Provider>
  );
};
