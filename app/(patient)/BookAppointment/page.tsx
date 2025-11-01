// app/(patient)/BookAppointment/page.tsx
'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { AnimatePresence } from 'framer-motion';
import Navbar from '@/components/navbar';
import Footer from '@/components/footer';
import LabSearch from '@/components/lab-search';
import { Pagination } from '@/components/BookApointment/Pagination/Pagination';
import { MapView } from '@/components/BookApointment/MapView/MapView';
import { ResultsHeader, EmptyResults } from '@/components/BookApointment';
import {
  DesktopFilters,
  MobileFilters,
} from '@/components/BookApointment/Filters';
import {
  Lab,
  Filters,
  SearchFilters,
} from '@/components/BookApointment/Filters/types';
import { LabCard } from '@/components/BookApointment/LabCard';
import { handlePageChange, toggleLove } from './action';
import axios from 'axios';

const ITEMS_PER_PAGE = 7;

const getToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const BookAppointment = () => {
  const searchParams = useSearchParams();
  const [labs, setLabs] = useState<Lab[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const [labsLoading, setLabsLoading] = useState(true);

  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    searchQuery: '',
    location: '',
    date: '',
  });

  // Read view mode from URL params or default to 'list'
  const urlViewMode = searchParams.get('view');
  const [viewMode, setViewMode] = useState<'list' | 'map'>(
    urlViewMode === 'map' ? 'map' : 'list'
  );

  const [filters, setFilters] = useState<Filters>({
    testType: '',
    availability: '',
    experience: 0,
    collectionTypes: [],
    rating: 0,
    distance: 25,
  });
  const [sortBy, setSortBy] = useState<string>('rating');
  const [showAllTestTypes, setShowAllTestTypes] = useState(false);

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        setLabsLoading(true);
        const res = await axios.get('/api/lab');
        const data: Lab[] = res.data;
        setLabs(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLabsLoading(false);
      }
    };

    fetchLabs();
  }, []);

  // useEffect(() => {
  //   try {
  //     setLabsLoading(true)
  //     axios.get('/api/lab').then((res) => {
  //       const data: Lab[] = res.data;
  //       setLabs(data);
  //       setLabsLoading(false)
  //     });
  //   } catch (err) {
  //     console.error(err);
  //     setLabsLoading(false)
  //   }
  // }, []);

  useEffect(() => {
    const searchQuery = searchParams.get('search') || '';
    const location = searchParams.get('location') || '';
    const date = searchParams.get('date') || '';
    const viewParam = searchParams.get('view');

    setSearchFilters({ searchQuery, location, date });

    // Update view mode if specified in URL
    if (viewParam === 'map' || viewParam === 'list') {
      setViewMode(viewParam);
    }

    setCurrentPage(1);
  }, [searchParams]);

  // Listen for custom events from LabInfo component
  useEffect(() => {
    const handleViewModeChange = (event: CustomEvent) => {
      setViewMode(event.detail);
    };

    window.addEventListener(
      'viewModeChange',
      handleViewModeChange as EventListener
    );

    return () => {
      window.removeEventListener(
        'viewModeChange',
        handleViewModeChange as EventListener
      );
    };
  }, []);

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
      distance: 25,
    });
    setCurrentPage(1);
    document
      .querySelectorAll<HTMLInputElement>('input[type="radio"]')
      .forEach((radio) => (radio.checked = false));
    document
      .querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
      .forEach((checkbox) => (checkbox.checked = false));
  };

  const testTypeCounts = useMemo(() => {
    return labs.reduce((acc: Record<string, number>, lab) => {
      acc[lab.testType] = (acc[lab.testType] || 0) + 1;
      return acc;
    }, {});
  }, [labs]);

  const filteredAndSortedLabs = useMemo(() => {
    let filtered = [...labs];

    if (searchFilters.searchQuery) {
      const query = searchFilters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (lab) =>
          lab.name.toLowerCase().includes(query) ||
          lab.testType.toLowerCase().includes(query)
      );
    }

    if (searchFilters.location) {
      const locationQuery = searchFilters.location.toLowerCase();
      filtered = filtered.filter((lab) =>
        lab.location.toLowerCase().includes(locationQuery)
      );
    }

    if (searchFilters.date) {
      filtered = filtered.filter(
        (lab) => lab.nextAvailable === searchFilters.date
      );
    }

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
        filters.collectionTypes.every((type: string) =>
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
  }, [labs, searchFilters, filters, sortBy]);

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

  const handleViewModeChange = (mode: 'list' | 'map') => {
    setViewMode(mode);
    // Update URL with view parameter
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', mode);
    window.history.pushState({}, '', `?${params.toString()}`);
  };

  if (labsLoading) {
    return (
      <div
        className="min-h-screen flex flex-col"
        style={{
          background:
            'linear-gradient(180deg, #05303B -14.4%, #2B7C7E 11.34%, #91D8C1 40%, #FFF 75%)',
        }}
      >
        <div className="text-white">
          <Navbar />
        </div>

        <div className="flex flex-col justify-center items-center my-auto">
          <div className="w-20 h-20 mx-auto">
            <Image width='80' height='80' src="/main-loading.webm" alt="Loading..." />
          </div>
          <div className="mt-2 text-center text-slate-700 font-semibold">
            Setting things up for you . . .
          </div>
        </div>
      </div>
    );
  }

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

      <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 mt-4 sm:mt-15 bg-white mb-20 text-black select-none ">
        {viewMode === 'list' ? (
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-8">
            <MobileFilters
              filters={filters}
              testTypeCounts={testTypeCounts}
              showAllTestTypes={showAllTestTypes}
              onFilterChange={handleFilterChange}
              onCollectionTypeChange={handleCollectionTypeChange}
              onToggleShowAllTestTypes={() =>
                setShowAllTestTypes(!showAllTestTypes)
              }
              onClearAllFilters={clearAllFilters}
              allAvailableTestTypes={allAvailableTestTypes}
              visibleTestTypes={visibleTestTypes}
            />

            <DesktopFilters
              filters={filters}
              testTypeCounts={testTypeCounts}
              showAllTestTypes={showAllTestTypes}
              onFilterChange={handleFilterChange}
              onCollectionTypeChange={handleCollectionTypeChange}
              onToggleShowAllTestTypes={() =>
                setShowAllTestTypes(!showAllTestTypes)
              }
              onClearAllFilters={clearAllFilters}
              allAvailableTestTypes={allAvailableTestTypes}
              visibleTestTypes={visibleTestTypes}
            />

            <main className="w-full lg:w-3/4 xl:w-4/5 overflow-hidden">
              <ResultsHeader
                count={filteredAndSortedLabs.length}
                sortBy={sortBy}
                viewMode={viewMode}
                onSortChange={setSortBy}
                onViewModeChange={handleViewModeChange}
              />

              <div className="space-y-4">
                <AnimatePresence>
                  {paginatedLabs.length > 0 ? (
                    paginatedLabs.map((lab) => (
                      <LabCard
                        key={lab.id}
                        lab={lab}
                        onLoveClick={() => toggleLove(lab.id, labs, setLabs)}
                      />
                    ))
                  ) : (
                    <EmptyResults />
                  )}
                </AnimatePresence>
              </div>
            </main>
          </div>
        ) : (
          <MapView
            labs={filteredAndSortedLabs}
            onViewModeChange={handleViewModeChange}
          />
        )}
      </section>

      {viewMode === 'list' && totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={(page) => handlePageChange(page, setCurrentPage)}
        />
      )}

      <Footer />
    </>
  );
};

export default BookAppointment;
