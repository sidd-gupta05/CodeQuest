// components/Lab/PatientList.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { Eye, Download, Search } from 'lucide-react';

export type Patient = {
  id: string;
  address?: string;
  age?: number | null;
  firstName?: string;
  lastName?: string;
  gender?: string;
  phone?: string | null;
};

interface PatientListProps {
  patients: Patient[];
}

const PatientList: React.FC<PatientListProps> = ({ patients }) => {
  const [search, setSearch] = useState('');

  // Filtered patients
  const filteredPatients = useMemo(() => {
    if (!search.trim()) return patients;

    const lowerSearch = search.toLowerCase();
    return patients.filter((p) => {
      const fullName = `${p.firstName || ''} ${p.lastName || ''}`.toLowerCase();
      return (
        p.id.toLowerCase().includes(lowerSearch) ||
        fullName.includes(lowerSearch) ||
        (p.phone?.toLowerCase().includes(lowerSearch) ?? false)
      );
    });
  }, [patients, search]);

  if (!patients || patients.length === 0) {
    return <div className="text-gray-500 text-sm">No patients found !</div>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
      {/* Search Bar */}
      <div className="flex items-center border-b border-gray-200 px-4 py-3 bg-slate-100">
        <Search className="w-5 h-5 text-gray-400 mr-2" />
        <input
          type="text"
          placeholder="Search by name, phone or ID"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border-0 bg-transparent outline-none border-none focus:outline-nonefocus:ring-0 text-sm text-gray-700 placeholder-gray-400"
        />
      </div>

      {/* Desktop View */}
      <div className="hidden md:block">
        <ul className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => {
            const fullName =
              `${patient.firstName || ''} ${patient.lastName || ''}`.trim() ||
              'Unknown';
            const patientAddress = patient.address || '-';
            const patientPhone = patient.phone || '-';
            const patientId = patient.id;
            const patientAge = patient.age || '-';
            const patientGender = patient.gender || '-';

            return (
              <li
                key={patient.id}
                className="px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition"
              >
                <div className="flex-1 flex items-center space-x-6">
                  <p className="w-32 text-sm text-gray-900">{fullName}</p>
                  <p className="w-48 text-sm font-medium text-gray-900">
                    {patientId}
                  </p>
                  <p className="w-56 text-sm text-gray-500">{patientAddress}</p>
                  <p className="w-32 text-sm text-gray-500">{patientPhone}</p>
                  {/* <p className="w-16 text-sm text-gray-500">{patientAge}</p> */}
                  <p className="w-12 text-sm text-gray-500">{patientGender}</p>
                </div>
                <div className="flex space-x-3">
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <Eye className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        <ul className="divide-y divide-gray-200">
          {filteredPatients.map((patient) => {
            const fullName =
              `${patient.firstName || ''} ${patient.lastName || ''}`.trim() ||
              'Unknown';
            const patientAddress = patient.address || '-';
            const patientPhone = patient.phone || '-';
            const patientId = patient.id;
            const patientAge = patient.age || '-';
            const patientGender = patient.gender || '-';

            return (
              <li
                key={patient.id}
                className="px-4 py-4 flex flex-col space-y-1 bg-white rounded-lg shadow-sm mb-2"
              >
                <p className="text-xs text-gray-500 font-semibold">Name</p>
                <p className="text-sm text-gray-900">{fullName}</p>

                <p className="text-xs text-gray-500 font-semibold">
                  Patient ID
                </p>
                <p className="text-sm font-medium text-gray-900">{patientId}</p>

                <p className="text-xs text-gray-500 font-semibold">Address</p>
                <p className="text-sm text-gray-500">{patientAddress}</p>

                {/* <p className="text-xs text-gray-500 font-semibold">Age</p>
                <p className="text-sm text-gray-500">{patientAge}</p>

                <p className="text-xs text-gray-500 font-semibold">Gender</p>
                <p className="text-sm text-gray-500">{patientGender}</p> */}

                <p className="text-xs text-gray-500 font-semibold">Phone</p>
                <p className="text-sm text-gray-500">{patientPhone}</p>

                <div className="flex space-x-2 mt-2">
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <Eye className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 transition">
                    <Download className="w-4 h-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default PatientList;
