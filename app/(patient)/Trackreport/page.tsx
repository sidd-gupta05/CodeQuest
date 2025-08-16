import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LabTestTracker from '@/components/LabTestTracker';
const Trackreport = () => {
  return (
    <>
      <main
        className="min-h-screen flex flex-col text-white $"
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #91D8C1 24.01%, #FFF 100% )',
        }}
      >
        <Navbar />
        <div className="px-4 py-8">
          <LabTestTracker />
        </div>
      </main>

      <Footer />
    </>
  );
};

export default Trackreport;
