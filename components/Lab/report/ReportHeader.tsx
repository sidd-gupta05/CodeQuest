//components/Lab/report/ReportHeader.tsx
interface ReportHeaderProps {
  customization: any;
}

export const ReportHeader = ({ customization }: ReportHeaderProps) => {
  return (
    <div
      className="p-6 border-b-4 text-white print:p-4 font-inter"
      style={{
        backgroundColor: customization.headerColor,
        borderColor: customization.accentColor,
      }}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-4">
          {customization.labLogo && (
            <img
              src={customization.labLogo}
              alt="Lab Logo"
              className="h-20 w-20 object-contain bg-white rounded-lg p-2 shadow print:h-16 print:w-16"
            />
          )}
          <div className="flex-1">
            <h1 className="text-5xl font-bold mb-1 print:text-xl leading-tight">
              {customization.labName}
            </h1>
            <p className="text-white/90 text-base mb-0.5 print:text-sm leading-tight">
              {customization.labAddress}
            </p>
            <p className="text-white/90 text-base print:text-sm leading-tight">
              {customization.labPhone} • {customization.labEmail}
            </p>
          </div>
        </div>

        <div className="text-right">
          <h2 className="text-xl font-bold mb-1 print:text-lg leading-tight">
            LABORATORY REPORT
          </h2>
          <p className="text-white/90 text-base print:text-sm leading-tight">
            Accredited Medical Laboratory
          </p>
          {customization.showWatermark && (
            <div className="mt-2 flex items-center justify-end space-x-1 print:mt-1">
              <span className="text-white/80 text-xs print:text-xs leading-tight">
                Powered by LabSphere
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
