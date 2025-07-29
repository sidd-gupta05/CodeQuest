'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Star, Heart, Search, MapPin, Calendar } from 'lucide-react';
import LabSearch from '@/components/lab-search';

import { labsData, allLabTests } from '@/data/labsData';

interface Lab {
  id: number;
  name: string;
  testType: string;
  location: string;
  nextAvailable: string;
  rating: number;
  votes: number;
  totalVotes: number;
  experience: number;
  isAvailable: boolean;
  isLoved: boolean;
  image: string;
  collectionTypes: string[];
}

interface Filters {
  testType: string;
  availability: string;
  experience: number;
  collectionTypes: string[];
  rating: number;
}

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const ITEMS_PER_PAGE = 7;

const Bookappoientment = () => {
  const [labs, setLabs] = useState<Lab[]>(labsData);
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState<Filters>({
    testType: '',
    availability: '',
    experience: 0,
    collectionTypes: [],
    rating: 0,
  });

  const [sortBy, setSortBy] = useState<string>('rating');
  const [showAllTestTypes, setShowAllTestTypes] = useState(false);

  const handleLoveClick = (id: number) => {
    setLabs(
      labs.map((lab) =>
        lab.id === id ? { ...lab, isLoved: !lab.isLoved } : lab
      )
    );
  };

  const handleFilterChange = (filterName: keyof Filters, value: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
    setCurrentPage(1);
  };

  const handleCollectionTypeChange = (type: string) => {
    const currentTypes = filters.collectionTypes;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    handleFilterChange('collectionTypes', newTypes);
  };

  const clearAllFilters = () => {
    setFilters({
      testType: '',
      availability: '',
      experience: 0,
      collectionTypes: [],
      rating: 0,
    });
    setCurrentPage(1);
    document
      .querySelectorAll('input[type="radio"]')
      .forEach((radio) => (radio.checked = false));
    document
      .querySelectorAll('input[type="checkbox"]')
      .forEach((checkbox) => (checkbox.checked = false));
  };

  const testTypeCounts = useMemo(() => {
    return labsData.reduce((acc: Record<string, number>, lab) => {
      acc[lab.testType] = (acc[lab.testType] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const filteredAndSortedLabs = useMemo(() => {
    let filtered = [...labs];

    if (filters.testType) {
      filtered = filtered.filter((lab) => lab.testType === filters.testType);
    }

    if (filters.rating) {
      filtered = filtered.filter(
        (lab) => Math.floor(lab.rating) === filters.rating
      );
    }

    if (filters.experience > 0) {
      filtered = filtered.filter((lab) => lab.experience >= filters.experience);
    }

    if (filters.availability) {
      const today = getToday();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const next7Days = new Date(today);
      next7Days.setDate(today.getDate() + 7);
      const next30Days = new Date(today);
      next30Days.setDate(today.getDate() + 30);

      filtered = filtered.filter((lab) => {
        if (lab.nextAvailable === 'Not Available') return false;
        const availableDate = new Date(lab.nextAvailable);
        availableDate.setHours(0, 0, 0, 0);

        switch (filters.availability) {
          case 'today':
            return availableDate.getTime() === today.getTime();
          case 'tomorrow':
            return availableDate.getTime() === tomorrow.getTime();
          case 'next7':
            return availableDate >= today && availableDate <= next7Days;
          case 'next30':
            return availableDate >= today && availableDate <= next30Days;
          default:
            return true;
        }
      });
    }

    if (filters.collectionTypes.length > 0) {
      filtered = filtered.filter((lab) =>
        filters.collectionTypes.every((type) =>
          lab.collectionTypes.includes(type)
        )
      );
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'rating':
          return b.rating - a.rating;
        case 'experience_asc':
          return a.experience - b.experience;
        case 'experience_desc':
          return b.experience - a.experience;
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [labs, filters, sortBy]);

  const totalItems = filteredAndSortedLabs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedLabs = filteredAndSortedLabs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allAvailableTestTypes = Object.keys(testTypeCounts);
  const visibleTestTypes = showAllTestTypes
    ? allAvailableTestTypes
    : allAvailableTestTypes.slice(0, 5);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <main
        className="flex flex-col text-white"
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
        }}
      >
        <Navbar />
        <LabSearch />
      </main>

      <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 mt-4 sm:mt-15 bg-white mb-20 text-black">
        <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
          <div className="lg:hidden w-full">
            <details className="border rounded-lg shadow-sm bg-white">
              <summary className="p-4 font-bold text-lg cursor-pointer">
                Filters
              </summary>
              <div className="p-4 border-t">
                <div className="flex justify-between items-center mb-4">
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-[#2A787A] hover:text-[#1c3434] cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Test Type</h3>
                    <ul className="space-y-1 text-gray-600">
                      {visibleTestTypes.map((testType) => (
                        <li
                          key={testType}
                          className="flex justify-between items-center cursor-pointer hover:text-[#2A787A]"
                          onClick={() =>
                            handleFilterChange('testType', testType)
                          }
                        >
                          <span
                            className={
                              filters.testType === testType
                                ? 'font-bold text-[#2A787A]'
                                : ''
                            }
                          >
                            {testType}
                          </span>
                          <span className="text-xs bg-gray-200 py-0.5 px-1.5 rounded">
                            {testTypeCounts[testType]}
                          </span>
                        </li>
                      ))}
                    </ul>
                    {allAvailableTestTypes.length > 5 && (
                      <button
                        onClick={() => setShowAllTestTypes(!showAllTestTypes)}
                        className="text-sm text-[#2A787A] mt-2 cursor-pointer hover:underline"
                      >
                        {showAllTestTypes ? 'View Less' : 'View More'}
                      </button>
                    )}
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Availability</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="availability"
                            className="mr-2"
                            onChange={() =>
                              handleFilterChange('availability', 'today')
                            }
                          />{' '}
                          Available Today
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="availability"
                            className="mr-2"
                            onChange={() =>
                              handleFilterChange('availability', 'tomorrow')
                            }
                          />{' '}
                          Available Tomorrow
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="availability"
                            className="mr-2"
                            onChange={() =>
                              handleFilterChange('availability', 'next7')
                            }
                          />{' '}
                          Available in next 7 days
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="availability"
                            className="mr-2"
                            onChange={() =>
                              handleFilterChange('availability', 'next30')
                            }
                          />{' '}
                          Available in next 30 days
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Experience</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="experience"
                            className="mr-2"
                            onChange={() => handleFilterChange('experience', 2)}
                          />{' '}
                          2+ Years
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="experience"
                            className="mr-2"
                            onChange={() => handleFilterChange('experience', 5)}
                          />{' '}
                          5+ Years
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            name="experience"
                            className="mr-2"
                            onChange={() =>
                              handleFilterChange('experience', 10)
                            }
                          />{' '}
                          10+ Years
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Collection Type</h3>
                    <ul className="space-y-1 text-gray-600">
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={() =>
                              handleCollectionTypeChange('Home Collection')
                            }
                          />{' '}
                          Home Collection
                        </label>
                      </li>
                      <li>
                        <label className="flex items-center">
                          <input
                            type="checkbox"
                            className="mr-2"
                            onChange={() =>
                              handleCollectionTypeChange('Visiting to Lab')
                            }
                          />{' '}
                          Visiting to Lab
                        </label>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Ratings</h3>
                    <div className="space-y-1">
                      {[5, 4, 3, 2, 1].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleFilterChange('rating', star)}
                          className={`w-full text-left p-2 rounded-lg flex items-center border ${filters.rating === star ? 'bg-yellow-100 border-yellow-400' : 'hover:bg-gray-100'}`}
                        >
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={
                                i < star
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }
                            />
                          ))}
                          <span className="ml-2 text-sm">{star} Star & Up</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </details>
          </div>

          {/* Filters Section - Desktop */}
          <aside className="hidden lg:block w-full lg:w-1/4 xl:w-1/5 p-4 border rounded-lg shadow-sm bg-white h-fit sticky top-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filter</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#2A787A] hover:text-[#1c3434] cursor-pointer"
              >
                Clear All
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Test Type</h3>
                <ul className="space-y-1 text-gray-600">
                  {visibleTestTypes.map((testType) => (
                    <li
                      key={testType}
                      className="flex justify-between items-center cursor-pointer hover:text-[#2A787A]"
                      onClick={() => handleFilterChange('testType', testType)}
                    >
                      <span
                        className={
                          filters.testType === testType
                            ? 'font-bold text-[#2A787A]'
                            : ''
                        }
                      >
                        {testType}
                      </span>
                      <span className="text-xs bg-gray-200 py-0.5 px-1.5 rounded">
                        {testTypeCounts[testType]}
                      </span>
                    </li>
                  ))}
                </ul>
                {allAvailableTestTypes.length > 5 && (
                  <button
                    onClick={() => setShowAllTestTypes(!showAllTestTypes)}
                    className="text-sm text-[#2A787A] mt-2 cursor-pointer hover:text-[#1c3434]"
                  >
                    {showAllTestTypes ? 'View Less' : 'View More'}
                  </button>
                )}
              </div>

              <div>
                <h3 className="font-semibold mb-2">Availability</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        className="mr-2"
                        onChange={() =>
                          handleFilterChange('availability', 'today')
                        }
                      />{' '}
                      Available Today
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        className="mr-2"
                        onChange={() =>
                          handleFilterChange('availability', 'tomorrow')
                        }
                      />{' '}
                      Available Tomorrow
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        className="mr-2"
                        onChange={() =>
                          handleFilterChange('availability', 'next7')
                        }
                      />{' '}
                      Available in next 7 days
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center cursor-pointer">
                      <input
                        type="radio"
                        name="availability"
                        className="mr-2"
                        onChange={() =>
                          handleFilterChange('availability', 'next30')
                        }
                      />{' '}
                      Available in next 30 days
                    </label>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Experience</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="experience"
                        className="mr-2"
                        onChange={() => handleFilterChange('experience', 2)}
                      />{' '}
                      2+ Years
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="experience"
                        className="mr-2"
                        onChange={() => handleFilterChange('experience', 5)}
                      />{' '}
                      5+ Years
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        name="experience"
                        className="mr-2"
                        onChange={() => handleFilterChange('experience', 10)}
                      />{' '}
                      10+ Years
                    </label>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Collection Type</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={() =>
                          handleCollectionTypeChange('Home Collection')
                        }
                      />{' '}
                      Home Collection
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={() =>
                          handleCollectionTypeChange('Visiting to Lab')
                        }
                      />{' '}
                      Visiting to Lab
                    </label>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Ratings</h3>
                <div className="space-y-1">
                  {[5, 4, 3, 2, 1].map((star) => (
                    <button
                      key={star}
                      onClick={() => handleFilterChange('rating', star)}
                      className={`w-full text-left p-2 rounded-lg flex items-center border ${filters.rating === star ? 'bg-yellow-100 border-yellow-400' : 'hover:bg-gray-100 cursor-pointer'}`}
                    >
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={16}
                          className={
                            i < star
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }
                        />
                      ))}
                      <span className="ml-2 text-sm">{star} Star & Up</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Results Section */}
          <main className="w-full lg:w-3/4 xl:w-4/5">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
              <h2 className="text-xl font-bold text-gray-700">
                Showing {filteredAndSortedLabs.length} Labs For You
              </h2>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <label htmlFor="sort">Sort By</label>
                  <select
                    id="sort"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="border rounded-md p-1 bg-white"
                  >
                    <option value="rating">Rating</option>
                    <option value="experience_asc">
                      Experience (Low to High)
                    </option>
                    <option value="experience_desc">
                      Experience (High to Low)
                    </option>
                  </select>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {paginatedLabs.length > 0 ? (
                paginatedLabs.map((lab) => (
                  <div
                    key={lab.id}
                    className="bg-white p-4 rounded-lg border shadow-md flex flex-col sm:flex-row gap-4 items-start"
                  >
                    <img
                      src={lab.image}
                      alt={lab.name}
                      className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1 w-full">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                        <div className="w-full sm:w-auto">
                          <h3 className="text-lg font-bold text-[#2A787A]">
                            {lab.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {lab.testType}
                          </p>
                          <p className="text-sm text-gray-500">
                            {lab.location}{' '}
                            <a
                              href="#"
                              className="text-[#2A787A] hover:underline"
                            >
                              Get Direction
                            </a>
                          </p>
                        </div>
                        <div className="flex items-center gap-2 mt-2 sm:mt-0">
                          {lab.nextAvailable !== 'Not Available' ? (
                            <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded-full whitespace-nowrap">
                              ● Available
                            </span>
                          ) : (
                            <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded-full whitespace-nowrap">
                              ● Unavailable
                            </span>
                          )}
                          <button onClick={() => handleLoveClick(lab.id)}>
                            <Heart
                              size={24}
                              className={
                                lab.isLoved
                                  ? 'text-red-500 fill-current'
                                  : 'text-gray-400'
                              }
                            />
                          </button>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row justify-between items-start mt-4 gap-4">
                        <div>
                          <p className="text-sm font-semibold">
                            Next available at
                          </p>
                          <p className="text-md font-bold text-[#2A787A]">
                            {lab.nextAvailable}
                          </p>
                        </div>
                        <button className="w-full sm:w-auto bg-[#2A787A] hover:bg-[#236464] text-white px-4 sm:px-6 py-2 rounded-lg">
                          Book Appointment
                        </button>
                      </div>
                      <div className="border-t mt-4 pt-2 flex flex-wrap justify-between items-center text-sm text-gray-500 gap-2">
                        <div className="flex items-center gap-1">
                          <Star
                            size={16}
                            className="text-yellow-400 fill-current"
                          />
                          <span className="font-bold text-gray-700">
                            {lab.rating}
                          </span>
                        </div>
                        <p>{lab.experience} Years of Experience</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 font-semibold">
                    No labs found matching your criteria.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>
          </main>
        </div>
      </section>

      {totalPages > 1 && (
        <div className="flex justify-center my-10 px-4">
          <nav className="inline-flex flex-wrap overflow-hidden">
            <button
              onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-xl border border-gray-300 bg-white font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed "
            >
              Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-2 sm:px-3 py-1 text-xs sm:text-sm border-1 border-b border-gray-300 font-medium  rounded-full ${
                  currentPage === page
                    ? 'text-[#2A787A] bg-blue-50'
                    : 'text-gray-500 hover:bg-gray-50 bg-white'
                }`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={() =>
                handlePageChange(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-2 sm:px-3 py-1 text-xs sm:text-sm rounded-xl border border-gray-300 bg-white font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      )}

      <Footer />
    </>
  );
};

export default Bookappoientment;
