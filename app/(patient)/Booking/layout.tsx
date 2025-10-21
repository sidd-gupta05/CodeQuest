import React from 'react';
import Script from 'next/script';

const BookingLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      {children}
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />
    </>
  );
};

export default BookingLayout;
