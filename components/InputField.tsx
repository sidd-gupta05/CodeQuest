// Reusable Input Component (using Tailwind classes for styling)
import React from 'react';

interface InputFieldProps {
  label: string;
  type?: string;
  id: string;
  value: string | number;
  onChange: React.ChangeEventHandler<HTMLInputElement>;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  placeholder?: string;
  step?: string | number;
  min?: string | number;
  required?: boolean;
  disabled?: boolean;
  name?: string; 
}

const InputField: React.FC<InputFieldProps> = ({ label, type = 'text', id, value, onChange, icon: Icon, placeholder, step, min, required, disabled }) => (
  <div className="mb-4">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-1">
      {Icon && <Icon className="inline-block w-4 h-4 mr-2 text-indigo-500" />}
      {label}
      {required && <span className="text-red-500 ml-1">*</span>}
    </label>
    <input
      type={type}
      id={id}
      name={id}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition duration-150 ease-in-out disabled:bg-gray-100 disabled:cursor-not-allowed"
      step={step}
      min={min}
      required={required}
      disabled={disabled}
    />
  </div>
);

export default InputField;