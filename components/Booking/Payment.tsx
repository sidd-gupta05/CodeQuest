import BookingHeader from './BookingHeader';
import PaymentClient from './PaymentClient';

interface PaymentProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: any;
  appointmentDate: string;
  appointmentTime: string;
  selectedTests: string[];
  selectedAddons: string[];
  patientDetails: any;
  user: any;
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
  user,
}: PaymentProps) {
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

        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <h4 className="font-semibold text-gray-800 mb-2">Patient Details</h4>
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

      <PaymentClient
        onBack={onBack}
        onNext={onNext}
        selectedLab={selectedLab}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
        selectedTests={selectedTests}
        selectedAddons={selectedAddons}
        patientDetails={patientDetails}
        user={user}
        totalAmount={totalAmount}
      />
    </div>
  );
}
