// components/Lab/revenue/SalesHeader.tsx
import React from 'react';
import { Download, Loader2, Lock } from 'lucide-react';
import Swal from 'sweetalert2';

interface SalesHeaderProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  exportToPDF: () => void;
  isDownloading: boolean;
  bookingData: any[];
  labNablCertificate: string;
}

const SalesHeader: React.FC<SalesHeaderProps> = ({
  selectedYear,
  setSelectedYear,
  exportToPDF,
  isDownloading,
  bookingData,
  labNablCertificate,
}) => {
  const handleExportClick = async () => {
    if (!labNablCertificate) {
      await Swal.fire({
        title: 'Certificate Missing',
        html: `
          <div class="text-center">
            <div class="mb-3">
              <div class="inline-flex items-center justify-center w-12 h-12 bg-amber-100 rounded-full">
                <svg class="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p class="text-gray-700 mb-1">NABL certificate not found</p>
            <p class="text-gray-600 text-sm">Contact your system administrator</p>
          </div>
        `,
        confirmButtonText: 'Understood',
        confirmButtonColor: '#f59e0b',
        background: '#f8fafc',
        color: '#1f2937',
        customClass: {
          popup: 'rounded-xl border border-gray-200 shadow-2xl',
          confirmButton: 'px-6 py-2.5 rounded-lg font-medium text-sm',
        },
      });
      return;
    }

    const result = await Swal.fire({
      title: 'Create Secure Report',
      html: `
        <div class="text-left space-y-4">
          <div class="flex items-start space-x-3">
            <div class="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
              <svg class="w-3 h-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div class="flex-1">
              <p class="text-sm font-medium text-gray-900 mb-1">Document Security</p>
              <ul class="text-xs text-gray-600 space-y-1">
                <li>PDF encrypted with NABL certificate</li>
                <li>Password required for access</li>
                <li>Printing and copying restrictions applied</li>
              </ul>
            </div>
          </div>
          
          <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-3">
            <div class="flex items-center space-x-2 mb-1">
              <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              <p class="text-sm font-semibold text-blue-800">Access Password Required</p>
            </div>
            <p class="text-xs text-blue-700">Your lab NABL certificate number opens this file</p>
          </div>
        </div>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Generate Secure PDF',
      cancelButtonText: 'Cancel Export',
      confirmButtonColor: '#006A6A',
      cancelButtonColor: '#6b7280',
      background: '#f8fafc',
      color: '#1f2937',
      customClass: {
        popup: 'rounded-xl border border-gray-200 shadow-2xl max-w-md',
        confirmButton: 'px-6 py-2.5 rounded-lg font-medium text-sm',
        cancelButton: 'px-6 py-2.5 rounded-lg font-medium text-sm',
      },
      reverseButtons: true,
    });

    if (result.isConfirmed) {
      exportToPDF();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Financial Overview
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="border border-gray-300 rounded-lg px-3 h-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#006A6A] focus:border-transparent"
          >
            {[
              ...new Set([
                selectedYear,
                ...(bookingData || [])
                  .filter((b) => b?.date)
                  .map((b) => new Date(b.date).getFullYear()),
              ]),
            ]
              .sort((a, b) => a - b)
              .map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
          </select>

          <button
            onClick={handleExportClick}
            className="flex items-center gap-2 px-4 h-10 bg-gradient-to-r from-[#006A6A] to-[#005A5A] text-white rounded-lg hover:from-[#005A5A] hover:to-[#004A4A] transition-all duration-200 shadow-sm hover:shadow disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed"
            disabled={isDownloading || !labNablCertificate}
            title={
              !labNablCertificate ? 'Lab NABL certificate not available' : ''
            }
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="font-medium">Creating PDF...</span>
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" />
                <span className="font-medium">Export Secure PDF</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SalesHeader;
