'use client';
import React from 'react';
import Navbar from '@/components/navbar';
import LabSearch from '@/components/lab-search';
import dynamic from 'next/dynamic';
import Footer from '@/components/footer';

const MapBox = dynamic(() => import('@/components/MapContainer'), {
  ssr: false,
});

const Page = () => {
  return (
    <>
      <main
        className={`min-h-screen flex flex-col text-white $`}
        style={{
          background:
            'linear-gradient(180deg, #05303B -50%, #2B7C7E 8%, #91D8C1 16%, #F9F9F9F9 40%)',
        }}
      >
        <Navbar />

        <section className="text-center mt-10">
          <LabSearch />

          <p className="mt-10 text-gray-800 font-semibold">
            Showing 450 Doctors For You
          </p>

          <div className="relative mt-6 mx-auto max-w-5xl my-20">
            <MapBox />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-black shadow-xl rounded-xl p-4 w-64 z-10"></div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
};

export default Page;
