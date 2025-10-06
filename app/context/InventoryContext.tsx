// app/context/InventoryContext.tsx
'use client';

import { supabase } from '@/utils/supabase/client';
import { se } from 'date-fns/locale';
import {
  createContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';

// Types based on your schema
interface ReagentCatalog {
  id: string;
  name: string;
  category?: string;
  description?: string;
  manufacturer?: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
}

interface CustomReagent {
  id: string;
  labId: string;
  name: string;
  category?: string;
  description?: string;
  manufacturer?: string;
  unit: string;
  createdAt: string;
  updatedAt: string;
  expiryDate?: string;
  quantity?: number;
  reorderThreshold?: number;
}

interface LabInventory {
  id: string;
  labId: string;
  reagentId?: string;
  customReagentId?: string;
  quantity: number;
  unit: string;
  expiryDate?: string;
  reorderThreshold?: number;
  createdAt: string;
  updatedAt: string;
  batchNumber?: string;
  ReagentCatalog?: ReagentCatalog;
  CustomReagent?: CustomReagent;
}

interface TestReagent {
  reagentId: string;
  quantityPerTest: number;
  unit: string;
  ReagentCatalog?: ReagentCatalog;
}

interface Test {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  duration?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  TestReagent: TestReagent[];
}

interface InventoryContextType {
  labId: string | null;
  inventory: LabInventory[];
  customReagents: CustomReagent[];
  testCatalog: Test[];
  reagentCatalog: ReagentCatalog[];
  loading: boolean;
  error: string | null;
  // fetchData: () => Promise<void>;
  setLabId: Dispatch<SetStateAction<string | null>>;
  setInventory: Dispatch<SetStateAction<LabInventory[]>>;
  setCustomReagents: Dispatch<SetStateAction<CustomReagent[]>>;
  setTestCatalog: Dispatch<SetStateAction<Test[]>>;
  setReagentCatalog: Dispatch<SetStateAction<ReagentCatalog[]>>;
}

export const InventoryContext = createContext<InventoryContextType | null>(null);

interface InventoryProviderProps {
  children: ReactNode;
}

export const InventoryProvider = ({ children }: InventoryProviderProps) => {
  const [labId, setLabId] = useState<string | null>(null);
  const [inventory, setInventory] = useState<LabInventory[]>([]);
  const [customReagents, setCustomReagents] = useState<CustomReagent[]>([]);
  const [testCatalog, setTestCatalog] = useState<Test[]>([]);
  const [reagentCatalog, setReagentCatalog] = useState<ReagentCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    const initializeLab = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user }, error: userAuthError } = await supabase.auth.getUser();
        if (userAuthError || !user) throw new Error('User not found');

        // Get lab ID for the current user
        const { data: labRes, error: labError } = await supabase
          .from('labs')
          .select('id')
          .eq('userId', user.id)
          .single();

        if (labError) throw labError;
        
        const currentLabId = labRes?.id || null;
        setLabId(currentLabId);

      } catch (err: any) {
        console.error('Error initializing lab:', err);
        setError(err.message || 'Failed to initialize lab');
      } finally {
        setLoading(false);
      }
    };

    initializeLab();
  }, []);

  // Fetch data when labId changes
  useEffect(() => {
      const fetchData = async () => {
    if (!labId) return;
    
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [inventoryRes, customReagentsRes, testsRes, reagentsRes] = await Promise.all([
        fetch(`/api/lab/${labId}/inventory`),
        fetch(`/api/lab/${labId}/custom-reagents`),
        fetch(`/api/lab/${labId}/tests`),
        fetch('/api/reagents/')
      ]);

      if (inventoryRes.ok) setInventory(await inventoryRes.json());
      if (customReagentsRes.ok) setCustomReagents(await customReagentsRes.json());
      if (testsRes.ok) setTestCatalog(await testsRes.json());
      if (reagentsRes.ok) setReagentCatalog(await reagentsRes.json());

    } catch (err: any) {
      console.error('Error fetching inventory data:', err);
      setError(err.message || 'Failed to fetch inventory data');
    } finally {
      setLoading(false);
    }
  };
    if (labId) {
      fetchData();
    }
  }, [labId]);

  // Realtime subscriptions for inventory changes
  useEffect(() => {
    if (!labId) return;

    const inventoryChannel = supabase
      .channel('inventory-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'lab_inventory' },
        async (payload) => {
          console.log('Realtime inventory change:', payload);
          // await fetchData();
          const { data: inventoryData, error } = await supabase
            .from('lab_inventory')
            .select(
              `*, 
              ReagentCatalog(*), 
              CustomReagent(*)`
            )
            .eq('labId', labId)
            .order('createdAt', { ascending: false });
            
            if (!error) {
              if (inventoryData) setInventory(inventoryData);
            }
        }
      )
      .subscribe();

    const customReagentsChannel = supabase
      .channel('custom-reagents-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'custom_reagents' },
        async (payload) => {
          console.log('Realtime custom reagent change:', payload);
          // await fetchData();

            const { data: customReagentsData, error } = await supabase
              .from('custom_reagents')
              .select('*')
              .eq('labId', labId)
              .order('createdAt', { ascending: false });
          if (!error)  setCustomReagents(customReagentsData);
        }
      )
      .subscribe();

    const testsChannel = supabase
      .channel('tests-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'tests' },
        async (payload) => {
          console.log('Realtime test change:', payload);
          // await fetchData();
            const { data: testsData, error } = await supabase
              .from('tests')
              .select(
                `*, 
                TestReagent(*, ReagentCatalog(*))`
              )
              .eq('labId', labId)
              .order('createdAt', { ascending: false });
          if (!error) setTestCatalog(testsData || []);
          
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(inventoryChannel);
      supabase.removeChannel(customReagentsChannel);
      supabase.removeChannel(testsChannel);
    };
  }, [labId]);

  const contextValue: InventoryContextType = {
    labId,
    inventory,
    customReagents,
    testCatalog,
    reagentCatalog,
    loading,
    error,
    setLabId,
    setInventory,
    setCustomReagents,
    setTestCatalog,
    setReagentCatalog,
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
};

// Custom hook to use the inventory context
export const useInventory = () => {
  const context = useContext(InventoryContext);
  if (!context) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
};