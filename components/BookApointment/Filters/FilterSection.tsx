// // components/BookAppointment/Filters/FilterSection.tsx
// import React from 'react';
// import { Star } from 'lucide-react';

// interface FilterSectionProps {
//   title: string;
//   children: React.ReactNode;
// }

// export const FilterSection: React.FC<FilterSectionProps> = ({
//   title,
//   children,
// }) => (
//   <div>
//     <h3 className="font-semibold mb-2">{title}</h3>
//     {children}
//   </div>
// );

// interface FilterOptionProps {
//   label: string;
//   checked: boolean;
//   onChange: () => void;
//   type?: 'radio' | 'checkbox';
//   name?: string;
//   count?: number;
// }

// export const FilterOption: React.FC<FilterOptionProps> = ({
//   label,
//   checked,
//   onChange,
//   type = 'radio',
//   name = 'filter',
//   count,
// }) => {
//   const inputRef = React.useRef<HTMLInputElement>(null);

//   const handleClick = (e: React.MouseEvent) => {
//     if (type === 'radio') {
//       if (checked) {
//         e.preventDefault();
//         return;
//       }
//       // Force immediate UI update for radio buttons
//       if (inputRef.current) {
//         inputRef.current.checked = true;
//       }
//     }
//     onChange();
//   };

//   return (
//     <li className="flex justify-between items-center cursor-pointer hover:text-[#2A787A]">
//       <label className="flex items-center w-full">
//         <input
//           ref={inputRef}
//           type={type}
//           name={name}
//           className="mr-2"
//           checked={checked}
//           onChange={onChange}
//           onClick={handleClick}
//         />
//         <span className={checked ? 'font-bold text-[#2A787A]' : ''}>
//           {label}
//         </span>
//       </label>
//       {count !== undefined && (
//         <span className="text-xs bg-gray-200 py-0.5 px-1.5 rounded">
//           {count}
//         </span>
//       )}
//     </li>
//   );
// };

// interface DistanceFilterProps {
//   distance: number;
//   onChange: (value: number) => void;
// }

// export const DistanceFilter: React.FC<DistanceFilterProps> = ({
//   distance,
//   onChange,
// }) => (
//   <div className="px-2">
//     <input
//       type="range"
//       min="0"
//       max="50"
//       value={distance}
//       step="1"
//       className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
//       onChange={(e) => onChange(parseInt(e.target.value))}
//     />
//     <div className="flex justify-between text-sm text-gray-600 mt-1">
//       <span>0 km</span>
//       <span>{distance} km</span>
//       <span>50 km</span>
//     </div>
//   </div>
// );

// components/BookAppointment/Filters/FilterSection.tsx
import React from 'react';
import { Star } from 'lucide-react';

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
}

export const FilterSection: React.FC<FilterSectionProps> = ({
  title,
  children,
}) => (
  <div>
    <h3 className="font-semibold mb-2">{title}</h3>
    {children}
  </div>
);

interface FilterOptionProps {
  label: string;
  checked: boolean;
  onChange: () => void;
  type?: 'radio' | 'checkbox';
  name?: string;
  count?: number;
}

export const FilterOption: React.FC<FilterOptionProps> = ({
  label,
  checked,
  onChange,
  type = 'radio',
  count,
}) => {
  return (
    <li
      className={`flex justify-between items-center cursor-pointer ${checked ? 'font-bold text-[#2A787A]' : 'text-gray-600 hover:text-[#2A787A]'}`}
      onClick={onChange}
    >
      <span>{label}</span>
      {count !== undefined && (
        <span className="text-xs bg-gray-200 py-0.5 px-1.5 rounded">
          {count}
        </span>
      )}
    </li>
  );
};

interface DistanceFilterProps {
  distance: number;
  onChange: (value: number) => void;
}

export const DistanceFilter: React.FC<DistanceFilterProps> = ({
  distance,
  onChange,
}) => (
  <div className="px-2">
    <input
      type="range"
      min="0"
      max="50"
      value={distance}
      step="1"
      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
      onChange={(e) => onChange(parseInt(e.target.value))}
    />
    <div className="flex justify-between text-sm text-gray-600 mt-1">
      <span>0 km</span>
      <span>{distance} km</span>
      <span>50 km</span>
    </div>
  </div>
);
