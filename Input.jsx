import React from 'react';

export default function Input({ 
  label, 
  error, 
  className = '', 
  required = false,
  ...props 
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="block text-sm font-semibold text-[#3D3D4E] dark:text-[#EAEAEA]">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        className={`
          w-full px-4 py-2.5 border border-[#DADADA] dark:border-[#444] 
          rounded-2xl focus:ring-2 focus:ring-[#A78BFA] focus:border-transparent
          bg-[#F9FAFB] dark:bg-[#2C2C2E] text-[#333] dark:text-white
          placeholder-[#A0A0AB] dark:placeholder-[#888]
          shadow-sm focus:shadow-md transition-all duration-200 ease-in-out
          ${error ? 'border-red-400 focus:ring-red-400' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
      )}
    </div>
  );
}
