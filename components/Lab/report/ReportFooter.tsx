// //components/Lab/report/ReportFooter.tsx
// export const ReportFooter = ({ customization }: any) => {
//   const generateQRCode = () => {
//     // In a real implementation, this would generate an actual QR code
//     return `https://verify.labsphere.com/report/${Date.now()}`;
//   };

//   // Get signatories or use default
//   const signatories = customization.signatories || [];

//   return (
//     <div className="p-4 border-t bg-gray-50 print:p-3 font-inter">
//       <div className="flex justify-between items-start">
//         {/* Signatures Section */}
//         <div className="flex-1">
//           <div className="flex flex-row items-start justify-between gap-4">
//             {signatories.length > 0 ? (
//               signatories.map((signatory: any, index: number) => (
//                 <div key={index} className="flex-1 text-center">
//                   <div
//                     // className="mb-1 border-t-2 pt-2 mx-auto max-w-xs"
//                     // style={{ borderColor: customization.accentColor }}
//                   >
//                     {signatory.signatureImage ? (
//                       <div className="mb-1 h-10">
//                         <img
//                           src={signatory.signatureImage}
//                           alt={`${signatory.name}'s signature`}
//                           className="h-10 mx-auto object-contain"
//                         />
//                       </div>
//                     ) : (
//                       <div className="h-10 mb-1 flex items-center justify-center">
//                         <div className="w-28 h-px bg-gray-400"></div>
//                       </div>
//                     )}
//                     <p className="font-semibold text-gray-700 text-xs print:text-xs leading-tight">
//                       {signatory.name}
//                     </p>
//                     <p className="text-gray-600 text-xs print:text-xs leading-tight">
//                       {signatory.designation}
//                     </p>
//                     {signatory.qualification && (
//                       <p className="text-gray-500 text-xs print:text-[10px] mt-0.5 leading-tight">
//                         {signatory.qualification}
//                       </p>
//                     )}
//                     {signatory.licenseNumber && (
//                       <p className="text-gray-500 text-xs print:text-[10px] leading-tight">
//                         License: {signatory.licenseNumber}
//                       </p>
//                     )}
//                   </div>
//                 </div>
//               ))
//             ) : (
//               // Default signature if no signatories configured
//               <div className="flex-1 text-center">
//                 <div
//                   className="mb-1 border-t-2 pt-2 mx-auto max-w-xs"
//                   style={{ borderColor: customization.accentColor }}
//                 >
//                   <p className="font-semibold text-gray-700 text-xs print:text-xs leading-tight">
//                     Authorized Signatory
//                   </p>
//                   <p className="text-gray-600 text-xs print:text-xs leading-tight">
//                     Laboratory Director
//                   </p>
//                   <p className="text-gray-600 text-xs print:text-xs font-medium leading-tight">
//                     {customization.labName}
//                   </p>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* QR Code Section */}
//         {customization.includeQRCode && (
//           <div className="text-center ml-4">
//             <div className="w-16 h-16 bg-white border rounded flex items-center justify-center mx-auto mb-1 print:w-14 print:h-14">
//               <div className="text-center">
//                 <div className="text-[7px] text-gray-400 print:text-[6px] leading-tight">
//                   QR CODE
//                 </div>
//                 <div className="text-[5px] text-gray-400 print:text-[4px] mt-0.5 leading-tight">
//                   Scan to Verify
//                 </div>
//               </div>
//             </div>
//             <p className="text-xs text-gray-600 print:text-[10px] leading-tight">
//               Verification Code
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Footer Text */}
//       <div className="text-center mt-3 pt-3 border-t">
//         <p className="text-xs text-gray-500 print:text-[10px] leading-tight">
//           {customization.footerText}
//         </p>
//         {customization.showWatermark && (
//           <p className="text-xs text-gray-400 mt-1 print:text-[10px] leading-tight">
//             Powered by LabSphere • www.labsphere.com
//           </p>
//         )}
//       </div>
//     </div>
//   );
// };

// components/Lab/report/ReportFooter.tsx
export const ReportFooter = ({ customization }: any) => {
  const generateQRCode = () => {
    // In a real implementation, this would generate an actual QR code
    return `https://verify.labsphere.com/report/${Date.now()}`;
  };

  // Get signatories or use default
  const signatories = customization.signatories || [];

  return (
    <div className="p-4 border-t bg-gray-50 print:p-3 font-inter">
      <div className="flex justify-between items-start">
        {/* Signatures Section */}
        <div className="flex-1">
          <div className="flex flex-row items-start justify-between gap-4">
            {signatories.length > 0 ? (
              signatories.map((signatory: any, index: number) => (
                <div key={index} className="flex-1 text-center">
                  <div
                    // className="mb-1 border-t-2 pt-2 mx-auto max-w-xs"
                    // style={{ borderColor: customization.accentColor }}
                  >
                    {signatory.signatureImage ? (
                      <div className="mb-1 h-10">
                        <img
                          src={signatory.signatureImage}
                          alt={`${signatory.name}'s signature`}
                          className="h-10 mx-auto object-contain"
                        />
                      </div>
                    ) : (
                      <div className="h-10 mb-1 flex items-center justify-center">
                        <div className="w-28 h-px bg-gray-400"></div>
                      </div>
                    )}
                    <p className="font-semibold text-gray-700 text-xs print:text-xs leading-tight">
                      {signatory.name}
                    </p>
                    <p className="text-gray-600 text-xs print:text-xs leading-tight">
                      {signatory.designation}
                    </p>
                    {signatory.qualification && (
                      <p className="text-gray-500 text-xs print:text-[10px] mt-0.5 leading-tight">
                        {signatory.qualification}
                      </p>
                    )}
                    {signatory.licenseNumber && (
                      <p className="text-gray-500 text-xs print:text-[10px] leading-tight">
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
                  className="mb-1 border-t-2 pt-2 mx-auto max-w-xs"
                  style={{ borderColor: customization.accentColor }}
                >
                  <p className="font-semibold text-gray-700 text-xs print:text-xs leading-tight">
                    Authorized Signatory
                  </p>
                  <p className="text-gray-600 text-xs print:text-xs leading-tight">
                    Laboratory Director
                  </p>
                  <p className="text-gray-600 text-xs print:text-xs font-medium leading-tight">
                    {customization.labName}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        {customization.includeQRCode && (
          <div className="text-center ml-4">
            <div className="w-16 h-16 bg-white border rounded flex items-center justify-center mx-auto mb-1 print:w-14 print:h-14">
              <div className="text-center">
                <div className="text-[7px] text-gray-400 print:text-[6px] leading-tight">
                  QR CODE
                </div>
                <div className="text-[5px] text-gray-400 print:text-[4px] mt-0.5 leading-tight">
                  Scan to Verify
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-600 print:text-[10px] leading-tight">
              Verification Code
            </p>
          </div>
        )}
      </div>

      {/* Footer Text */}
      <div className="text-center mt-3 pt-3 border-t">
        <p className="text-xs text-gray-500 print:text-[10px] leading-tight">
          {customization.footerText}
        </p>
        {customization.showWatermark && (
          <p className="text-xs text-gray-400 mt-1 print:text-[10px] leading-tight">
            Powered by LabSphere • www.labsphere.com
          </p>
        )}
      </div>
    </div>
  );
};
