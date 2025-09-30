//app/dashboard/lab/profile/LabTests.tsx
'use client';

import React, { useState, ChangeEvent } from 'react';
import { Plus, Search, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface LabTest {
  id: string;
  name: string;
  price: string;
}

const LabTests: React.FC = () => {
  const [tests, setTests] = useState<LabTest[]>([
    { id: '1', name: 'CBC', price: '' },
    { id: '2', name: 'Lipid Test', price: '' },
    { id: '3', name: 'Malaria', price: '' },
  ]);

  const [testSearch, setTestSearch] = useState('');
  const [newTestName, setNewTestName] = useState('');
  const [loading, setLoading] = useState(false);

  // Handle price change for a specific test
  const handlePriceChange = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    setTests(
      tests.map((test) =>
        test.id === id ? { ...test, price: e.target.value } : test
      )
    );
  };

  // Add a new test to the list
  const handleAddTest = () => {
    if (newTestName.trim() !== '') {
      const newTestId = (tests.length + 1).toString();
      const newTest: LabTest = {
        id: newTestId,
        name: newTestName.trim(),
        price: '',
      };
      setTests([...tests, newTest]);
      setNewTestName('');
      toast.success('Test added successfully!');
    }
  };

  // Handle saving the changes
  const handleSaveChanges = () => {
    setLoading(true);
    // Here you would implement your API call to save the data to the database
    console.log('Saving changes:', tests);

    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast.success('Changes saved successfully!');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-800">
        Lab Tests Settings
      </h3>

      {/* Search and Add Test Section */}
      <div className="flex items-center space-x-4">
        <div className="relative w-full">
          <input
            type="text"
            placeholder="Search Tests"
            value={testSearch}
            onChange={(e) => setTestSearch(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#006A6A] pr-10"
          />
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        <button
          onClick={handleAddTest}
          className="flex items-center px-4 py-2 text-sm font-medium rounded-md shadow-sm text-white bg-[#006A6A] hover:bg-[#005A5A] whitespace-nowrap cursor-pointer"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Test
        </button>
      </div>

      {/* Added Tests Section */}
      <div>
        <h4 className="font-medium text-gray-700 mb-4">Added Tests</h4>
        <div className="space-y-4">
          {tests.map((test) => (
            <div
              key={test.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
            >
              <div className="flex items-center">
                <input
                  type="radio"
                  className="h-4 w-4 text-[#006A6A]"
                  disabled
                />
                <span className="ml-3 font-medium text-gray-700">
                  {test.name}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Price</span>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                    Rs
                  </span>
                  <input
                    type="number"
                    value={test.price}
                    onChange={(e) => handlePriceChange(test.id, e)}
                    placeholder="0"
                    className="w-24 pl-8 py-2 border border-gray-300 rounded-md text-right focus:outline-none focus:ring-2 focus:ring-[#006A6A]"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Save Changes Button */}
      <button
        onClick={handleSaveChanges}
        className="mt-6 flex items-center justify-center px-6 py-3 text-base font-medium rounded-md shadow-sm text-white bg-[#006A6A] hover:bg-[#005A5A] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        disabled={loading}
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Saving Changes...
          </>
        ) : (
          'Save Changes'
        )}
      </button>
    </div>
  );
};

export default LabTests;
