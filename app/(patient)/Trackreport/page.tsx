import React from 'react';
import LabTestTracker from '@/components/LabTestTracker';

const Trackreport = () => {
  return (
    <>
      <main
        className="min-h-screen flex flex-col text-white"
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #91D8C1 15%, #FFF 70% )',
        }}
      >
        <div>
          <LabTestTracker />
        </div>
      </main>
    </>
  );
};

export default Trackreport;
