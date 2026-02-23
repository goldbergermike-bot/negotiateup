'use client';

import { useState, useEffect, useRef } from 'react';

export default function CompanyAutocomplete({ value, onChange, name, required, className, placeholder, accentColor = 'accent' }) {
  const [companies, setCompanies] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [hasMatch, setHasMatch] = useState(false);
  const wrapperRef = useRef(null);

  // Load company list on mount
  useEffect(() => {
    fetch('/api/companies')
      .then((res) => res.json())
      .then((data) => setCompanies(data))
      .catch(() => {});
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Update suggestions when input changes
  useEffect(() => {
    if (!value || value.length < 2 || companies.length === 0) {
      setSuggestions([]);
      setHasMatch(false);
      return;
    }

    const query = value.toLowerCase();
    const matches = companies.filter((c) =>
      c.name.toLowerCase().includes(query) || c.id.includes(query)
    ).slice(0, 8);

    setSuggestions(matches);

    // Check if current value is an exact match
    const exactMatch = companies.some(
      (c) => c.name.toLowerCase() === query || c.id === query
    );
    setHasMatch(exactMatch);
  }, [value, companies]);

  const handleSelect = (company) => {
    onChange({ target: { name, value: company.name } });
    setShowDropdown(false);
    setHasMatch(true);
  };

  const handleInputChange = (e) => {
    onChange(e);
    setShowDropdown(true);
  };

  const borderColor = accentColor === 'blue' ? 'focus:border-blue' : 'focus:border-accent';
  const badgeBg = accentColor === 'blue' ? 'bg-blue/10 text-blue' : 'bg-accent-light text-accent';

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        name={name}
        required={required}
        value={value}
        onChange={handleInputChange}
        onFocus={() => value.length >= 2 && setSuggestions.length > 0 && setShowDropdown(true)}
        className={className || `w-full px-4 py-3 rounded-xl border border-border bg-paper text-sm focus:outline-none ${borderColor}`}
        placeholder={placeholder || 'Start typing a company name...'}
        autoComplete="off"
      />

      {/* Verified data badge */}
      {hasMatch && (
        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeBg}`}>
          Verified Data
        </span>
      )}

      {/* Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-border rounded-xl shadow-lg max-h-[240px] overflow-y-auto">
          {suggestions.map((company) => (
            <button
              key={company.id}
              type="button"
              onClick={() => handleSelect(company)}
              className="w-full text-left px-4 py-3 text-sm hover:bg-paper transition-colors first:rounded-t-xl last:rounded-b-xl flex items-center justify-between"
            >
              <span>{company.name}</span>
              <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${badgeBg}`}>
                Verified
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
