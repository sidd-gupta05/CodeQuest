'use client';

import { useReport } from '@/app/context/ReportContext';
import { LabContext } from '@/app/context/LabContext';
import { useContext, useEffect, useState, useRef } from 'react';
import { ReportHeader } from './ReportHeader';
import { PatientInfo } from './PatientInfo';
import { TestResults } from './TestResults';
import { ReportFooter } from './ReportFooter';
// import { BackPage } from './BackPage';
import { POSReport } from './POSReport';
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
  const [includePOS] = useState(true);
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
    const reportElement = reportRef.current;
    if (!reportElement) return;

    const printContent = reportElement.cloneNode(true) as HTMLElement;
    const noPrintElements = printContent.querySelectorAll('.no-print');
    noPrintElements.forEach((el) => el.remove());

    const style = document.createElement('style');
    style.textContent = `
      @media print {
        @page {
          size: A4;
          margin: 0mm !important;
        }
        
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
          font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        
        @page {
          margin: 0mm !important;
        }
        
        .print-container {
          width: 210mm !important;
          min-height: 297mm !important;
          margin: 0 auto !important;
          padding: 0 !important;
          background: white !important;
          box-shadow: none !important;
        }
        
        .page-break {
          page-break-after: always !important;
          break-after: page !important;
          page-break-inside: avoid !important;
        }
        
        * {
          -webkit-print-color-adjust: exact !important;
          color-adjust: exact !important;
          print-color-adjust: exact !important;
          box-shadow: none !important;
        }
        
        .shadow-lg {
          box-shadow: none !important;
        }
      }
    `;

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      document.head.appendChild(style);
      window.print();
      document.head.removeChild(style);
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laboratory Report</title>
          <meta charset="utf-8">
          <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
          <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
          <style>
            @media print {
              html, body {
                margin: 0 !important;
                padding: 0 !important;
                height: 100% !important;
                width: 100% !important;
                overflow: hidden !important;
                background: white !important;
              }
              
              @page {
                margin: 0mm !important;
                padding: 0mm !important;
                size: A4 portrait;
              }
              
              @page :first {
                margin-top: 0mm !important;
              }
              
              @page :left {
                margin-left: 0mm !important;
              }
              
              @page :right {
                margin-right: 0mm !important;
              }
              
              body * {
                visibility: hidden;
              }
              
              .print-content,
              .print-content * {
                visibility: visible;
              }
              
              .print-content {
                position: absolute !important;
                left: 0 !important;
                top: 0 !important;
                width: 210mm !important;
                min-height: 297mm !important;
                margin: 0 !important;
                padding: 0 !important;
                background: white !important;
              }
              
              .page-break {
                page-break-after: always !important;
                break-after: page !important;
                page-break-inside: avoid !important;
              }
              
              .page-break:last-child {
                page-break-after: auto !important;
              }
              
              * {
                -webkit-print-color-adjust: exact !important;
                color-adjust: exact !important;
                print-color-adjust: exact !important;
              }
            }
          </style>
        </head>
        <body class="bg-white font-inter" style="margin: 0; padding: 0;">
          <div class="print-content">
            ${printContent.outerHTML}
          </div>
          <script>
            window.onload = function() {
              window.focus();
              setTimeout(function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 100);
              }, 250);
            };
            
            window.onbeforeprint = function() {
              document.body.classList.add('printing');
            };
            
            window.onafterprint = function() {
              document.body.classList.remove('printing');
              window.close();
            };
          </script>
        </body>
      </html>
    `);

    printWindow.document.close();
  };

  const handleDownloadPDF = async () => {
    try {
      const reportElement = reportRef.current;
      if (!reportElement) return;

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
            <title>Laboratory Report</title>
            <meta charset="utf-8">
            <link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css" rel="stylesheet">
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
            <style>
              @media print {
                @page {
                  margin: 0mm !important;
                  size: A4;
                }
                
                html, body {
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                }
                
                @page {
                  marks: none;
                }
                
                body * {
                  visibility: hidden;
                }
                
                .print-content,
                .print-content * {
                  visibility: visible;
                }
                
                .print-content {
                  position: absolute !important;
                  left: 0 !important;
                  top: 0 !important;
                  width: 210mm !important;
                  min-height: 297mm !important;
                  margin: 0 !important;
                  padding: 0 !important;
                  background: white !important;
                }
                
                .page-break {
                  page-break-after: always !important;
                  break-after: page !important;
                  page-break-inside: avoid !important;
                }
                
                * {
                  -webkit-print-color-adjust: exact !important;
                  color-adjust: exact !important;
                  print-color-adjust: exact !important;
                }
              }
            </style>
          </head>
          <body class="bg-white font-inter" style="margin: 0; padding: 0;">
            <div class="print-content">
              ${printContent.outerHTML}
            </div>
            <script>
              window.onload = function() {
                window.print();
                setTimeout(function() {
                  window.close();
                }, 1000);
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

  const testPages = testResults?.map((testResult: any, index: number) => (
    <div
      key={index}
      className="min-h-[297mm] print:min-h-[297mm] print-page"
      style={{
        minHeight: '297mm',
        pageBreakAfter:
          index === testResults.length - 1 && !includePOS ? 'auto' : 'always',
        breakAfter:
          index === testResults.length - 1 && !includePOS ? 'auto' : 'page',
      }}
    >
      <ReportHeader customization={customization} />
      <PatientInfo patient={patient} booking={booking} />
      <TestResults
        booking={booking}
        customization={customization}
        testResults={[testResult]}
      />
      <ReportFooter customization={customization} />
    </div>
  ));

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto mb-6 no-print">
        <div className="bg-white rounded-lg shadow-sm p-4 font-inter">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-800 mb-0.5">
                Laboratory Report
              </h1>
              <p className="text-gray-600 leading-tight">
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

      <div
        ref={reportRef}
        className="max-w-[210mm] mx-auto bg-white font-inter print:shadow-none print:max-w-none"
        style={{
          background: 'white',
        }}
      >
        {testPages}

        {includePOS && (
          <div
            className="min-h-[297mm] print:min-h-[297mm] print-page"
            style={{
              minHeight: '297mm',
              pageBreakAfter: 'auto',
              breakAfter: 'auto',
            }}
          >
            <POSReport
              patient={patient}
              booking={booking}
              customization={customization}
            />
          </div>
        )}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');

        * {
          font-family:
            'Inter',
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            sans-serif !important;
        }

        @media print {
          @page {
            margin: 0mm !important;
            padding: 0mm !important;
            size: A4;
            marks: none;
          }

          @page :first, @page :left, @page :right {
            margin-top: 0mm !important;
            margin-bottom: 0mm !important;
            margin-left: 0mm !important;
            margin-right: 0mm !important;
          }

          body {
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            font-family:
              'Inter',
              -apple-system,
              BlinkMacSystemFont,
              'Segoe UI',
              Roboto,
              sans-serif !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
            width: 210mm !important;
            min-height: 297mm !important;
          }

          body * {
            visibility: hidden;
            margin: 0 !important;
            padding: 0 !important;
          }

          .max-w-\\[210mm\\],
          .max-w-\\[210mm\\] *,
          .print-page,
          .print-page * {
            visibility: visible !important;
            box-shadow: none !important;
          }

          .max-w-\\[210mm\\] {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 210mm !important;
            min-height: 297mm !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
            overflow: visible !important;
          }

          .no-print,
          .no-print * {
            display: none !important;
          }

          .print-page {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            min-height: 297mm !important;
            height: 297mm !important;
            position: relative !important;
          }

          .print-page:not(:last-child) {
            page-break-after: always !important;
            break-after: page !important;
          }

          .print-page:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }

          * {
            -webkit-print-color-adjust: exact !important;
            color-adjust: exact !important;
            print-color-adjust: exact !important;
            box-shadow: none !important;
          }

          .shadow-lg {
            box-shadow: none !important;
          }

          body::before,
          body::after {
            display: none !important;
            content: none !important;
          }
        }

        .max-w-\\[210mm\\] {
          width: 100%;
          max-width: 210mm;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        @media print {
          .max-w-\\[210mm\\] {
            box-shadow: none !important;
          }
        }
      `}</style>
    </div>
  );
};

export default LabReport;
