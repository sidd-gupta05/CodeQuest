import Footer from '@/components/footer';
import Navbar from '@/components/navbar';
import React from 'react';

export default function Layout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
    <div className="flex flex-col text-white h-full"
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
        }}>

            <Navbar />
          <main>{children}</main>

    </div>
    </>
  );
}
