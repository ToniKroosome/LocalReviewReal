import React, { useState } from 'react';

const FilterBar = ({ onFilterChange }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'All',
    city: '',
    district: '',
    zone: '',
    subDistrict: '',
    street: '',
    alley: ''
  });

  const filterLevels = {
    category: ['All Categories', 'Online', 'Real World', 'Local Services', 'Facebook Marketplace', 
               'Goods & Products', 'Landlords', 'Restaurants & Cafes', 'Retail Stores', 'Education'],
    city: ['All Cities', 'Bangkok'],
    district: ['All Districts', 'Sathorn', 'Watthana', 'Khlong Toei', 'Lat Phrao'],
    zone: ['All Zones', 'Sukhumvit Extension', 'Port Area', 'Convention Center Area'],
    subDistrict: ['All Sub-Districts', 'Khlong Toei', 'Khlong Tan', 'Phra Khanong', 'Lumphini'],
    street: ['All Streets', 'Sukhumvit Road'],
    alley: ['All Alleys', 'Sukhumvit Soi 1', 'Sukhumvit Soi 3 (Nana Nuea)', 'Sukhumvit Soi 11', 'Sukhumvit Soi 21 (Asok)']
  };

  const handleFilterClick = (level, value) => {
    const updatedFilters = { ...selectedFilters };
    const levels = Object.keys(filterLevels);
    const currentIndex = levels.indexOf(level);

    levels.forEach((filterLevel, index) => {
      if (index === currentIndex) {
        updatedFilters[filterLevel] = value;
      } else if (index > currentIndex) {
        updatedFilters[filterLevel] = '';
      }
    });

    setSelectedFilters(updatedFilters);
    onFilterChange(updatedFilters);
  };

  return (
    <div className="filter-bar">
      {Object.entries(filterLevels).map(([level, options]) => {
        const shouldShow = level === 'category' ||
          (selectedFilters[Object.keys(filterLevels)[Object.keys(filterLevels).indexOf(level) - 1]] !== '');

        if (!shouldShow) return null;

        return (
          <div key={level} className="filter-row">
            {options.map(option => (
              <button
                key={option}
                className={`filter-button ${selectedFilters[level] === option ? 'active' : ''}`}
                onClick={() => handleFilterClick(level, option)}
              >
                {option}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default FilterBar;
