// components/Lab/report/POSReport.tsx
import React from 'react';
import { Printer, Download, CreditCard, Banknote } from 'lucide-react';

interface POSReportProps {
  patient: any;
  booking: any;
  customization: any;
}

export const POSReport = ({
  patient,
  booking,
  customization,
}: POSReportProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const calculateAge = (dateOfBirth: string) => {
    const dob = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const monthDiff = today.getMonth() - dob.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  // Calculate totals
  const calculateSubtotal = () => {
    const testsTotal =
      booking.tests?.reduce(
        (sum: number, test: any) => sum + (test.price || 0),
        0
      ) || 0;
    const addonsTotal =
      booking.addons?.reduce(
        (sum: number, addon: any) => sum + (addon.price || 0),
        0
      ) || 0;
    return testsTotal + addonsTotal;
  };

  const calculateTax = (subtotal: number) => {
    return subtotal * 0.18; // 18% GST
  };

  const calculateTotal = (subtotal: number, tax: number) => {
    return subtotal + tax;
  };

  const subtotal = calculateSubtotal();
  const tax = calculateTax(subtotal);
  const total = calculateTotal(subtotal, tax);

  return (
    <div
      className="page-break print:min-h-[297mm] font-inter"
      style={{ minHeight: '297mm' }}
    >
      {/* POS Header */}
      <div
        className="p-6 border-b-2 print:p-4"
        style={{ backgroundColor: customization.headerColor }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            {customization.labLogo && (
              <img
                src={customization.labLogo}
                alt="Lab Logo"
                className="h-20 w-20 object-contain bg-white rounded-lg p-2 shadow print:h-14 print:w-14"
              />
            )}
            <div>
              <h1 className="text-4xl font-bold text-white mb-0.5 print:text-xl leading-tight">
                {customization.labName}
              </h1>
              <p className="text-white/90 text-sm print:text-xs leading-tight">
                {customization.labAddress}
              </p>
            </div>
          </div>

          <div className="text-right text-white">
            <h2 className="text-xl font-bold mb-1 print:text-lg leading-tight">
              BILL / RECEIPT
            </h2>
            <div className="space-y-0.5">
              <p className="text-sm print:text-xs">
                Bill No:{' '}
                <span className="font-mono font-bold">{`BILL-${Date.now().toString(36).toUpperCase()}`}</span>
              </p>
              <p className="text-sm print:text-xs">
                Date:{' '}
                <span className="font-medium">
                  {formatDate(new Date().toISOString())}
                </span>
              </p>
              <div className="mt-2 flex items-center justify-end space-x-1 print:mt-1">
                <span className="text-white/80 text-xs print:text-xs leading-tight">
                  Powered by LabSphere
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Patient Info for POS */}
      <div className="p-6 print:p-4 border-b">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-bold text-gray-800 mb-2 text-sm">BILL TO:</h3>
            <div className="space-y-1">
              <p className="font-semibold text-gray-800">
                {patient.firstName} {patient.lastName}
              </p>
              <p className="text-gray-600 text-xs">
                Age: {patient.age || calculateAge(patient.dateOfBirth) || 'N/A'}{' '}
                | Gender: {patient.gender || 'N/A'}
              </p>
              <p className="text-gray-600 text-xs">
                Phone: {patient.phone || 'N/A'}
              </p>
              {patient.address && (
                <p className="text-gray-600 text-xs">
                  Address: {patient.address}
                </p>
              )}
            </div>
          </div>

          <div className="text-right">
            <h3 className="font-bold text-gray-800 mb-2 text-sm">
              BILL DETAILS:
            </h3>
            <div className="space-y-1">
              <p className="text-gray-600 text-xs">
                Patient ID:{' '}
                <span className="font-mono font-medium">{patient.id}</span>
              </p>
              <p className="text-gray-600 text-xs">
                Booking ID:{' '}
                <span className="font-mono font-medium">{booking.id}</span>
              </p>
              <p className="text-gray-600 text-xs">
                Referred By: {booking.referredBy || booking.doctorName || 'N/A'}
              </p>
              <p className="text-gray-600 text-xs">
                Collection Date: {formatDate(booking.date)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="p-6 print:p-4">
        <h3 className="font-bold text-gray-800 mb-4 text-base border-b pb-2">
          SERVICES & CHARGES DETAIL
        </h3>

        {/* Tests Table - Simplified for better readability */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h4
              className="font-semibold text-gray-700 text-sm"
              style={{ color: customization.accentColor }}
            >
              LABORATORY TESTS
            </h4>
            <div className="text-xs text-gray-500">
              {booking.tests?.length || 0} item(s)
            </div>
          </div>

          <div className="overflow-x-auto border rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 text-sm print:text-xs">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider w-2/3">
                    Test Name
                  </th>
                  {/* <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
                    Code
                  </th>
                  <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
                    Category
                  </th> */}
                  <th className="px-4 py-3 text-right font-medium text-gray-700 uppercase tracking-wider w-1/3">
                    Amount (₹)
                  </th>
                  {/* <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
                    Status
                  </th> */}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {booking.tests?.map((test: any, index: number) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                  >
                    <td className="px-4 py-3 text-gray-800 font-medium">
                      {test.name}
                    </td>
                    {/* <td className="px-3 py-2 text-gray-600">
                      {test.code || 'N/A'}
                    </td>
                    <td className="px-3 py-2 text-gray-600">
                      {test.category || 'General'}
                    </td> */}
                    <td className="px-4 py-3 text-gray-900 font-semibold text-right">
                      ₹{test.price?.toFixed(2) || '0.00'}
                    </td>
                    {/* <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {test.status || 'Completed'}
                      </span>
                    </td> */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Services - Improved alignment */}
        {booking.addons && booking.addons.length > 0 && (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h4
                className="font-semibold text-gray-700 text-sm"
                style={{ color: customization.accentColor }}
              >
                ADDITIONAL SERVICES
              </h4>
              <div className="text-xs text-gray-500">
                {booking.addons?.length || 0} item(s)
              </div>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="min-w-full divide-y divide-gray-200 text-sm print:text-xs">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider w-1/2">
                      Service Name
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider w-1/4">
                      Description
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700 uppercase tracking-wider w-1/4">
                      Amount (₹)
                    </th>
                    {/* <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th> */}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {booking.addons?.map((addon: any, index: number) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {addon.name}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {addon.description || 'Additional Service'}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-semibold text-right">
                        ₹{addon.price?.toFixed(2) || '0.00'}
                      </td>
                      {/* <td className="px-3 py-2">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {addon.status || 'Completed'}
                        </span>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Summary */}
        <div className="border-t pt-4 mt-6">
          <div className="max-w-sm ml-auto">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">GST (18%):</span>
                <span className="font-semibold">₹{tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-base font-bold border-t pt-2 mt-2">
                <span>Total Amount:</span>
                <span className="text-lg">₹{total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold text-gray-700 mb-3 text-sm">
            PAYMENT INFORMATION
          </h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-gray-600 text-xs mb-1">Payment Method:</p>
              <div className="flex items-center space-x-2">
                {/* <Banknote className="w-4 h-4 text-green-600" /> */}
                <span className="font-medium">Cash</span>
              </div>
            </div>
            <div>
              <p className="text-gray-600 text-xs mb-1">Transaction ID:</p>
              <p className="font-mono text-sm">
                TXN{Date.now().toString(36).toUpperCase()}
              </p>
            </div>
          </div>
        </div>

        {/* Terms & Conditions */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="font-semibold text-gray-700 mb-2 text-sm">
            TERMS & CONDITIONS
          </h4>
          <ul className="text-xs text-gray-600 space-y-1">
            <li className="flex items-start">
              <span className="text-gray-400 mr-1">•</span>
              This is a computer generated receipt
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-1">•</span>
              All payments are non-refundable
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-1">•</span>
              Prices inclusive of all taxes
            </li>
            <li className="flex items-start">
              <span className="text-gray-400 mr-1">•</span>
              Report will be delivered as per schedule
            </li>
          </ul>
        </div>

        {/* Cashier Signature */}
        <div className="mt-8 pt-4 border-t">
          <div className="flex justify-between items-end">
            <div className="text-center">
              <div className="mb-2 border-t-2 pt-2 mx-auto max-w-xs">
                <div className="h-12 mb-1 flex items-center justify-center">
                  <div className="w-32 h-px bg-gray-400"></div>
                </div>
                <p className="font-semibold text-gray-700 text-xs">
                  Cashier Signature
                </p>
                <p className="text-gray-600 text-xs">Authorized Personnel</p>
              </div>
            </div>

            <div className="text-right">
              <div className="p-2 border border-gray-300 bg-white rounded inline-block">
                <div className="h-20 w-20 bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-500 text-xs text-center leading-tight">
                    STAMP
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t">
          <p className="text-xs text-gray-500">
            For any billing queries, contact: {customization.labPhone} |{' '}
            {customization.labEmail}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            Thank you for choosing {customization.labName}
          </p>
        </div>
      </div>
    </div>
  );
};
