//components/Lab/report/PatientInfo.tsx
export const PatientInfo = ({ patient, booking }: any) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
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

  return (
    <div className="p-6 border-b print:p-4">
      <h3 className="text-lg font-semibold mb-6 text-gray-800 print:text-base">
        PATIENT INFORMATION
      </h3>

      <div className="flex flex-row justify-between">
        {/* First Section - Patient Details */}
        <div className="flex-1 pr-6 space-y-4">
          {/* Patient Name - Keep as before */}
          <div>
            <p className="text-gray-800 font-semibold text-lg">
              {patient.firstName} {patient.lastName}
            </p>
          </div>

          <div className="space-y-4">
            {/* Age / Gender - Inline */}
            <div>
              <span className="font-medium text-gray-600 text-sm">
                Age / Gender :{' '}
              </span>
              <span className="text-gray-800 text-sm">
                {patient.age || calculateAge(patient.dateOfBirth) || 'N/A'} /{' '}
                {patient.gender || 'N/A'}
              </span>
            </div>

            {/* Referred By - Inline */}
            <div>
              <span className="font-medium text-gray-600 text-sm">
                Referred By :{' '}
              </span>
              <span className="text-gray-800 text-sm">
                {booking.referredBy || booking.doctorName || 'N/A'}
              </span>
            </div>

            {/* Phone - Inline */}
            <div>
              <span className="font-medium text-gray-600 text-sm">
                Phone :{' '}
              </span>
              <span className="text-gray-800 text-sm">
                {patient.phone || 'N/A'}
              </span>
            </div>

            {/* Patient ID - Inline */}
            <div>
              <span className="font-medium text-gray-600 text-sm">
                Patient ID :{' '}
              </span>
              <span className="text-gray-800 text-sm font-mono">
                {patient.id}
              </span>
            </div>

            {/* Address - Inline */}
            {patient.address && (
              <div>
                <span className="font-medium text-gray-600 text-sm">
                  Address :{' '}
                </span>
                <span className="text-gray-800 text-sm">{patient.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="w-px bg-gray-300 mx-2" />

        {/* Second Section - Barcode & Dates */}
        <div className="flex-1 px-6 flex flex-col items-center">
          {/* Barcode Placeholder */}
          <div className="mb-6 p-2 border border-gray-300 bg-white rounded">
            <div className="h-16 w-48 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-xs font-mono">
                BARCODE PLACEHOLDER
              </span>
            </div>
          </div>

          <div className="space-y-4 w-full">
            {/* Collection Date - Inline */}
            <div className="text-center">
              <span className="font-medium text-gray-600 text-sm">
                Collection Date :{' '}
              </span>
              <span className="text-gray-800 text-sm">
                {formatDate(booking.date)}
              </span>
            </div>

            {/* Report Date - Inline */}
            <div className="text-center">
              <span className="font-medium text-gray-600 text-sm">
                Report Date :{' '}
              </span>
              <span className="text-gray-800 text-sm">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="w-px bg-gray-300 mx-2" />

        {/* Third Section - QR Code */}
        <div className="flex-1 pl-6 flex flex-col items-center justify-center">
          <div className="p-2 border border-gray-300 bg-white rounded">
            <div className="h-32 w-32 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-xs text-center">
                QR CODE
                <br />
                PLACEHOLDER
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Section - Keep commented part as is */}
      {/* <div>
          <label className="font-medium text-gray-600 block mb-1">
            Booking ID
          </label>
          <p className="text-gray-800 font-mono">{booking.bookingId}</p>
        </div> */}

      {/* <div>
          <label className="font-medium text-gray-600 block mb-1">Status</label>
          <span
            className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              booking.reportStatus === 'COMPLETED'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}
          >
            {booking.reportStatus || 'Completed'}
          </span>
        </div> */}
    </div>
  );
};
