// components/Lab/PatientList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Eye, Search, User, Phone, MapPin } from 'lucide-react';
import PatientHistoryModal from './PatientHistoryModal';

export type Booking = {
  id: string;
  bookingId: string;
  date: string;
  status: string;
  reportStatus?: string;
  reportUrl?: string;
  totalAmount: number;
  booking_tests: {
    testId: {
      name: string;
    };
  }[];
};

export type Patient = {
  id: string;
  address?: string;
  age?: number | null;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string | null;
  bookings?: Booking[];
};

interface PatientListProps {
  patients: Patient[];
}

const PatientList: React.FC<PatientListProps> = ({ patients }) => {
  const [search, setSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showHistoryModal, setShowHistoryModal] = useState(false);

  // Filtered patients - already includes ID search
  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients;

    const lowerSearch = search.toLowerCase();
    return patients.filter((p) => {
      const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
      return (
        p.id.toLowerCase().includes(lowerSearch) || // ID search
        fullName.includes(lowerSearch) || // Name search
        (p.phone?.toLowerCase().includes(lowerSearch) ?? false) // Phone search
      );
    });
  }, [patients, search]);

  const handleViewHistory = (patient: Patient) => {
    setSelectedPatient(patient);
    setShowHistoryModal(true);
  };

  const handleCloseHistoryModal = () => {
    setShowHistoryModal(false);
    setSelectedPatient(null);
  };

  if (!patients || patients.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4">
        <div className="bg-gray-100 rounded-full p-4 mb-4">
          <User className="w-8 h-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No patients found
        </h3>
        <p className="text-gray-500 text-center max-w-sm">
          There are no patients in your system yet. Patients will appear here
          once they book tests.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="bg-white px-6 py-4 border-b border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold text-gray-900">Patients</h1>
              <p className="text-gray-600 mt-1">
                Manage and view patient information and test history
              </p>
            </div>
            <div className="relative w-full sm:w-80 ">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search by name, phone or ID"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#007A7A] focus:border-[#005A5A] transition text-base"
              />
            </div>
          </div>
        </div>

        {/* Desktop View */}
        <div className="hidden lg:block">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Patient
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Phone
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Address
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Gender
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPatients.map((patient) => {
                  const fullName =
                    `${patient.firstName || ''} ${patient.lastName || ''}`.trim() ||
                    'Unknown';
                  const patientAddress = patient.address || '-';
                  const patientPhone = patient.phone || '-';
                  const patientId = patient.id;
                  const patientGender = patient.gender || '-';

                  return (
                    <tr
                      key={patient.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-10 h-10 bg-gradient-to-br from-[#007A7A] to-[#005A5A] rounded-full flex items-center justify-center">
                              <User className="w-5 h-5 text-white" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {fullName}
                            </div>
                            <div className="text-sm text-gray-500">
                              ID: {patientId}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900">
                          <Phone className="w-4 h-4 text-gray-400 mr-2" />
                          {patientPhone}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center text-sm text-gray-900 max-w-xs">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                          <span className="truncate">{patientAddress}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {patientGender}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewHistory(patient)}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50  transition"
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          View History
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile View */}
        <div className="lg:hidden">
          <div className="p-4 space-y-4">
            {filteredPatients.map((patient) => {
              const fullName =
                `${patient.firstName || ''} ${patient.lastName || ''}`.trim() ||
                'Unknown';
              const patientAddress = patient.address || '-';
              const patientPhone = patient.phone || '-';
              const patientId = patient.id;
              const patientGender = patient.gender || '-';

              return (
                <div
                  key={patient.id}
                  className="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                        <User className="w-6 h-6 text-white" />
                      </div>
                      <div className="ml-3">
                        <h3 className="text-lg font-semibold text-gray-900">
                          {fullName}
                        </h3>
                        <p className="text-sm text-gray-500">ID: {patientId}</p>
                      </div>
                    </div>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {patientGender}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <Phone className="w-4 h-4 text-gray-400 mr-2" />
                      <span>{patientPhone}</span>
                    </div>
                    <div className="flex items-start text-sm text-gray-600">
                      <MapPin className="w-4 h-4 text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                      <span className="break-words">{patientAddress}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => handleViewHistory(patient)}
                    className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Test History
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {filteredPatients.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Showing{' '}
                <span className="font-medium">{filteredPatients.length}</span>{' '}
                of <span className="font-medium">{patients.length}</span>{' '}
                patients
              </p>
              {search && (
                <button
                  onClick={() => setSearch('')}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Patient History Modal */}
      <PatientHistoryModal
        patient={selectedPatient}
        show={showHistoryModal}
        onClose={handleCloseHistoryModal}
      />
    </>
  );
};

export default PatientList;
