// app/context/ReportContext.tsx
'use client';

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';

export interface ReportCustomization {
  labName: string;
  labLogo: string;
  labAddress: string;
  labPhone: string;
  labEmail: string;
  headerColor: string;
  accentColor: string;
  showWatermark: boolean;
  includeQRCode: boolean;
  template: 'standard' | 'premium' | 'minimal';
  footerText: string;
  includeInterpretation: boolean;
  includeComments: boolean;
  pageSize: 'a4' | 'letter';
  fontSize: 'small' | 'medium' | 'large';
  printMargins: 'narrow' | 'normal' | 'wide';
}

interface ReportContextType {
  customization: ReportCustomization;
  updateCustomization: (updates: Partial<ReportCustomization>) => void;
  saveCustomization: () => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  generateReport: (patientId: string, bookingId: string) => Promise<any>;
  previewMode: boolean;
  setPreviewMode: (mode: boolean) => void;
}

const defaultCustomization: ReportCustomization = {
  labName: 'Your Lab Name',
  labLogo: '',
  labAddress: 'Lab Address Here',
  labPhone: '+1 234 567 890',
  labEmail: 'contact@lab.com',
  headerColor: '#3B82F6',
  accentColor: '#10B981',
  showWatermark: true,
  includeQRCode: true,
  template: 'standard',
  footerText:
    'This report is generated electronically and valid without signature',
  includeInterpretation: true,
  includeComments: true,
  pageSize: 'a4',
  fontSize: 'medium',
  printMargins: 'normal',
};

export const ReportContext = createContext<ReportContextType | undefined>(
  undefined
);

export const ReportProvider = ({ children }: { children: ReactNode }) => {
  const [customization, setCustomization] =
    useState<ReportCustomization>(defaultCustomization);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState(false);

  useEffect(() => {
    loadCustomization();
  }, []);

  const loadCustomization = async () => {
    try {
      const response = await fetch('/api/report-customization');
      if (response.ok) {
        const data = await response.json();
        if (data.customization?.settings) {
          setCustomization({
            ...defaultCustomization,
            ...data.customization.settings,
          });
        }
      }
    } catch (error) {
      console.error('Error loading customization:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateCustomization = (updates: Partial<ReportCustomization>) => {
    setCustomization((prev) => ({ ...prev, ...updates }));
  };

  const saveCustomization = async (): Promise<{
    success: boolean;
    message: string;
  }> => {
    try {
      const response = await fetch('/api/report-customization', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: customization }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to save customization');
      }

      return {
        success: true,
        message: data.message || 'Customization saved successfully!',
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || 'Error saving customization',
      };
    }
  };

  const generateReport = async (patientId: string, bookingId: string) => {
    try {
      const response = await fetch('/api/reports/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ patientId, bookingId }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate report');
      }
      return data;
    } catch (error: any) {
      return { error: error.message || 'Error generating report' };
    }
  };

  return (
    <ReportContext.Provider
      value={{
        customization,
        updateCustomization,
        saveCustomization,
        loading,
        generateReport,
        previewMode,
        setPreviewMode,
      }}
    >
      {children}
    </ReportContext.Provider>
  );
};

export const useReport = () => {
  const context = useContext(ReportContext);
  if (context === undefined) {
    throw new Error('useReport must be used within a ReportProvider');
  }
  return context;
};
