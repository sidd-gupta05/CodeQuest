//components/Lab/revenue/SalesHeader.tsx
import React, { useState } from 'react';
import { Download, Loader2, Lock, Eye, EyeOff } from 'lucide-react';

interface SalesHeaderProps {
  selectedYear: number;
  setSelectedYear: (year: number) => void;
  exportToPDF: (password: string) => void;
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
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleExportClick = () => {
    // console.log('Lab NABL Certificate:', labNablCertificate); // Debug log
    setShowPasswordModal(true);
    setPassword('');
    setError('');
  };

  const handleSubmitPassword = () => {
    if (!password.trim()) {
      setError('Please enter your NABL certificate number');
      return;
    }

    // console.log('Entered password:', password); // Debug log
    // console.log('Expected NABL:', labNablCertificate); // Debug log

    if (
      password.trim().toLowerCase() !== labNablCertificate?.trim().toLowerCase()
    ) {
      setError('Invalid NABL certificate number. Please check and try again.');
      return;
    }

    setShowPasswordModal(false);
    exportToPDF(password);
  };

  const handleCloseModal = () => {
    setShowPasswordModal(false);
    setPassword('');
    setError('');
  };

  return (
    <>
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
              className="flex items-center gap-2 px-4 h-10 bg-[#006A6A] text-white rounded-lg hover:bg-[#005A5A] transition-colors disabled:bg-[#007A7A] disabled:cursor-not-allowed"
              disabled={isDownloading || !labNablCertificate}
              title={
                !labNablCertificate ? 'Lab NABL certificate not available' : ''
              }
            >
              {isDownloading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Securing...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Export Secure PDF
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-full">
                <Lock className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Secure PDF Export
                </h3>
                <p className="text-sm text-gray-600">
                  Enter your NABL certificate number to continue
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  NABL Certificate Number
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your lab's NABL certificate number"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#006A6A] focus:border-transparent pr-10"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleSubmitPassword();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                {error && <p className="text-red-600 text-sm mt-2">{error}</p>}
                {labNablCertificate && (
                  <p className="text-green-600 text-xs mt-2">
                    Enter the exact certificate number.
                  </p>
                )}
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={handleCloseModal}
                  className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitPassword}
                  className="flex-1 py-2 px-4 bg-[#006A6A] text-white rounded-lg hover:bg-[#005A5A] transition-colors"
                >
                  Verify & Export
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SalesHeader;
