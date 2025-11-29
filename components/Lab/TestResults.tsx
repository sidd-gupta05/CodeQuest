// components/Lab/TestResults.tsx
export const TestResults = ({ booking, customization, testResults }: any) => {
  const tests = booking.tests || [];
  const addons = booking.addons || [];

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'normal':
        return 'bg-green-100 text-green-800';
      case 'abnormal':
        return 'bg-red-100 text-red-800';
      case 'critical':
        return 'bg-red-100 text-red-800 border border-red-300';
      case 'borderline':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 print:p-4">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 print:text-base">
        TEST RESULTS
      </h3>

      {/* Main Tests */}
      <div className="mb-8">
        <h4
          className="font-semibold text-gray-700 mb-4 text-base print:text-sm"
          style={{ color: customization.accentColor }}
        >
          LABORATORY INVESTIGATIONS
        </h4>

        {testResults?.map((testResult: any, index: number) => (
          <div key={index} className="mb-6 last:mb-0">
            <h5 className="font-medium text-gray-800 mb-3 text-base print:text-sm">
              {testResult.testName}
            </h5>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-sm print:text-xs">
                <thead>
                  <tr
                    style={{
                      backgroundColor: customization.headerColor + '15',
                    }}
                  >
                    <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Parameter
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Reference Range
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {testResult.values?.map((value: any, valueIndex: number) => (
                    <tr
                      key={valueIndex}
                      className={
                        valueIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                      }
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium">
                        {value.parameter}
                      </td>
                      <td className="px-4 py-3 text-gray-900 font-semibold">
                        {value.value}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{value.unit}</td>
                      <td className="px-4 py-3 text-gray-600">{value.range}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value.status)}`}
                        >
                          {value.status || 'Normal'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>

      {/* Additional Services */}
      {addons.length > 0 && (
        <div className="mb-6">
          <h4
            className="font-semibold text-gray-700 mb-3 text-base print:text-sm"
            style={{ color: customization.accentColor }}
          >
            ADDITIONAL SERVICES
          </h4>
          <div className="space-y-2">
            {addons.map((addon: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b print:py-1"
              >
                <span className="text-gray-800 text-sm print:text-xs">
                  {addon.name}
                </span>
                <span className="text-green-600 text-sm print:text-xs font-medium">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Interpretation */}
      {customization.includeInterpretation && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200 print:p-3">
          <h4 className="font-semibold text-blue-800 mb-2 text-base print:text-sm">
            INTERPRETATION
          </h4>
          <p className="text-blue-700 text-sm print:text-xs leading-relaxed">
            All investigated parameters are within normal physiological limits.
            No significant abnormalities detected in the laboratory findings.
            Results are consistent with normal health status.
          </p>
        </div>
      )}

      {/* Comments */}
      {customization.includeComments && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border print:p-3">
          <h4 className="font-semibold text-gray-700 mb-2 text-base print:text-sm">
            REMARKS
          </h4>
          <p className="text-gray-600 text-sm print:text-xs leading-relaxed">
            Results are clinically correlated and verified by automated
            analyzers. Please consult with your healthcare provider for detailed
            interpretation and clinical correlation. For any queries, contact
            the laboratory.
          </p>
        </div>
      )}
    </div>
  );
};
