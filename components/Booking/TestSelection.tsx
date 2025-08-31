//components/Booking/TestSelection.tsx
'use client';
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Star, MapPin, Search } from 'lucide-react';
import { allLabTests } from '@/data/labsData';
import BookingHeader from './BookingHeader';
import BookingNavigation from './BookingNavigation';

interface TestSelectionProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: any;
  appointmentDate: string;
  appointmentTime: string;
  selectedTests: string[]; 
  onTestsChange: (tests: string[]) => void; 
}

export default function TestSelection({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
  selectedTests,
  onTestsChange,
}: TestSelectionProps) {
  // const [selectedTests, setSelectedTests] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const allTestsWithCategory = Object.entries(allLabTests).flatMap(
    ([category, tests]) => tests.map((test) => ({ category, name: test }))
  );

  const filteredTests = allTestsWithCategory.filter(({ category, name }) => {
    const matchesSearch = name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory
      ? category === selectedCategory
      : true;
    return matchesSearch && matchesCategory;
  });

  const testsByCategory = filteredTests.reduce(
    (acc, { category, name }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push(name);
      return acc;
    },
    {} as Record<string, string[]>
  );

  const handleTestToggle = (testName: string) => {
    const updatedTests = selectedTests.includes(testName)
      ? selectedTests.filter((test: string) => test !== testName)
      : [...selectedTests, testName];
    onTestsChange(updatedTests); 
  };


  const handleSelectAddons = () => {
    onNext();
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <BookingHeader
        selectedLab={selectedLab}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
      />

      <div className="border-b border-gray-200 my-6"></div>

      <div className="mb-6">
        <div className="relative mb-6">
          <input
            type="text"
            placeholder="Search tests"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#37AFA2]"
          />
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1 rounded-full text-sm ${
              selectedCategory === null
                ? 'bg-[#37AFA2] text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            All Categories
          </button>
          {Object.keys(allLabTests).map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategory === category
                  ? 'bg-[#37AFA2] text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {Object.entries(testsByCategory).length > 0 ? (
          Object.entries(testsByCategory).map(([category, tests]) => (
            <div key={category} className="mb-6">
              <h3 className="font-bold text-gray-800 text-lg mb-3">
                {category}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                {tests.map((test, index) => (
                  <div key={index} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`test-${index}`}
                      checked={selectedTests.includes(test)}
                      onChange={() => handleTestToggle(test)}
                      className="w-4 h-4 text-[#37AFA2] bg-gray-100 border-gray-300 rounded focus:ring-[#37AFA2]"
                    />
                    <label
                      htmlFor={`test-${index}`}
                      className="ml-2 text-sm text-gray-700"
                    >
                      {test}
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-4">
            No tests found matching your search.
          </p>
        )}
      </div>

      <BookingNavigation
        onBack={onBack}
        onNext={handleSelectAddons}
        nextDisabled={selectedTests.length === 0}
        backText="Back"
        nextText="Continue to Patient Details"
      />
    </div>
  );
}
