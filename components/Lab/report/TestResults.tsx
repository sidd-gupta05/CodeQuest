//components/Lab/report/TestResults.tsx
import { useState } from 'react';
import { Edit2, Save, X } from 'lucide-react';

export const TestResults = ({ booking, customization, testResults }: any) => {
  const tests = booking.tests || [];
  const addons = booking.addons || [];
  const [isEditing, setIsEditing] = useState(false);
  const [interpretation, setInterpretation] = useState(
    customization.interpretationText ||
      'All investigated parameters are within normal physiological limits. No significant abnormalities detected in the laboratory findings. Results are consistent with normal health status.'
  );

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

  const handleSaveInterpretation = () => {
    // Here you would typically save to your backend
    console.log('Saving interpretation:', interpretation);
    setIsEditing(false);
  };

  return (
    <div className="p-4 print:p-3 font-inter">
      <h3 className="text-base font-semibold mb-3 text-gray-800 print:text-sm">
        TEST RESULTS
      </h3>

      {/* Main Tests */}
      <div className="mb-6">
        <h4
          className="font-semibold text-gray-700 mb-3 text-sm print:text-xs"
          style={{ color: customization.accentColor }}
        >
          LABORATORY INVESTIGATIONS
        </h4>

        {testResults?.map((testResult: any, index: number) => (
          <div key={index} className="mb-4 last:mb-0">
            <h5 className="font-medium text-gray-800 mb-2 text-sm print:text-xs">
              {testResult.testName}
            </h5>

            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 text-xs print:text-[11px]">
                <thead>
                  <tr
                    style={{
                      backgroundColor: customization.headerColor + '15',
                    }}
                  >
                    <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Parameter
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Result
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Unit
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
                      Reference Range
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-gray-700 uppercase tracking-wider">
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
                      <td className="px-3 py-2 text-gray-800 font-medium">
                        {value.parameter}
                      </td>
                      <td className="px-3 py-2 text-gray-900 font-semibold">
                        {value.value}
                      </td>
                      <td className="px-3 py-2 text-gray-600">{value.unit}</td>
                      <td className="px-3 py-2 text-gray-600">{value.range}</td>
                      <td className="px-3 py-2">
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(value.status)}`}
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
      {/* {addons.length > 0 && (
        <div className="mb-4">
          <h4
            className="font-semibold text-gray-700 mb-2 text-sm print:text-xs"
            style={{ color: customization.accentColor }}
          >
            ADDITIONAL SERVICES
          </h4>
          <div className="space-y-1">
            {addons.map((addon: any, index: number) => (
              <div
                key={index}
                className="flex justify-between items-center py-1 border-b print:py-0.5"
              >
                <span className="text-gray-800 text-xs print:text-xs">
                  {addon.name}
                </span>
                <span className="text-green-600 text-xs print:text-xs font-medium">
                  Completed
                </span>
              </div>
            ))}
          </div>
        </div>
      )} */}

      {/* Interpretation */}
      {customization.includeInterpretation && (
        <div className="mt-4 p-3 bg-blue-50 rounded border border-blue-200 print:p-2">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-blue-800 text-sm print:text-xs">
              Clinical Note:
            </h4>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded transition-colors print:hidden"
              >
                <Edit2 size={12} />
                Edit Notes
              </button>
            ) : (
              <div className="flex items-center gap-1 print:hidden">
                <button
                  onClick={handleSaveInterpretation}
                  className="flex items-center gap-1 text-green-600 hover:text-green-800 text-xs font-medium px-2 py-1 bg-green-100 hover:bg-green-200 rounded transition-colors"
                >
                  <Save size={12} />
                  Save
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false);
                    setInterpretation(
                      customization.interpretationText ||
                        'All investigated parameters are within normal physiological limits. No significant abnormalities detected in the laboratory findings. Results are consistent with normal health status.'
                    );
                  }}
                  className="flex items-center gap-1 text-red-600 hover:text-red-800 text-xs font-medium px-2 py-1 bg-red-100 hover:bg-red-200 rounded transition-colors"
                >
                  <X size={12} />
                  Cancel
                </button>
              </div>
            )}
          </div>

          {isEditing ? (
            <div className="space-y-3 print:hidden">
              {/* Rich Text Editor */}
              <textarea
                value={interpretation}
                onChange={(e) => setInterpretation(e.target.value)}
                className="w-full h-40 p-2 text-gray-800 border border-blue-300 rounded bg-white focus:ring-1 focus:ring-blue-500 focus:border-transparent text-xs"
                placeholder="Enter interpretation notes. You can add:
• Abnormal findings
• Clinical correlations
• Recommendations
• Follow-up instructions
• Any specific observations"
              />

              {/* Quick Templates */}
              <div className="space-y-1">
                <p className="text-xs text-gray-600 font-medium">
                  Quick Templates:
                </p>
                <div className="flex flex-wrap gap-1">
                  <button
                    onClick={() =>
                      setInterpretation(
                        'All parameters are within normal limits. No significant abnormalities detected.'
                      )
                    }
                    className="px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded"
                  >
                    Normal Report
                  </button>
                  <button
                    onClick={() =>
                      setInterpretation(
                        'Mild abnormalities noted. Clinical correlation recommended.'
                      )
                    }
                    className="px-2 py-1 text-xs bg-yellow-100 hover:bg-yellow-200 text-yellow-700 rounded"
                  >
                    Mild Abnormalities
                  </button>
                  <button
                    onClick={() =>
                      setInterpretation(
                        'Significant abnormalities detected. Immediate clinical attention advised.'
                      )
                    }
                    className="px-2 py-1 text-xs bg-red-100 hover:bg-red-200 text-red-700 rounded"
                  >
                    Critical Findings
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div>
              {/* Display Mode */}
              <div className="text-blue-700 text-xs print:text-xs leading-normal whitespace-pre-line">
                {interpretation}
              </div>

              {/* Notes Table (Optional - can be part of interpretation) */}
              {customization.includeNotesTable && (
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full border border-blue-200 text-xs">
                    <thead>
                      <tr className="bg-blue-100">
                        <th className="px-2 py-1 text-left font-medium text-blue-800 border border-blue-200">
                          Parameter
                        </th>
                        <th className="px-2 py-1 text-left font-medium text-blue-800 border border-blue-200">
                          Observation
                        </th>
                        <th className="px-2 py-1 text-left font-medium text-blue-800 border border-blue-200">
                          Recommendation
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {testResults?.flatMap((testResult: any) =>
                        testResult.values
                          ?.filter((value: any) => value.status !== 'normal')
                          ?.map((value: any, index: number) => (
                            <tr key={index} className="even:bg-blue-50">
                              <td className="px-2 py-1 border border-blue-200 text-blue-800 font-medium">
                                {value.parameter}
                              </td>
                              <td className="px-2 py-1 border border-blue-200">
                                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                  {value.status?.toUpperCase()}
                                </span>
                                <span className="ml-1">
                                  Value: {value.value} {value.unit}
                                </span>
                              </td>
                              <td className="px-2 py-1 border border-blue-200">
                                {value.status === 'critical'
                                  ? 'Immediate medical attention required'
                                  : value.status === 'abnormal'
                                    ? 'Consult with physician'
                                    : 'Monitor and repeat test if needed'}
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Comments */}
      {customization.includeComments && (
        <div className="mt-3 p-3 bg-gray-50 rounded border print:p-2">
          <div className="flex justify-between items-center mb-1">
            <h4 className="font-semibold text-gray-700 text-sm print:text-xs">
              REMARKS
            </h4>
          </div>
          <p className="text-gray-600 text-xs print:text-xs leading-normal">
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
