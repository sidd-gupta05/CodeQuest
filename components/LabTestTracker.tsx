import React from 'react';
import {
  Calendar,
  Search,
  Eye,
  Download,
  Check,
  Clock,
  Filter,
  RotateCw,
} from 'lucide-react';

const testHistory = [
  {
    id: 'LBS12345',
    testName: 'CBC',
    lab: 'Dr. Lal Path Lab, Sion',
    date: '15 Jan 2024',
    status: 'Pending',
  },
  {
    id: 'LBS12346',
    testName: 'Lipid Panel',
    lab: 'Apollo, Sion',
    date: '28 Feb 2024',
    status: 'Completed',
  },
  {
    id: 'LBS12347',
    testName: 'Urinalysis',
    lab: 'Metropolis, Wadala',
    date: '10 May 2024',
    status: 'Completed',
  },
  {
    id: 'LBS12348',
    testName: 'Thyroid Panel',
    lab: 'True Path, Sion',
    date: '22 Jul 2025',
    status: 'Completed',
  },
  {
    id: 'LBS12349',
    testName: 'Glucose Test',
    lab: 'Pathofarm, Wadala',
    date: '05 Sep 2025',
    status: 'Payment Error',
  },
];

const statusColor = {
  Pending: 'bg-yellow-50 text-yellow-600 border-yellow-200',
  Completed: 'bg-green-50 text-green-600 border-green-200',
  'Payment Error': 'bg-red-50 text-red-500 border-red-200',
};

const steps = [
  {
    label: 'Test Booked',
    sublabel: 'Today 14:30',
    completed: true,
    current: false,
  },
  {
    label: 'Sample Collected',
    sublabel: 'Today 15:30',
    completed: true,
    current: false,
  },
  {
    label: 'In Lab for testing',
    sublabel: 'Today 19:30',
    completed: false,
    current: true,
  },
  {
    label: 'Report Under Review',
    sublabel: 'Est. Tomorrow 09:30',
    completed: false,
    current: false,
  },
  {
    label: 'Report Ready',
    sublabel: 'Est. Tomorrow 10:30',
    completed: false,
    current: false,
  },
];

const TrackReport = () => {
  const currentStep = steps.findIndex((step) => step.current);
  const percentPerStep = 100 / (steps.length - 1);

  return (
    <div>
      {/* Main Title */}
      <h1 className="text-center text-6xl font-black text-[#2B7C7E] my-8">
        Track Report
      </h1>
      <div className="px-4 md:px-10 py-6 max-w-6xl mx-auto">
        {/* Stepper Card */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow p-6 mb-8">
          {/* Report Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <h2 className="text-lg md:text-xl font-semibold text-[#05303B]">
                Complete Blood Count
                <span className="text-[#22465A] font-normal">
                  {' '}
                  (Dr.Lal Path Labs, Wadala)
                </span>
              </h2>
              <div className="text-sm text-[#22465A] mt-1">
                Booking ID: <span className="font-mono">LBS12345</span>
              </div>
            </div>
            <span className="inline-flex items-center px-2 py-0.5 bg-green-50 text-green-700 text-xs rounded-md border border-green-100">
              ● Live Status
            </span>
          </div>
          {/* Stepper */}
          <div className="relative px-2 pb-4 pt-2">
            {/* Background line */}
            <div className="absolute top-[20%] left-6 right-6 h-1 bg-gray-200 rounded-full -translate-y-1/2 z-0"></div>
            {/* Active line */}
            <div
              className="absolute top-[20%] left-6 h-1 bg-[#178087] rounded-full z-0"
              style={{
                width: `${percentPerStep * Math.max(currentStep, 0)}%`,
                minWidth: 0,
                maxWidth: 'calc(100% - 3rem)',
                transform: 'translateY(-50%)',
              }}
            ></div>
            <div className="flex justify-between relative z-10">
              {steps.map((step, idx) => (
                <div key={idx} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 flex items-center justify-center rounded-full border-2
                      ${
                        step.completed
                          ? 'bg-[#178087] border-[#178087] text-white'
                          : step.current
                            ? 'bg-white border-[#178087] text-[#178087]'
                            : 'bg-white border-gray-300 text-gray-400'
                      }
                    `}
                  >
                    {step.completed ? (
                      <Check className="w-6 h-6" />
                    ) : step.current ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      <span className="font-bold text-base">{idx + 1}</span>
                    )}
                  </div>
                  <div className="text-center mt-2 w-[120px]">
                    <p
                      className={`text-base font-bold leading-tight mb-1
                      ${step.completed || step.current ? 'text-[#05303B]' : 'text-gray-400'}`}
                    >
                      {step.label}
                    </p>
                    <p
                      className={`text-xs ${step.completed || step.current ? 'text-[#22465A]' : 'text-gray-400'}`}
                    >
                      {step.sublabel}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test History */}
        <h2 className="text-center text-4xl font-bold text-[#178087] mb-6">
          Test History
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-4 md:p-8">
          {/* Filters */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
            <div className="flex flex-wrap gap-3">
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Calendar className="w-4 h-4" /> Payment Status
              </button>
              <button className="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 bg-white hover:bg-gray-50 transition-colors">
                <Filter className="w-4 h-4" /> Date Range
              </button>
              <button className="flex items-center gap-2 px-3 py-2 text-sm text-[#F36723] bg-orange-50 border border-orange-100 rounded-lg hover:bg-orange-100 transition-colors">
                <RotateCw className="w-4 h-4" /> Reset Filter
              </button>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Test Name"
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full text-sm bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-400 transition-colors"
              />
            </div>
          </div>
          {/* Table */}
          <div className="overflow-x-auto border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">
                    Test Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">
                    Lab Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">
                    Payment Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {testHistory.map((test) => (
                  <tr
                    key={test.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-3 text-sm text-gray-900 font-mono">
                      {test.id}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 font-medium">
                      {test.testName}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {test.lab}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-700">
                      {test.date}
                    </td>
                    <td className="px-6 py-3">
                      <span
                        className={`inline-flex px-3 py-1 rounded border font-semibold text-xs ${statusColor[test.status]}`}
                      >
                        {test.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex gap-3">
                        <button className="p-1 text-gray-400 hover:text-blue-600 transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-green-600 transition-colors">
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700">
              <span>Showing</span>
              <select className="border border-gray-200 rounded px-2 py-1 text-sm">
                <option>05</option>
                <option>10</option>
                <option>25</option>
              </select>
              <span>Showing 1 to 05 out of 60 records</span>
            </div>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  className={`px-3 py-2 text-sm border rounded-lg transition-colors
                    ${
                      num === 1
                        ? 'bg-[#178087] text-white border-[#178087]'
                        : 'text-gray-700 border-gray-200 hover:bg-gray-100'
                    }
                  `}
                >
                  {num}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackReport;
