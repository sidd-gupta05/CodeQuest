<<<<<<< HEAD
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Filter } from 'lucide-react';

export function SearchFilter({
  searchTerm,
  setSearchTerm,
  filterCategory,
  setFilterCategory,
}: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}) {
=======
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter } from "lucide-react";

<<<<<<< HEAD
export function SearchFilter({ searchTerm, setSearchTerm, filterCategory, setFilterCategory }: any) {
>>>>>>> 8f4a36f (inventory components)
=======
export function SearchFilter({ searchTerm, setSearchTerm, filterCategory, setFilterCategory }: {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterCategory: string;
  setFilterCategory: (category: string) => void;
}) {
>>>>>>> 4aabe68 (modularization of inventory)
  return (
    <div className="flex items-center space-x-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search reagents or batch numbers..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 border-[#e8e8e9]"
        />
      </div>
<<<<<<< HEAD
      {/* <Select value={filterCategory} onValueChange={setFilterCategory}>
=======
      <Select value={filterCategory} onValueChange={setFilterCategory}>
>>>>>>> 8f4a36f (inventory components)
        <SelectTrigger className="w-48 border-[#e8e8e9]">
          <Filter className="h-4 w-4 mr-2" />
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
<<<<<<< HEAD
          {[
            'all',
            'Hematology',
            'Molecular',
            'Clinical Chemistry',
            'General',
          ].map((c) => (
            <SelectItem key={c} value={c}>
              {c}
            </SelectItem>
          ))}
        </SelectContent>
      </Select> */}
=======
          {["all","Hematology","Molecular","Clinical Chemistry","General"].map(c => (
            <SelectItem key={c} value={c}>{c}</SelectItem>
          ))}
        </SelectContent>
      </Select>
>>>>>>> 8f4a36f (inventory components)
    </div>
  );
}
