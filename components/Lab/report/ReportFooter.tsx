//components/Lab/report/ReportFooter.tsx
export const ReportFooter = ({ customization }: any) => {
  const generateQRCode = () => {
    // In a real implementation, this would generate an actual QR code
    return `https://verify.labsphere.com/report/${Date.now()}`;
  };

  // Get signatories or use default
  const signatories = customization.signatories || [];

  return (
    <div className="p-6 border-t bg-gray-50 print:p-4">
      <div className="flex justify-between items-start">
        {/* Signatures Section */}
        <div className="flex-1">
          <div className="flex flex-row items-start justify-between gap-6">
            {signatories.length > 0 ? (
              signatories.map((signatory: any, index: number) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    className="mb-2 border-t-2 pt-3 mx-auto max-w-xs"
                    style={{ borderColor: customization.accentColor }}
                  >
                    {signatory.signatureImage ? (
                      <div className="mb-2 h-12">
                        <img
                          src={signatory.signatureImage}
                          alt={`${signatory.name}'s signature`}
                          className="h-12 mx-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-12 mb-2 flex items-center justify-center">
                        <div className="w-32 h-px bg-gray-400"></div>
                      </div>
                    )}
                    <p className="font-semibold text-gray-700 text-sm print:text-xs">
                      {signatory.name}
                    </p>
                    <p className="text-gray-600 text-sm print:text-xs">
                      {signatory.designation}
                    </p>
                    {signatory.qualification && (
                      <p className="text-gray-500 text-xs print:text-[10px] mt-1">
                        {signatory.qualification}
                      </p>
                    )}
                    {signatory.licenseNumber && (
                      <p className="text-gray-500 text-xs print:text-[10px]">
                        License: {signatory.licenseNumber}
                      </p>
                    )}
                  </div>
                </div>
              ))
            ) : (
              // Default signature if no signatories configured
              <div className="flex-1 text-center">
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
            )}
          </div>
        </div>

        {/* QR Code Section */}
        {customization.includeQRCode && (
          <div className="text-center ml-6">
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

      {/* Footer Text */}
      <div className="text-center mt-4 pt-4 border-t">
        <p className="text-xs text-gray-500 print:text-[10px]">
          {customization.footerText}
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
