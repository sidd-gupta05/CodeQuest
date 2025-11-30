// app/dashboard/lab/customization/page.tsx
'use client';

import { ReportProvider } from '@/app/context/ReportContext';
import { ReportCustomization } from '@/components/Lab/customization/ReportCustomization';

const CustomizationPage = () => {
  return (
    <ReportProvider>
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Report Customization
          </h1>
          <p className="text-gray-600 mt-2">
            Customize how your lab reports appear to patients and doctors.
            Changes are reflected in real-time and saved automatically.
          </p>
        </div>

        <ReportCustomization />
      </div>
    </ReportProvider>
  );
};

export default CustomizationPage;
