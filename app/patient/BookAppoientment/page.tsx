'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import { Star, Heart, Search, MapPin, Calendar } from 'lucide-react';

import { labsData } from '@/data/labsData';

interface Lab {
  id: number;
  name: string;
  specialty: string;
  location: string;
  consultationFees: number;
  nextAvailable: string;
  rating: number;
  votes: number;
  totalVotes: number;
  experience: number;
  isAvailable: boolean;
  isLoved: boolean;
  image: string;
  languages: string[];
  consultationTypes: string[];
}

interface Filters {
  specialty: string;
  availability: string;
  price: number;
  experience: number;
  consultationTypes: string[];
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
    specialty: '',
    availability: '',
    price: 3000,
    experience: 0,
    consultationTypes: [],
    rating: 0,
  });

  const [sortBy, setSortBy] = useState<string>('rating');
  const [showAllSpecialties, setShowAllSpecialties] = useState(false);

  const handleLoveClick = (id: number) => {
    setLabs(
      labs.map((lab) =>
        lab.id === id ? { ...lab, isLoved: !lab.isLoved } : lab
      )
    );
  };

  const handleRating = (labId: number, newRating: number) => {
    setLabs(
      labs.map((lab) =>
        lab.id === labId ? { ...lab, rating: newRating } : lab
      )
    );
  };

  const handleFilterChange = (filterName: keyof Filters, value: any) => {
    setFilters((prevFilters) => ({ ...prevFilters, [filterName]: value }));
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleConsultationTypeChange = (type: string) => {
    const currentTypes = filters.consultationTypes;
    const newTypes = currentTypes.includes(type)
      ? currentTypes.filter((t) => t !== type)
      : [...currentTypes, type];
    handleFilterChange('consultationTypes', newTypes);
  };

  const clearAllFilters = () => {
    setFilters({
      specialty: '',
      availability: '',
      price: 3000,
      experience: 0,
      consultationTypes: [],
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

  // Calculate specialty counts only once
  const specialtyCounts = useMemo(() => {
    return labsData.reduce((acc: Record<string, number>, lab) => {
      acc[lab.specialty] = (acc[lab.specialty] || 0) + 1;
      return acc;
    }, {});
  }, []);

  const filteredAndSortedLabs = useMemo(() => {
    let filtered = [...labs];

    if (filters.specialty) {
      filtered = filtered.filter((lab) => lab.specialty === filters.specialty);
    }

    if (filters.rating) {
      filtered = filtered.filter(
        (lab) => Math.floor(lab.rating) === filters.rating
      );
    }

    filtered = filtered.filter((lab) => lab.consultationFees <= filters.price);

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

    if (filters.consultationTypes.length > 0) {
      filtered = filtered.filter((lab) =>
        filters.consultationTypes.every((type) =>
          lab.consultationTypes.includes(type)
        )
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price_asc':
          return a.consultationFees - b.consultationFees;
        case 'price_desc':
          return b.consultationFees - a.consultationFees;
        case 'rating':
          return b.rating - a.rating;
        default:
          return b.rating - a.rating;
      }
    });

    return filtered;
  }, [labs, filters, sortBy]);

  // Pagination logic
  const totalItems = filteredAndSortedLabs.length;
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
  const paginatedLabs = filteredAndSortedLabs.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const allSpecialties = Object.keys(specialtyCounts);
  const visibleSpecialties = showAllSpecialties
    ? allSpecialties
    : allSpecialties.slice(0, 5);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <main
        className=" flex flex-col text-white "
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 55.01%, #FFF 100%)',
        }}
      >
        <Navbar />
        <section className="mt-12 md:mt-20 text-center w-full px-4">
          <h1 className="text-white text-4xl md:text-6xl font-bold mb-10">
            Lab Search
          </h1>

          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 items-center bg-white px-4 py-2 rounded-2xl md:rounded-full shadow-lg w-full max-w-3xl mx-auto">
            <div className="flex items-center flex-1 w-full sm:w-auto">
              <Search className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Search for nearby Pathlabs"
                className="w-full px-4 py-2 rounded-full outline-none text-black"
              />
            </div>
            <div className="flex items-center flex-1 w-full sm:w-auto">
              <MapPin className="text-gray-400 mr-2" />
              <input
                type="text"
                placeholder="Location"
                className="w-full px-4 py-2 rounded-full outline-none text-black"
              />
            </div>
            <div className="flex items-center flex-1 w-full sm:w-auto">
              <Calendar className="text-gray-400 mr-2" />
              <input
                type="date"
                className="w-full px-4 py-2 rounded-full outline-none text-black"
              />
            </div>
            <button className="bg-[#2A787A] hover:bg-[#236464] text-white px-6 py-3 rounded-full flex items-center justify-center gap-2 w-full sm:w-auto">
              <Search size={20} /> Search
            </button>
          </div>
        </section>
      </main>

      <section className="w-full max-w-7xl mx-auto mt-15 p-4 bg-white mb-20 text-black">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters Section */}
          <aside className="w-full md:w-1/4 lg:w-1/5 p-4 border rounded-lg shadow-sm bg-white h-fit sticky top-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Filter</h2>
              <button
                onClick={clearAllFilters}
                className="text-sm text-[#2A787A] "
              >
                Clear All
              </button>
            </div>

            {/* Filter Groups */}
            <div className="space-y-6">
              <div>
                <h3 className="font-semibold mb-2">Specialty</h3>
                <ul className="space-y-1 text-gray-600">
                  {visibleSpecialties.map((specialty) => (
                    <li
                      key={specialty}
                      className="flex justify-between items-center cursor-pointer hover:text-[#2A787A]"
                      onClick={() => handleFilterChange('specialty', specialty)}
                    >
                      <span
                        className={
                          filters.specialty === specialty
                            ? 'font-bold text-[#2A787A]'
                            : ''
                        }
                      >
                        {specialty}
                      </span>
                      <span className="text-xs bg-gray-200 py-0.5 px-1.5 rounded">
                        {specialtyCounts[specialty]}
                      </span>
                    </li>
                  ))}
                </ul>
                {allSpecialties.length > 5 && (
                  <button
                    onClick={() => setShowAllSpecialties(!showAllSpecialties)}
                    className="text-sm text-[#2A787A] mt-2 cursor-pointer hover:underline"
                  >
                    {showAllSpecialties ? 'View Less' : 'View More'}
                  </button>
                )}
              </div>

              {/*Availability*/}
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

              {/* Pricing */}
              <div>
                <h3 className="font-semibold mb-2">Pricing</h3>
                <input
                  type="range"
                  min="500"
                  max="3000"
                  step="100"
                  value={filters.price}
                  onChange={(e) =>
                    handleFilterChange('price', Number(e.target.value))
                  }
                  className="w-full"
                />
                <div className="flex justify-between text-sm text-gray-500">
                  <span>₹500</span>
                  <span>₹{filters.price}</span>
                </div>
              </div>

              {/* Experience */}
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

              {/* Consultation Type */}
              <div>
                <h3 className="font-semibold mb-2">Consultation Type</h3>
                <ul className="space-y-1 text-gray-600">
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={() =>
                          handleConsultationTypeChange('Audio Call')
                        }
                      />{' '}
                      Audio Call
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={() =>
                          handleConsultationTypeChange('Video Call')
                        }
                      />{' '}
                      Video Call
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={() =>
                          handleConsultationTypeChange('In-Person')
                        }
                      />{' '}
                      In-Person
                    </label>
                  </li>
                  <li>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        className="mr-2"
                        onChange={() =>
                          handleConsultationTypeChange('Instant Counseling')
                        }
                      />{' '}
                      Instant Counseling
                    </label>
                  </li>
                </ul>
              </div>

              {/* Ratings Filter */}
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
          </aside>

          {/* Results Section */}
          <main className="w-full md:w-3/4 lg:w-4/5">
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
              <h2 className="text-xl font-bold text-gray-700">
                Showing {filteredAndSortedLabs.length} Doctors For You
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
                    <option value="price_asc">Price (Low to High)</option>
                    <option value="price_desc">Price (High to Low)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Lab/Doctor Cards */}
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
                      className="w-24 h-24 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-lg font-bold text-[#2A787A]">
                            {lab.name}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {lab.specialty}
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
                        <div className="flex items-center gap-2">
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
                            Consultation Fees
                          </p>
                          <p className="text-xl font-bold text-gray-800">
                            ₹{lab.consultationFees}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-semibold">
                            Next available at
                          </p>
                          <p className="text-md font-bold text-[#2A787A]">
                            {lab.nextAvailable}
                          </p>
                        </div>
                        <button className="w-full sm:w-auto bg-[#2A787A] hover:bg-[#236464] text-white px-6 py-2 rounded-lg">
                          Book Appointment
                        </button>
                      </div>
                      <div className="border-t mt-4 pt-2 flex flex-wrap justify-between items-center text-sm text-gray-500 gap-2">
                        <p>Speaks: {lab.languages.join(', ')}</p>
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
                      <div className="mt-2">
                        <p className="text-sm font-semibold mb-1">
                          Rate this Doctor:
                        </p>
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              onClick={() => handleRating(lab.id, star)}
                            >
                              <Star
                                size={20}
                                className={
                                  star <= lab.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-600 font-semibold">
                    No doctors found matching your criteria.
                  </p>
                  <p className="text-sm text-gray-500">
                    Try adjusting your filters.
                  </p>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center mt-8">
                <nav className="inline-flex rounded-md shadow">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(1, currentPage - 1))
                    }
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Previous
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => handlePageChange(page)}
                        className={`px-3 py-1 border-t border-b border-gray-300 bg-white text-sm font-medium ${currentPage === page ? 'text-[#2A787A] bg-blue-50' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        {page}
                      </button>
                    )
                  )}
                  <button
                    onClick={() =>
                      handlePageChange(Math.min(totalPages, currentPage + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Next
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </section>

      <Footer />
    </>
  );
};

export default Bookappoientment;
