// components/Booking/Payment.tsx
import { useState, useEffect } from 'react';
import BookingHeader from './BookingHeader';
import BookingNavigation from './BookingNavigation';
import Script from 'next/script';

interface PaymentProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: any;
  appointmentDate: string;
  appointmentTime: string;
  selectedTests: string[];
  selectedAddons: string[];
  patientDetails: any;
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function Payment({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
  selectedTests,
  selectedAddons,
  patientDetails,
}: PaymentProps) {
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

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

  const calculateTotal = () => {
    const testCost = selectedTests.length * 500;
    const addonCost = selectedAddons.reduce((total, addon) => {
      if (addon === 'Express Delivery') return total + 500;
      if (addon === 'Superfast Delivery') return total + 350;
      return total + 200;
    }, 0);
    return testCost + addonCost;
  };

  const totalAmount = calculateTotal();

  const handlePayment = async () => {
    if (!razorpayLoaded) {
      alert('Payment gateway is still loading. Please try again in a moment.');
      return;
    }

    setPaymentLoading(true);

    try {
      // Create order on server
      const response = await fetch('/api/razorpay/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100, // Razorpay expects amount in paise
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
          notes: {
            patientId: patientDetails.id,
            tests: selectedTests.join(', '),
            addons: selectedAddons.join(', '),
            labId: selectedLab.id,
          },
        }),
      });

      const orderData = await response.json();
      if (orderData.error) throw new Error(orderData.details);

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Your Healthcare App',
        description: 'Lab Tests Payment',
        image: '/logo.svg',
        order_id: orderData.id,
        handler: async function (response: any) {
          const verificationResponse = await fetch(
            '/api/razorpay/verify-payment',
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
                amount: orderData.amount,
              }),
            }
          );

          const verificationData = await verificationResponse.json();
          if (verificationData.success) {
            setPaymentSuccess(true);
          } else {
            alert('Payment verification failed. Please try again.');
          }
        },
        prefill: {
          name: `${patientDetails.firstName} ${patientDetails.lastName}`,
          email: patientDetails.email || '',
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

      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
        <BookingHeader
          selectedLab={selectedLab}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
        />

        <div className="border-b border-gray-200 my-6"></div>

        <div className="mb-6">
          <h3 className="font-bold text-gray-800 text-lg mb-4">
            Order Summary
          </h3>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              Patient Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <p>
                <span className="text-gray-600">Name:</span>{' '}
                {patientDetails.firstName} {patientDetails.lastName}
              </p>
              <p>
                <span className="text-gray-600">Gender:</span>{' '}
                {patientDetails.gender}
              </p>
              <p>
                <span className="text-gray-600">Age:</span> {patientDetails.age}
              </p>
              <p>
                <span className="text-gray-600">Address:</span>{' '}
                {patientDetails.address}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Selected Tests</h4>
            <ul className="list-disc list-inside pl-4">
              {selectedTests.map((test, index) => (
                <li key={index} className="text-gray-700">
                  {test} <span className="font-semibold">(₹500)</span>
                </li>
              ))}
            </ul>
          </div>

          {selectedAddons.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Selected Add-ons
              </h4>
              <ul className="list-disc list-inside pl-4">
                {selectedAddons.map((addon, index) => {
                  let price = 200;
                  if (addon === 'Express Delivery') price = 500;
                  if (addon === 'Superfast Delivery') price = 350;
                  return (
                    <li key={index} className="text-gray-700">
                      {addon} <span className="font-semibold">(₹{price})</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">₹{totalAmount}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total:</span>
              <span className="font-bold text-lg text-[#37AFA2]">
                ₹{totalAmount}
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-3 bg-gray-200 text-gray-800 rounded-lg font-medium hover:bg-gray-300 transition-colors"
          >
            Back
          </button>

          <div className="flex gap-4">
            {!paymentSuccess && (
              <button
                onClick={handlePayment}
                disabled={paymentLoading}
                className="px-4 py-3 bg-[#37AFA2] text-white rounded-lg font-medium hover:bg-[#2d9a8d] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {paymentLoading ? 'Processing...' : 'Pay Now'}
              </button>
            )}

            {paymentSuccess && (
              <button
                onClick={onNext}
                className="px-6 py-3 bg-[#37AFA2] text-white rounded-lg font-medium hover:bg-[#2d9a8d] transition-colors"
              >
                Proceed to Confirmation
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
