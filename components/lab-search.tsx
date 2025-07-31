// components/lab-search.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Hospital, MapPin, Calendar, Search } from 'lucide-react';

const LabSearch = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');

  const handleSearch = () => {
    const queryParams = new URLSearchParams();
    if (searchQuery) queryParams.append('search', searchQuery);
    if (location) queryParams.append('location', location);
    if (date) queryParams.append('date', date);

    router.push(`/BookAppoientment?${queryParams.toString()}`);
  };

  return (
    <>
      <section className="text-center mt-10 select-none">
        <h1 className="text-7xl font-extrabold text-[#2B7C7E] drop-shadow-sm my-10 select-none pointer-events-none">
          Lab Search
        </h1>

        <div
          className="mt-6 flex justify-center px-4"
          style={{ fontFamily: 'Lufga Regular, Urbanist, sans-serif' }}
        >
          <div className="border border-[#2B7C7E] rounded-2xl sm:rounded-[64px] bg-white backdrop-blur-md p-4 shadow-lg flex flex-col sm:flex-row items-center gap-3 w-full max-w-4xl">
            {/* Search Input with Hospital Icon */}
            <div className="relative w-full sm:w-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Hospital className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Search for nearby Pathlabs"
                className="pl-10 pr-3 py-2 border-r-0 sm:border-r-2 border-[#E6E8EE] w-full sm:w-72 text-black focus:outline-none bg-transparent"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-52">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MapPin className="h-5 w-5 text-gray-500" />
              </div>
              <input
                type="text"
                placeholder="Location"
                className="pl-10 pr-3 py-2 border-r-0 sm:border-r-2 border-[#E6E8EE] w-full text-black focus:outline-none bg-transparent"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="relative w-full sm:w-52">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="h-5 w-5 text-gray-500" />
              </div>

              <input
                type="date"
                className="pl-10 pr-3 py-2 w-full text-[#6b7684] focus:outline-none bg-transparent"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            {/* Search Button with Search Icon */}
            <button
              className="w-full sm:w-auto px-6 py-3 rounded-2xl sm:rounded-[64px] bg-[#2B7C7E] text-white font-semibold flex justify-center items-center gap-2 hover:bg-[#236667] transition-colors cursor-pointer"
              style={{
                fontFamily: 'ClashDisplay-SemiBold, Urbanist, sans-serif',
              }}
              onClick={handleSearch}
            >
              <Search className="h-5 w-5" />
              Search
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default LabSearch;
