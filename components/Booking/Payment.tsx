// 'use client';

// import { useState } from 'react';
// import BookingHeader from './BookingHeader';
// import BookingNavigation from './BookingNavigation';

// interface PaymentProps {
//   onBack: () => void;
//   onNext: () => void;
//   selectedLab: any;
//   appointmentDate: string;
//   appointmentTime: string;
//   selectedTests: string[];
//   selectedAddons: string[];
//   patientDetails: any;
// }

// export default function Payment({
//   onBack,
//   onNext,
//   selectedLab,
//   appointmentDate,
//   appointmentTime,
//   selectedTests,
//   selectedAddons,
//   patientDetails,
// }: PaymentProps) {
//   const [paymentLoading, setPaymentLoading] = useState(false);

//   const calculateTotal = () => {
//     const testCost = selectedTests.length * 500;
//     const addonCost = selectedAddons.reduce((total, addon) => {
//       if (addon === 'Express Delivery') return total + 500;
//       if (addon === 'Superfast Delivery') return total + 350;
//       return total + 200;
//     }, 0);
//     return testCost + addonCost;
//   };

//   const totalAmount = calculateTotal();

//   const handleProceedWithoutPayment = () => {
//     onNext();
//   };

//   return (
//     <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
//       <BookingHeader
//         selectedLab={selectedLab}
//         appointmentDate={appointmentDate}
//         appointmentTime={appointmentTime}
//       />

//       <div className="border-b border-gray-200 my-6"></div>

//       <div className="mb-6">
//         <h3 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h3>

//         <div className="bg-gray-50 rounded-lg p-4 mb-4">
//           <h4 className="font-semibold text-gray-800 mb-2">Patient Details</h4>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
//             <p>
//               <span className="text-gray-600">Name:</span>{' '}
//               {patientDetails.firstName} {patientDetails.lastName}
//             </p>
//             <p>
//               <span className="text-gray-600">Gender:</span>{' '}
//               {patientDetails.gender}
//             </p>
//             <p>
//               <span className="text-gray-600">Age:</span> {patientDetails.age}
//             </p>
//             <p>
//               <span className="text-gray-600">Address:</span>{' '}
//               {patientDetails.address}
//             </p>
//           </div>
//         </div>

//         <div className="bg-gray-50 rounded-lg p-4 mb-4">
//           <h4 className="font-semibold text-gray-800 mb-2">Selected Tests</h4>
//           <ul className="list-disc list-inside pl-4">
//             {selectedTests.map((test, index) => (
//               <li key={index} className="text-gray-700">
//                 {test} <span className="font-semibold">(₹500)</span>
//               </li>
//             ))}
//           </ul>
//         </div>

//         {selectedAddons.length > 0 && (
//           <div className="bg-gray-50 rounded-lg p-4 mb-4">
//             <h4 className="font-semibold text-gray-800 mb-2">
//               Selected Add-ons
//             </h4>
//             <ul className="list-disc list-inside pl-4">
//               {selectedAddons.map((addon, index) => {
//                 let price = 200;
//                 if (addon === 'Express Delivery') price = 500;
//                 if (addon === 'Superfast Delivery') price = 350;
//                 return (
//                   <li key={index} className="text-gray-700">
//                     {addon} <span className="font-semibold">(₹{price})</span>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>
//         )}

//         <div className="bg-gray-50 rounded-lg p-4">
//           <div className="flex justify-between items-center border-b border-gray-200 pb-2 mb-2">
//             <span className="text-gray-600">Subtotal:</span>
//             <span className="font-semibold">₹{totalAmount}</span>
//           </div>
//           <div className="flex justify-between items-center">
//             <span className="text-gray-600">Total:</span>
//             <span className="font-bold text-lg text-[#37AFA2]">
//               ₹{totalAmount}
//             </span>
//           </div>
//         </div>
//       </div>

//       <BookingNavigation
//         onBack={onBack}
//         onNext={handleProceedWithoutPayment}
//         backText="Back"
//         nextText="Proceed to Confirmation"
//       />
//     </div>
//   );
// }

'use client';

import { useState } from 'react';
import BookingHeader from './BookingHeader';

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
    setPaymentLoading(true);

    try {
      const orderResponse = await fetch('/api/create-razorpay-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            labId: selectedLab.id,
            patientId: patientDetails.id,
            tests: selectedTests.join(', '),
          },
        }),
      });

      // First check if response is OK
      if (!orderResponse.ok) {
        // Try to get error message from response
        let errorMsg = 'Failed to create order';
        try {
          const errorData = await orderResponse.json();
          errorMsg = errorData.error || errorData.message || errorMsg;
        } catch (e) {
          // If we can't parse JSON, use the status text
          errorMsg = orderResponse.statusText;
        }
        throw new Error(errorMsg);
      }

      // Then try to parse JSON
      let orderData;
      try {
        orderData = await orderResponse.json();
      } catch (e) {
        throw new Error('Invalid response from server');
      }

      // Rest of your payment handling code...
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.async = true;

      script.onload = () => {
        const options = {
          key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Lab Booking System',
          description: `Booking for ${selectedTests.length} tests`,
          order_id: orderData.id,
          handler: async function (response: any) {
            const verificationResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(response),
            });

            if (!verificationResponse.ok) {
              throw new Error('Payment verification failed');
            }

            const verificationData = await verificationResponse.json();
            if (verificationData.success) {
              onNext();
            } else {
              alert('Payment verification failed');
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

        // @ts-ignore
        const rzp = new window.Razorpay(options);
        rzp.open();
      };

      document.body.appendChild(script);
    } catch (error) {
      console.error('Payment error:', error);
      alert(
        `Payment failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <BookingHeader
        selectedLab={selectedLab}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
      />

      <div className="border-b border-gray-200 my-6"></div>

      <div className="mb-6">
        <h3 className="font-bold text-gray-800 text-lg mb-4">Order Summary</h3>

        {/* Order summary content... */}

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

      <div className="flex flex-col sm:flex-row gap-4 mt-6">
        <button
          onClick={onBack}
          className="px-6 py-3 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition-colors"
        >
          Back
        </button>

        <button
          onClick={handlePayment}
          disabled={paymentLoading}
          className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
            paymentLoading
              ? 'bg-gray-300 cursor-not-allowed'
              : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
          }`}
        >
          {paymentLoading ? 'Processing...' : 'Pay Now'}
        </button>
      </div>
    </div>
  );
}
