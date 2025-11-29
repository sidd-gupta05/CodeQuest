// components/Lab/BackPage.tsx
export const BackPage = ({ customization }: { customization: any }) => {
  return (
    <div
      className="min-h-[297mm] flex items-center justify-center p-8 print:min-h-[297mm]"
      style={{
        background: 'linear-gradient(135deg, #f0f9ff 0%, #f0fdf4 100%)',
      }}
    >
      <div className="text-center max-w-2xl print:max-w-none">
        <div className="mb-8 print:mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2 print:text-3xl print:mb-1">
            LabSphere
          </h1>
          <p className="text-xl text-gray-600 print:text-lg">
            Healthcare Technology Solutions
          </p>
        </div>

        <div className="space-y-6 text-gray-700 mb-8 print:space-y-4 print:mb-6">
          <p className="text-lg leading-relaxed print:text-base print:leading-snug">
            This report was generated using LabSphere's advanced laboratory
            management platform, ensuring accuracy, reliability, and
            professional standards in medical reporting.
          </p>

          <div className="grid md:grid-cols-2 gap-6 text-left max-w-md mx-auto print:max-w-xs print:gap-4">
            <div>
              <h3 className="font-semibold text-gray-800 mb-3 print:text-sm print:mb-2">
                Quality Assurance
              </h3>
              <ul className="text-sm space-y-1 print:text-xs">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  ISO Certified Processes
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Automated Validation
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Quality Control Checks
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">•</span>
                  Secure Data Handling
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800 mb-3 print:text-sm print:mb-2">
                Contact Support
              </h3>
              <ul className="text-sm space-y-1 print:text-xs">
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  support@labsphere.com
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  +1 (555) 123-LABS
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  www.labsphere.com
                </li>
                <li className="flex items-start">
                  <span className="text-blue-500 mr-2">•</span>
                  24/7 Technical Support
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t pt-8 mt-8 print:pt-6 print:mt-6">
          <p className="text-2xl font-bold text-gray-800 mb-2 print:text-xl print:mb-1">
            Powered by LabSphere
          </p>
          <p className="text-gray-600 print:text-sm">
            Transforming Laboratory Management Through Innovation
          </p>
        </div>

        {/* Print-only footer */}
        <div className="hidden print:block mt-8 pt-4 border-t">
          <p className="text-xs text-gray-500">
            Document ID: {Date.now().toString(36).toUpperCase()} • Page 2 of 2
          </p>
        </div>
      </div>
    </div>
  );
};
