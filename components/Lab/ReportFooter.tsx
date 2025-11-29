// components/Lab/ReportFooter.tsx
export const ReportFooter = ({ customization }: any) => {
  const generateQRCode = () => {
    // In a real implementation, this would generate an actual QR code
    return `https://verify.labsphere.com/report/${Date.now()}`;
  };

  return (
    <div className="p-6 border-t bg-gray-50 print:p-4">
      <div className="flex justify-between items-start">
        <div className="text-center flex-1">
          <div
            className="mb-2 border-t-2 pt-3 mx-auto max-w-xs"
            style={{ borderColor: customization.accentColor }}
          >
            <p className="font-semibold text-gray-700 text-sm print:text-xs">
              Authorized Signatory
            </p>
            <p className="text-gray-600 text-sm print:text-xs">
              Laboratory Director
            </p>
            <p className="text-gray-600 text-sm print:text-xs font-medium">
              {customization.labName}
            </p>
          </div>
        </div>

        {customization.includeQRCode && (
          <div className="text-center">
            <div className="w-20 h-20 bg-white border rounded-lg flex items-center justify-center mx-auto mb-2 print:w-16 print:h-16">
              <div className="text-center">
                <div className="text-[8px] text-gray-400 print:text-[6px]">
                  QR CODE
                </div>
                <div className="text-[6px] text-gray-400 print:text-[4px] mt-1">
                  Scan to Verify
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 print:text-[10px]">
              Verification Code
            </p>
          </div>
        )}
      </div>

      <div className="text-center mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 print:text-[10px]">
          {customization.footerText}
        </p>
        <p className="text-xs text-gray-500 mt-1 print:text-[10px]">
          Report generated on: {new Date().toLocaleDateString()} at{' '}
          {new Date().toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </p>
        {customization.showWatermark && (
          <p className="text-xs text-gray-400 mt-2 print:text-[10px]">
            Powered by LabSphere • www.labsphere.com
          </p>
        )}
      </div>
    </div>
  );
};
