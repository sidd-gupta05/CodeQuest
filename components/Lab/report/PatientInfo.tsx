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
      <h3 className="text-lg font-semibold mb-4 text-gray-800 print:text-base">
        PATIENT INFORMATION
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm print:text-xs">
        <div>
          <label className="font-medium text-gray-600 block mb-1">
            Patient Name
          </label>
          <p className="text-gray-800 font-semibold">
            {patient.firstName} {patient.lastName}
          </p>
        </div>

        <div>
          <label className="font-medium text-gray-600 block mb-1">
            Age/Gender
          </label>
          <p className="text-gray-800">
            {patient.age || calculateAge(patient.dateOfBirth) || 'N/A'} /{' '}
            {patient.gender || 'N/A'}
          </p>
        </div>

        <div>
          <label className="font-medium text-gray-600 block mb-1">
            Patient ID
          </label>
          <p className="text-gray-800 font-mono">{patient.id}</p>
        </div>

        <div>
          <label className="font-medium text-gray-600 block mb-1">Phone</label>
          <p className="text-gray-800">{patient.phone || 'N/A'}</p>
        </div>

        <div>
          <label className="font-medium text-gray-600 block mb-1">
            Collection Date
          </label>
          <p className="text-gray-800">{formatDate(booking.date)}</p>
        </div>

        <div>
          <label className="font-medium text-gray-600 block mb-1">
            Report Date
          </label>
          <p className="text-gray-800">
            {formatDate(new Date().toISOString())}
          </p>
        </div>

        <div>
          <label className="font-medium text-gray-600 block mb-1">
            Booking ID
          </label>
          <p className="text-gray-800 font-mono">{booking.bookingId}</p>
        </div>

        <div>
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
        </div>
      </div>

      {patient.address && (
        <div className="mt-4">
          <label className="font-medium text-gray-600 block mb-1">
            Address
          </label>
          <p className="text-gray-800 text-sm">{patient.address}</p>
        </div>
      )}
    </div>
  );
};
