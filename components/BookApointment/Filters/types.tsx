// components/BookAppointment/types.ts
export interface Lab {
  id: number;
  name: string;
  testType: string;
  location: string;
  nextAvailable: string;
  rating: number;
  experience: number;
  isAvailable: boolean;
  isLoved: boolean;
  image: string;
  collectionTypes: string[];
  timeSlots: {
    Morning: string[];
    Afternoon: string[];
    Evening: string[];
  };
}

export interface Filters {
  testType: string;
  availability: string;
  experience: number;
  collectionTypes: string[];
  rating: number;
  distance: number;
}

export interface SearchFilters {
  searchQuery: string;
  location: string;
  date: string;
}
