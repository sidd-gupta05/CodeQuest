//components/Lab/report/ReportHeader.tsx
interface ReportHeaderProps {
  customization: any;
}

export const ReportHeader = ({ customization }: ReportHeaderProps) => {
  return (
    <div
      className="p-8 border-b-4 text-white print:p-6"
      style={{
        backgroundColor: customization.headerColor,
        borderColor: customization.accentColor,
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-6">
          {customization.labLogo && (
            <img
              src={customization.labLogo}
              alt="Lab Logo"
              className="h-24 w-24 object-contain bg-white rounded-xl p-3 shadow-lg print:h-20 print:w-20"
            />
          )}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2 print:text-2xl">
              {customization.labName}
            </h1>
            <p className="text-white/90 text-lg mb-1 print:text-base">
              {customization.labAddress}
            </p>
            <p className="text-white/90 text-lg print:text-base">
              {customization.labPhone} • {customization.labEmail}
            </p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-2xl font-bold mb-2 print:text-xl">
            LABORATORY REPORT
          </h2>
          <p className="text-white/90 text-lg print:text-base">
            Accredited Medical Laboratory
          </p>
          {customization.showWatermark && (
            <div className="mt-3 flex items-center justify-end space-x-2 print:mt-2">
              <span className="text-white/80 text-sm print:text-xs">
                Powered by LabSphere
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
