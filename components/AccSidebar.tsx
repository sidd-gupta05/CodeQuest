'use client';
import { useState } from 'react';
import Image from 'next/image';
interface AccountButtonProps {
  type: string;
  label: string;
  icon: string;
  isSelected: boolean;
  onSelect: (type: string) => void;
}

const AccountButton: React.FC<AccountButtonProps> = ({
  type,
  label,
  icon,
  isSelected,
  onSelect,
}) => {
  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSelected) {
      e.currentTarget.style.background =
        'linear-gradient(26.61deg, #05303B 0.93%, #2B7C7E 101.37%)';
    }
  };

  const handleMouseLeave = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isSelected) {
      e.currentTarget.style.background = '';
    }
  };

  return (
    <button
      className={`group flex-1 flex flex-col items-center p-4 rounded-lg shadow-sm transition-all duration-200 cursor-pointer ${
        isSelected ? 'text-white' : 'text-gray-700 hover:text-white'
      }`}
      onClick={() => onSelect(type)}
      style={{
        background: isSelected
          ? 'linear-gradient(26.61deg, #05303B 0.93%, #2B7C7E 101.37%)'
          : undefined,
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        className={`text-2xl mb-1 transition-colors ${
          isSelected ? 'text-white' : 'text-teal-600 group-hover:text-white'
        }`}
      >
        {icon}
      </span>
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
};

interface AccountTypeSidebarProps {
  onSelect: (type: string) => void;
}

export const AccountTypeSidebar: React.FC<AccountTypeSidebarProps> = ({
  onSelect,
}) => {
  const [accountType, setAccountType] = useState<string>('');

  const handleSelect = (type: string) => {
    setAccountType(type);
    onSelect(type);
  };

  return (
    <div className="bg-white flex items-center justify-center p-10">
      <div className="max-w-md w-full flex flex-col justify-center">
        <div className="mb-6">
          <Image
            className="mx-auto mb-4"
            src="/labsphere-icon.svg"
            alt="Labsphere Logo"
            width={307}
            height={111}
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              const target = e.target as HTMLImageElement;
              target.onerror = null;
              target.src = '/labsphere-icon.svg';
            }}
          />

          <label className="block text-teal-600 text-xl text-center font-semibold mb-2">
            Choose Account Type
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            <AccountButton
              type="PATIENT"
              label="Patient"
              icon="🧑"
              isSelected={accountType === 'PATIENT'}
              onSelect={handleSelect}
            />
            <AccountButton
              type="LAB"
              label="Lab"
              icon="🔬"
              isSelected={accountType === 'LAB'}
              onSelect={handleSelect}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
