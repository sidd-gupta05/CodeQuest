//components/Lab/report/LabReport.tsx
'use client';

import { useReport } from '@/app/context/ReportContext';
import { LabContext } from '@/app/context/LabContext';
import { useContext, useEffect, useState, useRef } from 'react';
import { ReportHeader } from './ReportHeader';
import { PatientInfo } from './PatientInfo';
import { TestResults } from './TestResults';
import { ReportFooter } from './ReportFooter';
import { BackPage } from './BackPage';
import { Download, Printer, RefreshCw } from 'lucide-react';

interface LabReportProps {
  patientId: string;
  bookingId: string;
}

const LabReport = ({ patientId, bookingId }: LabReportProps) => {
  const { customization, generateReport } = useReport();
  const labContext = useContext(LabContext);
  const [reportData, setReportData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await generateReport(patientId, bookingId);
        setReportData(data.report);
      } catch (error) {
        console.error('Error loading report data:', error);
        setError('Failed to generate report');
      } finally {
        setLoading(false);
      }
    };

    if (patientId && bookingId) {
      loadReportData();
    }
  }, [patientId, bookingId, generateReport]);

  const handlePrint = () => {
    // Create a clean version of the report for printing
    const reportElement = reportRef.current;
    if (!reportElement) return;

    // Create a clone of the report element
    const printContent = reportElement.cloneNode(true) as HTMLElement;

    // Remove any elements with no-print class
    const noPrintElements = printContent.querySelectorAll('.no-print');
    noPrintElements.forEach((el) => el.remove());

    // Add print-specific styles
    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 15mm;
        }
        body {
          margin: 0;
          padding: 0;
          background: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        .print-container {
          width: 210mm;
          min-height: 297mm;
          margin: 0 auto;
          background: white;
        }
        .page-break {
          page-break-after: always;
          break-after: page;
        }
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        .shadow-lg {
          box-shadow: none !important;
        }
        .bg-gradient-to-br {
          background: linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%) !important;
        }
      }
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      // Fallback to browser print
      window.print();
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laboratory Report - ${reportData?.patient?.firstName} ${reportData?.patient?.lastName}</title>
          <meta charset="utf-8">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
        </head>
        <body class="bg-white">
          <div class="print-container">
            ${printContent.outerHTML}
          </div>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
              }, 500);
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    try {
      // For now, we'll use the print functionality as PDF generation is complex
      // In a production environment, you would use a server-side PDF generation service
      const reportElement = reportRef.current;
      if (!reportElement) return;

      // Create a print-friendly version
      const printContent = reportElement.cloneNode(true) as HTMLElement;
      const noPrintElements = printContent.querySelectorAll('.no-print');
      noPrintElements.forEach((el) => el.remove());

      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        alert('Please allow popups to download PDF');
        return;
      }

      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Laboratory Report - ${reportData?.patient?.firstName} ${reportData?.patient?.lastName}</title>
            <meta charset="utf-8">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <style>
              @page {
                size: A4;
                margin: 15mm;
              }
              body {
                margin: 0;
                padding: 0;
                background: white;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
              }
              .print-container {
                width: 210mm;
                min-height: 297mm;
                margin: 0 auto;
                background: white;
              }
              .page-break {
                page-break-after: always;
                break-after: page;
              }
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            </style>
          </head>
          <body class="bg-white">
            <div class="print-container">
              ${printContent.outerHTML}
            </div>
            <script>
              window.onload = function() {
                // Use browser's "Save as PDF" functionality
                window.print();
                setTimeout(() => {
                  window.close();
                }, 3000);
              };
            </script>
          </body>
        </html>
      `);

      printWindow.document.close();
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert(
        'For best PDF results, please use the "Print" button and choose "Save as PDF" in the print dialog.'
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen no-print">
        <div className="text-center">
          <RefreshCw className="animate-spin h-12 w-12 text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Generating Report...</p>
        </div>
      </div>
    );
  }

  if (error || !reportData) {
    return (
      <div className="flex justify-center items-center min-h-screen no-print">
        <div className="text-center">
          <div className="text-red-500 text-xl mb-2">⚠️</div>
          <p className="text-red-500 mb-4">
            {error || 'Failed to load report'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  const { patient, booking, testResults } = reportData;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      {/* Print Controls - Hidden during print */}
      <div className="max-w-6xl mx-auto mb-6 no-print">
        <div className="bg-white rounded-lg shadow-sm p-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800">
                Laboratory Report
              </h1>
              <p className="text-gray-600">
                Preview and print professional medical reports
              </p>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors flex items-center space-x-2"
              >
                <Download className="w-5 h-5" />
                <span>Save as PDF</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-6 py-2 bg-[#007a7a] text-white rounded-lg hover:bg-[#005a5a] transition-colors flex items-center space-x-2"
              >
                <Printer className="w-5 h-5" />
                <span>Print Report</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Report Container - A4 Size for Print */}
      <div
        ref={reportRef}
        className="max-w-[210mm] mx-auto bg-white shadow-lg print:shadow-none print:max-w-none"
        style={{
          background: 'white',
          boxShadow:
            '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        }}
      >
        {/* Front Page - Main Report */}
        <div
          className="min-h-[297mm] page-break print:min-h-[297mm]"
          style={{ minHeight: '297mm', pageBreakAfter: 'always' }}
        >
          <ReportHeader customization={customization} />
          <PatientInfo patient={patient} booking={booking} />
          <TestResults
            booking={booking}
            customization={customization}
            testResults={testResults}
          />
          <ReportFooter customization={customization} />
        </div>

        {/* Back Page - Fixed Content */}
        <div
          className="min-h-[297mm] page-break print:min-h-[297mm]"
          style={{ minHeight: '297mm' }}
        >
          <BackPage customization={customization} />
        </div>
      </div>

      {/* Global Print Styles */}
      <style jsx global>{`
        @media print {
          /* Hide everything except the report */
          body * {
            visibility: hidden;
            margin: 0 !important;
            padding: 0 !important;
          }

          .max-w-\\[210mm\\],
          .max-w-\\[210mm\\] * {
            visibility: visible;
          }

          .max-w-\\[210mm\\] {
            position: absolute !important;
            left: 50% !important;
            top: 0 !important;
            transform: translateX(-50%) !important;
            width: 210mm !important;
            max-width: none !important;
            margin: 0 auto !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
          }

          /* Remove all other content */
          .no-print,
          .no-print * {
            display: none !important;
          }

          /* Ensure proper page breaks */
          .page-break {
            page-break-after: always !important;
            break-after: page !important;
          }

          /* A4 page size */
          @page {
            size: A4;
            margin: 15mm;
          }

          /* Force background colors in print */
          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
          }

          /* Remove shadows for print */
          .shadow-lg {
            box-shadow: none !important;
          }

          /* Ensure gradients work in print */
          .bg-gradient-to-br {
            background: linear-gradient(
              135deg,
              #f0f9ff 0%,
              #f0fdf4 100%
            ) !important;
          }
        }

        /* Ensure proper sizing for screen display */
        .max-w-\\[210mm\\] {
          width: 100%;
          max-width: 210mm;
        }
      `}</style>
    </div>
  );
};

export default LabReport;
