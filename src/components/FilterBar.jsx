import React, { useState, useMemo } from 'react';
import { categories } from '../data/categories';

const FilterBar = ({ onFilterChange, language }) => {
  const [selectedFilters, setSelectedFilters] = useState({
    category: 'All',
    shopType: '',
    city: '',
    district: '',
    zone: '',
    subDistrict: '',
    street: '',
    alley: ''
  });

  const shopTypeOptions = useMemo(() => {
    const types = [];
    categories.forEach(cat => {
      const subcats = cat.subcategories || cat.platforms || [];
      subcats.forEach(sc => {
        types.push({ value: sc.value, label: sc.label, label_th: sc.label_th });
        if (sc.subcategories) {
          sc.subcategories.forEach(s2 =>
            types.push({ value: s2.value, label: s2.label, label_th: s2.label_th })
          );
        }
      });
    });
    const seen = new Set();
    return types.filter(t => {
      if (seen.has(t.value)) return false;
      seen.add(t.value);
      return true;
    });
  }, []);

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
      <div className="filter-row">
        <select
          className="filter-select"
          value={selectedFilters.shopType}
          onChange={(e) => {
            const updated = { ...selectedFilters, shopType: e.target.value };
            setSelectedFilters(updated);
            onFilterChange(updated);
          }}
        >
          <option value="">
            {language === 'en' ? 'All Types' : 'ทุกประเภท'}
          </option>
          {shopTypeOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {language === 'en' ? opt.label : opt.label_th}
            </option>
          ))}
        </select>
      </div>
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
