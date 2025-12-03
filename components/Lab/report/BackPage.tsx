//components/Lab/report/BackPage.tsx
export const BackPage = ({ customization }: { customization: any }) => {
  return (
    <div
      className="min-h-[297mm] flex items-center justify-center p-8 print:min-h-[297mm] font-inter"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
      }}
    >
      <div className="text-center max-w-2xl print:max-w-none">
        <div className="mb-6 print:mb-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-1 print:text-3xl print:mb-0.5">
            LabSphere
          </h1>
          <p className="text-xl text-gray-600 print:text-lg leading-tight">
            Healthcare Technology Solutions
          </p>
        </div>

        <div className="space-y-4 text-gray-700 mb-6 print:space-y-3 print:mb-4">
          <p className="text-lg leading-snug print:text-base print:leading-normal">
            This report was generated using LabSphere's advanced laboratory
            management platform, ensuring accuracy, reliability, and
            professional standards in medical reporting.
          </p>

          <div className="grid md:grid-cols-2 gap-4 text-left max-w-md mx-auto print:max-w-xs print:gap-3">
            <div>
              <h3 className="font-semibold text-gray-800 mb-2 print:text-sm print:mb-1">
                Quality Assurance
              </h3>
              <ul className="text-sm space-y-0.5 print:text-xs">
                <li className="flex items-start leading-tight">
                  <span className="text-green-500 mr-1">•</span>
                  ISO Certified Processes
                </li>
                <li className="flex items-start leading-tight">
                  <span className="text-green-500 mr-1">•</span>
                  Automated Validation
                </li>
                <li className="flex items-start leading-tight">
                  <span className="text-green-500 mr-1">•</span>
                  Quality Control Checks
                </li>
                <li className="flex items-start leading-tight">
                  <span className="text-green-500 mr-1">•</span>
                  Secure Data Handling
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-2 print:text-sm print:mb-1">
                Contact Support
              </h3>
              <ul className="text-sm space-y-0.5 print:text-xs">
                <li className="flex items-start leading-tight">
                  <span className="text-blue-500 mr-1">•</span>
                  support@labsphere.com
                </li>
                <li className="flex items-start leading-tight">
                  <span className="text-blue-500 mr-1">•</span>
                  +1 (555) 123-LABS
                </li>
                <li className="flex items-start leading-tight">
                  <span className="text-blue-500 mr-1">•</span>
                  www.labsphere.com
                </li>
                <li className="flex items-start leading-tight">
                  <span className="text-blue-500 mr-1">•</span>
                  24/7 Technical Support
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t pt-6 mt-6 print:pt-4 print:mt-4">
          <p className="text-2xl font-bold text-gray-800 mb-1 print:text-xl print:mb-0.5">
            Powered by LabSphere
          </p>
          <p className="text-gray-600 print:text-sm leading-tight">
            Transforming Laboratory Management Through Innovation
          </p>
        </div>

        {/* Print-only footer */}
        <div className="hidden print:block mt-6 pt-3 border-t">
          <p className="text-xs text-gray-500 leading-tight">
            Document ID: {Date.now().toString(36).toUpperCase()} • Page 2 of 2
          </p>
        </div>
      </div>
    </div>
  );
};
