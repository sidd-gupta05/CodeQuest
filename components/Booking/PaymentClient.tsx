'use client';

import { useState, useEffect } from 'react';
import Script from 'next/script';
import { CreditCard } from 'lucide-react';

interface PaymentClientProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: any;
  appointmentDate: string; 
  appointmentTime: string; 
  selectedTests: string[];
  selectedAddons: string[];
  patientDetails: any;
  user: any;
  totalAmount: number;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentClient({
  onBack,
  onNext,
  selectedLab,
  appointmentDate, 
  appointmentTime, 
  selectedTests,
  selectedAddons,
  patientDetails,
  user,
  totalAmount,
}: PaymentClientProps) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);

  useEffect(() => {
    // Load Razorpay script dynamically
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => setRazorpayLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is still loading. Please try again in a moment.');
      return;
    }

    setPaymentLoading(true);

    try {
      const formatDateForPostgres = (dateStr: string, timeStr: string) => {
        try {
          const [day, month, year] = dateStr.split('/');
          return `${year}-${month}-${day} ${timeStr}:00`;
        } catch (error) {
          console.error('Error formatting date:', error);
          // Fallback to current date
          return new Date().toISOString().replace('T', ' ').substring(0, 19);
        }
      };

      const formattedDate = formatDateForPostgres(
        appointmentDate,
        appointmentTime
      );
      // First create the booking
      const bookingResponse = await fetch('/api/bookings/create-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: user.id,
          labId: selectedLab.id,
          timeSlotId: selectedLab.timeSlotId,
          date: formattedDate, 
          status: 'PENDING',
          totalAmount: totalAmount,
          selectedTests: selectedTests,
          selectedAddons: selectedAddons,
          patientDetails: patientDetails,
          qrCodeData: '',
        }),
      });

      const bookingData = await bookingResponse.json();
      if (!bookingData.success) throw new Error(bookingData.error);

      const bookingId = bookingData.bookingId;

      // Create Razorpay order
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            bookingId: bookingId,
            patientId: user.id,
            tests: selectedTests.join(', '),
            addons: selectedAddons.join(', '),
            labId: selectedLab.id,
          },
        }),
      });

      const orderData = await orderResponse.json();
      if (orderData.error) throw new Error(orderData.details);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'LabSphere',
        description: 'Lab Tests Payment',
        image: '/logo.svg',
        order_id: orderData.id,
        handler: async function (response: any) {
          // Verify payment
          const verificationResponse = await fetch(
            '/api/razorpay/verify-payment',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpayPaymentId: response.razorpay_payment_id,
                razorpayOrderId: response.razorpay_order_id,
                razorpaySignature: response.razorpay_signature,
              }),
            }
          );

          const verificationData = await verificationResponse.json();

          if (verificationData.success) {
            // Create payment record in database (only with fields that exist in schema)
            const paymentResponse = await fetch(
              '/api/bookings/create-payment',
              {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  bookingId: bookingId,
                  status: 'success',
                  amount: totalAmount,
                  paidAt: new Date().toISOString(),
                }),
              }
            );

            const paymentData = await paymentResponse.json();
            if (paymentData.success) {
              onNext(); // Redirect to confirmation
            } else {
              alert('Payment record creation failed. Please contact support.');
            }
          } else {
            alert('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: `${patientDetails.firstName} ${patientDetails.lastName}`,
          email: patientDetails.email || user.email,
          contact: patientDetails.phone || '',
        },
        theme: {
          color: '#37AFA2',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="beforeInteractive"
      />

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
        <button
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 bg-[#37AFA2] text-white rounded-lg font-medium hover:bg-[#2d9a8d] transition-colors cursor-pointer"
        >
          Back
        </button>

        <button
          onClick={handlePayment}
          disabled={paymentLoading}
          className="flex items-center gap-2 px-6 py-3 bg-[#37AFA2] text-white rounded-lg font-medium hover:bg-[#2d9a8d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {paymentLoading ? (
            'Processing...'
          ) : (
            <>
              <CreditCard className="w-5 h-5" />
              Pay Now
            </>
          )}
        </button>
      </div>
    </>
  );
}
