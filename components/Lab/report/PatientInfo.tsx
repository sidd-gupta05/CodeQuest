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
    <div className="p-4 border-b print:p-3 font-inter">
      {/* <h3 className="text-base font-semibold mb-4 text-gray-800 print:text-sm">
        PATIENT INFORMATION
      </h3> */}

      <div className="flex flex-row justify-between">
        {/* First Section - Patient Details */}
        <div className="flex-1 pr-4 space-y-0.5 ">
          {/* Patient Name */}
          <div>
            <p className="text-gray-800 font-bold text-2xl leading-tight">
              {patient.firstName} {patient.lastName}
            </p>
          </div>

          <div className="">
            {/* Age / Gender */}
            <div>
              <span className="font-medium text-gray-600 text-xs">
                Age / Gender :{' '}
              </span>
              <span className="text-gray-800 text-xs">
                {patient.age || calculateAge(patient.dateOfBirth) || 'N/A'} /{' '}
                {patient.gender || 'N/A'}
              </span>
            </div>

            {/* Referred By */}
            <div>
              <span className="font-medium text-gray-600 text-xs">
                Referred By :{' '}
              </span>
              <span className="text-gray-800 text-xs">
                {booking.referredBy || booking.doctorName || 'N/A'}
              </span>
            </div>

            {/* Phone */}
            {/* <div>
              <span className="font-medium text-gray-600 text-xs">
                Phone :{' '}
              </span>
              <span className="text-gray-800 text-xs">
                {patient.phone || 'N/A'}
              </span>
            </div> */}

            {/* Patient ID */}
            <div>
              <span className="font-medium text-gray-600 text-xs">
                Patient ID :{' '}
              </span>
              <span className="text-gray-800 text-xs font-mono leading-tight">
                {patient.id}
              </span>
            </div>

            {/* Address */}
            {patient.address && (
              <div>
                <span className="font-medium text-gray-600 text-xs">
                  Address :{' '}
                </span>
                <span className="text-gray-800 text-xs">{patient.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="w-px bg-gray-300 mx-1" />

        {/* Second Section - Barcode & Dates */}
        <div className="flex-1 px-4 flex flex-col items-center">
          {/* Barcode Placeholder */}
          <div className="mb-4 p-2 border border-gray-300 bg-white rounded">
            <div className="h-14 w-40 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-xs font-mono leading-tight">
                BARCODE PLACEHOLDER
              </span>
            </div>
          </div>

          <div className="space-y-1 w-full">
            {/* Collection Date */}
            <div className="text-center">
              <span className="font-medium text-gray-600 text-xs">
                Collection Date :{' '}
              </span>
              <span className="text-gray-800 text-xs">
                {formatDate(booking.date)}
              </span>
            </div>

            {/* Report Date */}
            <div className="text-center">
              <span className="font-medium text-gray-600 text-xs">
                Report Date :{' '}
              </span>
              <span className="text-gray-800 text-xs">
                {formatDate(new Date().toISOString())}
              </span>
            </div>
          </div>
        </div>

        {/* Vertical Separator */}
        <div className="w-px bg-gray-300 mx-1" />

        {/* Third Section - QR Code */}
        <div className="flex-1 pl-4 flex flex-col items-center justify-center">
          <div className="p-2 border border-gray-300 bg-white rounded">
            <div className="h-28 w-28 bg-gray-100 flex items-center justify-center">
              <span className="text-gray-500 text-xs text-center leading-tight">
                QR CODE
                <br />
                PLACEHOLDER
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
