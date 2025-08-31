// components/Booking/TestSelection.tsx
'use client';
import { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Star,
  MapPin,
  Search,
  X,
} from 'lucide-react';
import { allLabTests } from '@/data/labsData';
import BookingHeader from './BookingHeader';
import BookingNavigation from './BookingNavigation';
import PaginationTest from './PaginationTest';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const testsPerPage = 6;

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

  const handleClearAll = () => {
    onTestsChange([]);
  };

  const handleSelectAddons = () => {
    onNext();
  };

  // Calculate pagination
  const totalTests = filteredTests.length;
  const totalPages = Math.ceil(totalTests / testsPerPage);
  const startIndex = (currentPage - 1) * testsPerPage;
  const currentTests = filteredTests.slice(
    startIndex,
    startIndex + testsPerPage
  );

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <BookingHeader
        selectedLab={selectedLab}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
      />

      <div className="border-b border-gray-200 my-6"></div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
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

          {selectedTests.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors whitespace-nowrap"
            >
              <X size={16} />
              Clear All Tests
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => {
              setSelectedCategory(null);
              setCurrentPage(1);
            }}
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
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
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

        {selectedCategory ? (
          // Show tests by category
          Object.entries(testsByCategory).length > 0 ? (
            Object.entries(testsByCategory).map(([category, tests]) => (
              <div key={category} className="mb-6">
                <h3 className="font-bold text-gray-800 text-lg mb-3">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-y-2 gap-x-4">
                  {tests.map((test, index) => {
                    const uniqueId = `${category}-${test.replace(/\s+/g, '-')}`;
                    return (
                      <div key={uniqueId} className="flex items-center">
                        <input
                          type="checkbox"
                          id={uniqueId}
                          checked={selectedTests.includes(test)}
                          onChange={() => handleTestToggle(test)}
                          className="w-4 h-4 text-[#37AFA2] bg-gray-100 border-gray-300 rounded focus:ring-[#37AFA2]"
                        />
                        <label
                          htmlFor={uniqueId}
                          className="ml-2 text-sm text-gray-700 cursor-pointer"
                        >
                          {test}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-4">
              No tests found matching your search.
            </p>
          )
        ) : (
          // Show paginated tests when "All Categories" is selected
          <PaginationTest
            tests={currentTests}
            selectedTests={selectedTests}
            onTestToggle={handleTestToggle}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalTests={totalTests}
          />
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
