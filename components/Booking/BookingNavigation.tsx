'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookingNavigationProps {
  onBack: () => void;
  onNext: () => void;
  nextDisabled?: boolean;
  backText: string;
  nextText: string;
}

export default function BookingNavigation({
  onBack,
  onNext,
  nextDisabled = false,
  backText,
  nextText,
}: BookingNavigationProps) {
  return (
    <div className="w-full max-w-4xl flex flex-col sm:flex-row justify-between items-center mt-8 px-2 select-none gap-4 sm:gap-0">
      <button
        onClick={onBack}
        className="w-full sm:w-auto bg-[#37AFA2] hover:bg-[#2f9488] transition-colors text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg cursor-pointer"
      >
        <ChevronLeft size={22} />
        {backText}
      </button>
      <button
        onClick={onNext}
        disabled={nextDisabled}
        className={`w-full sm:w-auto py-3 px-6 rounded-lg flex items-center justify-center gap-1 shadow-lg font-bold transition-colors cursor-pointer ${
          nextDisabled
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-[#37AFA2] hover:bg-[#2f9488] text-white'
        }`}
      >
        {nextText}
        <ChevronRight size={22} />
      </button>
    </div>
  );
}
