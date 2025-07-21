import React from 'react';

export default function ModernInput({
  label,
  error,
  icon,
  className = '',
  required = false,
  ...props
}) {
  return (
    <div className="space-y-2">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="text-error ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-tertiary">
            {icon}
          </div>
        )}
        <input
          className={`form-input ${icon ? 'pl-10' : ''} ${error ? 'border-error' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-error">{error}</p>
      )}
    </div>
  );
}