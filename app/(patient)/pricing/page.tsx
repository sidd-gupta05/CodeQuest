import React from 'react';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';

const Pricing = () => {
  return (
    <>
      <main
        className={`min-h-screen flex flex-col text-white $`}
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
        }}
      >
        <Navbar />
      </main>

      <Footer />
    </>
  );
};

export default Pricing;
