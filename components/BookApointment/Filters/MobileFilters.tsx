// components/BookAppointment/Filters/MobileFilters.tsx
import React from 'react';
import { Star } from 'lucide-react';
import { Filters } from './types';
import { FilterSection, FilterOption, DistanceFilter } from './FilterSection';

interface MobileFiltersProps {
  filters: Filters;
  testTypeCounts: Record<string, number>;
  showAllTestTypes: boolean;
  onFilterChange: (filterName: keyof Filters, value: any) => void;
  onCollectionTypeChange: (type: string) => void;
  onToggleShowAllTestTypes: () => void;
  onClearAllFilters: () => void;
  allAvailableTestTypes: string[];
  visibleTestTypes: string[];
}

export const MobileFilters: React.FC<MobileFiltersProps> = ({
  filters,
  testTypeCounts,
  showAllTestTypes,
  onFilterChange,
  onCollectionTypeChange,
  onToggleShowAllTestTypes,
  onClearAllFilters,
  allAvailableTestTypes,
  visibleTestTypes,
}) => {
  const handleRadioChange = (filterName: keyof Filters, value: any) => {
    if (filters[filterName] !== value) {
      onFilterChange(filterName, value);
    }
  };

  return (
    <div className="lg:hidden w-full">
      <details className="border rounded-lg shadow-sm bg-white">
        <summary className="p-4 font-bold text-lg cursor-pointer">
          Filters
        </summary>
        <div className="p-4 border-t">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={onClearAllFilters}
              className="text-sm text-[#2A787A] hover:text-[#1c3434] cursor-pointer"
            >
              Clear All
            </button>
          </div>
          <div className="space-y-6">
            <FilterSection title="Test Type">
              <ul className="space-y-1 text-gray-600">
                {visibleTestTypes.map((testType) => (
                  <FilterOption
                    key={testType}
                    label={testType}
                    checked={filters.testType === testType}
                    onChange={() => onFilterChange('testType', testType)}
                    count={testTypeCounts[testType]}
                  />
                ))}
              </ul>
              {allAvailableTestTypes.length > 5 && (
                <button
                  onClick={onToggleShowAllTestTypes}
                  className="text-sm text-[#2A787A] mt-2 cursor-pointer hover:underline"
                >
                  {showAllTestTypes ? 'View Less' : 'View More'}
                </button>
              )}
            </FilterSection>

            <FilterSection title="Availability">
              <ul className="space-y-1 text-gray-600">
                <FilterOption
                  label="Available Today"
                  checked={filters.availability === 'today'}
                  onChange={() => handleRadioChange('availability', 'today')}
                  name="availability"
                />
                <FilterOption
                  label="Available Tomorrow"
                  checked={filters.availability === 'tomorrow'}
                  onChange={() => handleRadioChange('availability', 'tomorrow')}
                  name="availability"
                />
                <FilterOption
                  label="Available in next 7 days"
                  checked={filters.availability === 'next7'}
                  onChange={() => handleRadioChange('availability', 'next7')}
                  name="availability"
                />
                <FilterOption
                  label="Available in next 30 days"
                  checked={filters.availability === 'next30'}
                  onChange={() => handleRadioChange('availability', 'next30')}
                  name="availability"
                />
              </ul>
            </FilterSection>

            <FilterSection title="Distance Range">
              <DistanceFilter
                distance={filters.distance}
                onChange={(value) => onFilterChange('distance', value)}
              />
            </FilterSection>

            <FilterSection title="Experience">
              <ul className="space-y-1 text-gray-600">
                <FilterOption
                  label="2+ Years"
                  checked={filters.experience === 2}
                  onChange={() => handleRadioChange('experience', 2)}
                  name="experience"
                />
                <FilterOption
                  label="5+ Years"
                  checked={filters.experience === 5}
                  onChange={() => handleRadioChange('experience', 5)}
                  name="experience"
                />
                <FilterOption
                  label="10+ Years"
                  checked={filters.experience === 10}
                  onChange={() => handleRadioChange('experience', 10)}
                  name="experience"
                />
              </ul>
            </FilterSection>

            <FilterSection title="Collection Type">
              <ul className="space-y-1 text-gray-600">
                <FilterOption
                  label="Home Collection"
                  checked={filters.collectionTypes.includes('Home Collection')}
                  onChange={() => onCollectionTypeChange('Home Collection')}
                  type="checkbox"
                />
                <FilterOption
                  label="Visiting to Lab"
                  checked={filters.collectionTypes.includes('Visiting to Lab')}
                  onChange={() => onCollectionTypeChange('Visiting to Lab')}
                  type="checkbox"
                />
              </ul>
            </FilterSection>

            <FilterSection title="Ratings">
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((star) => (
                  <button
                    key={star}
                    onClick={() => onFilterChange('rating', star)}
                    className={`w-full text-left p-2 rounded-lg flex items-center border ${
                      filters.rating === star
                        ? 'bg-yellow-100 border-yellow-400'
                        : 'hover:bg-gray-100'
                    }`}
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
            </FilterSection>
          </div>
        </div>
      </details>
    </div>
  );
};
