// components/Booking/TestSelection.tsx
'use client';
import { useState, useEffect } from 'react';
import { Search, X, Filter } from 'lucide-react';
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

interface LabTest {
  id: string;
  name: string;
  category: string;
  description?: string;
  price: number;
  duration?: string;
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
  const [labTests, setLabTests] = useState<LabTest[]>([]);
  const [loading, setLoading] = useState(true);
  const testsPerPage = 6;

  // Fetch tests created by the selected lab
  useEffect(() => {
    const fetchLabTests = async () => {
      if (!selectedLab?.id) return;

      setLoading(true);
      try {
        const response = await fetch(`/api/lab/${selectedLab.id}/tests`);
        if (response.ok) {
          const tests = await response.json();
          setLabTests(tests);
        } else {
          console.error('Failed to fetch lab tests');
          setLabTests([]);
        }
      } catch (error) {
        console.error('Error fetching lab tests:', error);
        setLabTests([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLabTests();
  }, [selectedLab?.id]);

  // Transform lab tests to match the existing structure
  const allTestsWithCategory = labTests.map((test) => ({
    category: test.category,
    name: test.name,
    price: test.price,
    duration: test.duration,
    id: test.id,
  }));

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
    (acc, { category, name, price, duration }) => {
      if (!acc[category]) acc[category] = [];
      acc[category].push({ name, price, duration });
      return acc;
    },
    {} as Record<
      string,
      Array<{ name: string; price: number; duration?: string }>
    >
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

  // Get unique categories from lab tests
  const uniqueCategories = [...new Set(labTests.map((test) => test.category))];

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-black w-full max-w-4xl my-8">
        <BookingHeader
          selectedLab={selectedLab}
          appointmentDate={appointmentDate}
          appointmentTime={appointmentTime}
        />
        <div className="border-b border-gray-200 my-6"></div>
        <div className="text-center py-8">Loading tests...</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <BookingHeader
        selectedLab={selectedLab}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
      />

      <div className="border-b border-gray-200 my-6"></div>

      <div className="mb-6">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search tests by name..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2A787A] focus:border-[#2A787A]"
            />
          </div>

          {selectedTests.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-2 px-4 py-3 bg-red-50 text-red-600 rounded-lg border border-red-200 hover:bg-red-100 transition-colors whitespace-nowrap"
            >
              <X size={16} />
              Clear All
            </button>
          )}
        </div>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter size={18} className="text-gray-500" />
            <h3 className="text-sm font-medium text-gray-700">
              Filter by Category
            </h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelectedCategory(null);
                setCurrentPage(1);
              }}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === null
                  ? 'bg-[#2A787A] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Categories
            </button>
            {uniqueCategories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setSelectedCategory(category);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-[#2A787A] text-white shadow-sm'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center">
            <h3 className="font-semibold text-gray-800">
              Available Tests
              {selectedCategory && `: ${selectedCategory}`}
            </h3>
            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-md">
              {selectedTests.length} selected
            </span>
          </div>
        </div>

        {labTests.length === 0 ? (
          <p className="text-gray-500 text-center py-8 bg-white rounded-lg border border-gray-200">
            No tests available for this lab.
          </p>
        ) : selectedCategory ? (
          // Show tests by category
          Object.entries(testsByCategory).length > 0 ? (
            Object.entries(testsByCategory).map(([category, tests]) => (
              <div key={category} className="mb-6">
                <h3 className="font-semibold text-gray-800 text-lg mb-4 pl-2 border-l-4 border-[#2A787A] py-1">
                  {category}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {tests.map((test, index) => {
                    const uniqueId = `${category}-${test.name.replace(/\s+/g, '-')}-${index}`;
                    return (
                      <div
                        key={uniqueId}
                        className={`flex flex-col p-4 rounded-lg border transition-all duration-200 ${
                          selectedTests.includes(test.name)
                            ? 'border-[#2A787A] bg-[#F0F7F7]'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id={uniqueId}
                            checked={selectedTests.includes(test.name)}
                            onChange={() => handleTestToggle(test.name)}
                            className="mt-1 w-4 h-4 text-[#2A787A] bg-white border-gray-300 rounded focus:ring-[#2A787A]"
                          />
                          <label
                            htmlFor={uniqueId}
                            className="ml-3 text-sm text-gray-700 cursor-pointer flex-1"
                          >
                            <div className="font-medium">{test.name}</div>
                            {test.duration && (
                              <div className="text-xs text-gray-500 mt-1">
                                Duration: {test.duration}
                              </div>
                            )}
                          </label>
                        </div>
                        <div className="mt-2 text-right">
                          <span className="text-lg font-bold text-[#2A787A]">
                            ₹{test.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center py-8 bg-white rounded-lg border border-gray-200">
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
