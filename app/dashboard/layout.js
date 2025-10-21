// //app/dashboard/layout.js
// 'use client';

// import { useState } from 'react';
// import { LabProvider } from '../context/LabContext';
// import AsideNavbar from '@/components/Lab/AsideNavbar';

// const DashboardLayout = ({ children }) => {
//   const [isNavOpen, setIsNavOpen] = useState(false);

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       <LabProvider>
//         <AsideNavbar
//           isOpen={isNavOpen}
//           onToggle={() => setIsNavOpen(!isNavOpen)}
//         />
//         <main className="flex-1 md:ml-64">{children}</main>
//       </LabProvider>
//     </div>
//   );
// };

// export default DashboardLayout;

'use client';

import { useState, useContext } from 'react';
import { LabProvider, LabContext } from '../context/LabContext';
import AsideNavbar from '@/components/Lab/AsideNavbar';
import Image from 'next/image';

const DashboardLayoutContent = ({ children }) => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const contextData = useContext(LabContext);
  const loading = contextData?.loading;

  console.log('isLoading :', loading);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="flex flex-col justify-center items-center my-auto">
          <div className="w-20 h-20 mx-auto">
            <Image
              src="/dash-loading.gif"
              alt="Loading..."
              width={80}
              height={80}
            />
          </div>
          <div className="mt-2 text-center text-slate-700 font-semibold">
            Setting up your dashboard . . .
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AsideNavbar
        isOpen={isNavOpen}
        onToggle={() => setIsNavOpen(!isNavOpen)}
      />
      <main className="flex-1 md:ml-64">{children}</main>
    </div>
  );
};

const DashboardLayout = ({ children }) => {
  return (
    <LabProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </LabProvider>
  );
};

export default DashboardLayout;
