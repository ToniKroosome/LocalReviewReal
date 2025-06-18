import React, { useState } from 'react';

const FilterBar = ({ onFilterChange, language }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'All Categories',
    shopType: '',
    onlineType: '',
    city: '',
    district: '',
    zone: '',
    subDistrict: '',
    street: '',
    alley: ''
  });


  const shopCategories = [
    'All Categories',
    'Online',
    'Real World',
    'Local Services',
    'Facebook Marketplace',
    'Goods & Products',
    'Landlords',
    'Restaurants & Cafes',
    'Retail Stores',
    'Education',
  ];

  const onlineTypes = [
    'Social Media App',
    'Website',
    'Individual Remote Services',
  ];

  const locationLevels = {
    city: ['All Cities', 'Bangkok'],
    district: ['All Districts', 'Sathorn', 'Watthana', 'Khlong Toei', 'Lat Phrao'],
    zone: ['All Zones', 'Sukhumvit Extension', 'Port Area', 'Convention Center Area'],
    subDistrict: ['All Sub-Districts', 'Khlong Toei', 'Khlong Tan', 'Phra Khanong', 'Lumphini'],
    street: ['All Streets', 'Sukhumvit Road'],
    alley: ['All Alleys', 'Sukhumvit Soi 1', 'Sukhumvit Soi 3 (Nana Nuea)', 'Sukhumvit Soi 11', 'Sukhumvit Soi 21 (Asok)'],
  };


  const handleFilterClick = (level, value) => {
    const updatedFilters = { ...selectedFilters };
    const levels = Object.keys(locationLevels);
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
      <div className="filter-row">
        {shopCategories.map((type) => (
          <button
            key={type}
            className={`filter-button ${selectedFilters.category === type ? 'active' : ''}`}
            onClick={() => {
              const updated = { ...selectedFilters, category: type, onlineType: '' };
              setSelectedFilters(updated);
              onFilterChange(updated);
            }}
          >
            {type}
          </button>
        ))}
      </div>

      {selectedFilters.category === 'Online' && (
        <div className="filter-row">
          {onlineTypes.map((opt) => (
            <button
              key={opt}
              className={`filter-button ${selectedFilters.onlineType === opt ? 'active' : ''}`}
              onClick={() => {
                const updated = { ...selectedFilters, onlineType: opt };
                setSelectedFilters(updated);
                onFilterChange(updated);
              }}
            >
              {opt}
            </button>
          ))}
        </div>
      )}

      {Object.entries(locationLevels).map(([level, options]) => {
        const prevLevel = Object.keys(locationLevels)[Object.keys(locationLevels).indexOf(level) - 1];
        const shouldShow = !prevLevel || selectedFilters[prevLevel] !== '';

        if (!shouldShow) return null;

        return (
          <div key={level} className="filter-row">
            {options.map((option) => (
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
