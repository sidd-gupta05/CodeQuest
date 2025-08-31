//components/Booking/AddOns.tsx
'use client';

import { useState, useEffect } from 'react';
import BookingHeader from './BookingHeader';
import BookingNavigation from './BookingNavigation';

interface AddOnsProps {
  onBack: () => void;
  onNext: () => void;
  selectedLab: any;
  appointmentDate: string;
  appointmentTime: string;
  selectedAddons: string[];
  onAddonsChange: (addons: string[]) => void;
}

export default function AddOns({
  onBack,
  onNext,
  selectedLab,
  appointmentDate,
  appointmentTime,
  selectedAddons,
  onAddonsChange,
}: AddOnsProps) {
  const [localAddons, setLocalAddons] = useState<string[]>(selectedAddons);

  useEffect(() => {
    setLocalAddons(selectedAddons);
  }, [selectedAddons]);

  const handleAddonToggle = (addonName: string) => {
    let newAddons;

    // Handle mutually exclusive delivery options
    if (
      addonName === 'Express Delivery' ||
      addonName === 'Superfast Delivery'
    ) {
      // Remove any existing delivery options first
      newAddons = localAddons.filter(
        (a) => a !== 'Express Delivery' && a !== 'Superfast Delivery'
      );

      // Add the selected delivery option if it's not already selected
      if (!localAddons.includes(addonName)) {
        newAddons = [...newAddons, addonName];
      }
    } else {
      // For non-delivery options, toggle normally
      newAddons = localAddons.includes(addonName)
        ? localAddons.filter((a) => a !== addonName)
        : [...localAddons, addonName];
    }

    setLocalAddons(newAddons);
    onAddonsChange(newAddons);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 text-black w-full max-w-4xl my-8">
      <BookingHeader
        selectedLab={selectedLab}
        appointmentDate={appointmentDate}
        appointmentTime={appointmentTime}
      />

      <div className="border-b border-gray-200 my-6"></div>

      <h3 className="font-bold text-gray-800 text-lg mb-4">Services</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[
          {
            name: 'Express Delivery',
            price: 500,
            description: '(within 2 hrs)',
          },
          {
            name: 'Superfast Delivery',
            price: 350,
            description: '(within 6 hrs)',
          },
          {
            name: 'AI health Summary',
            price: 200,
            description: '(summary with alerts)',
          },
          {
            name: 'Doctor Suggestion',
            price: 200,
            description: '(according to your report)',
          },
        ].map((addon, index) => (
          <button
            key={index}
            onClick={() => handleAddonToggle(addon.name)}
            className={`flex justify-between items-center p-4 border rounded-lg transition-colors ${
              localAddons.includes(addon.name)
                ? 'border-[#37AFA2] bg-teal-50 shadow-md'
                : 'border-gray-200 hover:border-teal-400'
            } ${
              // Disable Superfast Delivery if Express is selected and vice versa
              (addon.name === 'Superfast Delivery' &&
                localAddons.includes('Express Delivery')) ||
              (addon.name === 'Express Delivery' &&
                localAddons.includes('Superfast Delivery'))
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={
              // Disable the button if the opposite delivery option is selected
              (addon.name === 'Superfast Delivery' &&
                localAddons.includes('Express Delivery')) ||
              (addon.name === 'Express Delivery' &&
                localAddons.includes('Superfast Delivery'))
            }
          >
            <div className="text-left">
              <p className="font-semibold text-gray-800">{addon.name}</p>
              <p className="text-sm text-gray-500">{addon.description}</p>
              <p className="mt-1 font-bold text-[#37AFA2]">+ ₹{addon.price}</p>
            </div>
            <div
              className={`w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center ${
                localAddons.includes(addon.name)
                  ? 'border-[#37AFA2] bg-[#37AFA2]'
                  : 'border-gray-400'
              }`}
            >
              {localAddons.includes(addon.name) && (
                <div className="w-2.5 h-2.5 bg-white rounded-full"></div>
              )}
            </div>
          </button>
        ))}
      </div>

      <BookingNavigation
        onBack={onBack}
        onNext={onNext}
        backText="Back"
        nextText="Proceed to Payment"
      />
    </div>
  );
}
