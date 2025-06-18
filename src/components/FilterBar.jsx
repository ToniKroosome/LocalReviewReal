import React, { useState } from 'react';
import ShopTypeFilter from './ShopTypeFilter';

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
    { value: 'All Categories', th: 'ทุกหมวดหมู่' },
    { value: 'Online', th: 'ออนไลน์' },
    { value: 'Real World', th: 'ออฟไลน์' },
    { value: 'Local Services', th: 'บริการท้องถิ่น' },
    { value: 'Facebook Marketplace', th: 'ตลาดเฟซบุ๊ก' },
    { value: 'Goods & Products', th: 'สินค้า' },
    { value: 'Landlords', th: 'เจ้าของที่' },
    { value: 'Restaurants & Cafes', th: 'ร้านอาหารและคาเฟ่' },
    { value: 'Retail Stores', th: 'ร้านค้าปลีก' },
    { value: 'Education', th: 'การศึกษา' },
  ];

  const onlineTypes = [
    { value: 'Social Media App', th: 'แอปโซเชียล' },
    { value: 'Website', th: 'เว็บไซต์' },
    { value: 'Individual Remote Services', th: 'บริการออนไลน์' },
  ];

  const locationLevels = {
    city: [
      { value: 'All Cities', th: 'ทุกเมือง' },
      { value: 'Bangkok', th: 'กรุงเทพฯ' }
    ],
    district: [
      { value: 'All Districts', th: 'ทุกเขต' },
      { value: 'Sathorn', th: 'สาทร' },
      { value: 'Watthana', th: 'วัฒนา' },
      { value: 'Khlong Toei', th: 'คลองเตย' },
      { value: 'Lat Phrao', th: 'ลาดพร้าว' }
    ],
    zone: [
      { value: 'All Zones', th: 'ทุกโซน' },
      { value: 'Sukhumvit Extension', th: 'ส่วนต่อขยายสุขุมวิท' },
      { value: 'Port Area', th: 'ย่านท่าเรือ' },
      { value: 'Convention Center Area', th: 'ย่านศูนย์ประชุม' }
    ],
    subDistrict: [
      { value: 'All Sub-Districts', th: 'ทุกแขวง' },
      { value: 'Khlong Toei', th: 'คลองเตย' },
      { value: 'Khlong Tan', th: 'คลองตัน' },
      { value: 'Phra Khanong', th: 'พระโขนง' },
      { value: 'Lumphini', th: 'ลุมพินี' }
    ],
    street: [
      { value: 'All Streets', th: 'ทุกถนน' },
      { value: 'Sukhumvit Road', th: 'ถนนสุขุมวิท' }
    ],
    alley: [
      { value: 'All Alleys', th: 'ทุกซอย' },
      { value: 'Sukhumvit Soi 1', th: 'สุขุมวิท ซอย 1' },
      { value: 'Sukhumvit Soi 3 (Nana Nuea)', th: 'สุขุมวิท ซอย 3 (นานาเหนือ)' },
      { value: 'Sukhumvit Soi 11', th: 'สุขุมวิท ซอย 11' },
      { value: 'Sukhumvit Soi 21 (Asok)', th: 'สุขุมวิท ซอย 21 (อโศก)' }
    ]
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

  const handleShopTypeSelect = (value) => {
    const updated = { ...selectedFilters, shopType: value };
    setSelectedFilters(updated);
    onFilterChange(updated);
  };

  return (
    <div className="filter-bar">
      <div className="filter-row">
        {shopCategories.map((cat) => (
          <button
            key={cat.value}
            className={`filter-button ${selectedFilters.category === cat.value ? 'active' : ''}`}
            onClick={() => {
              const updated = { ...selectedFilters, category: cat.value, onlineType: '' };
              setSelectedFilters(updated);
              onFilterChange(updated);
            }}
          >
            {language === 'en' ? cat.value : cat.th}
          </button>
        ))}
      </div>

      {selectedFilters.category === 'Online' && (
        <div className="filter-row">
          {onlineTypes.map((opt) => (
            <button
              key={opt.value}
              className={`filter-button ${selectedFilters.onlineType === opt.value ? 'active' : ''}`}
              onClick={() => {
                const updated = { ...selectedFilters, onlineType: opt.value };
                setSelectedFilters(updated);
                onFilterChange(updated);
              }}
            >
              {language === 'en' ? opt.value : opt.th}
            </button>
          ))}
        </div>
      )}

      <ShopTypeFilter
        selected={selectedFilters.shopType}
        onSelect={handleShopTypeSelect}
      />

      {Object.entries(locationLevels).map(([level, options]) => {
        const prevLevel = Object.keys(locationLevels)[Object.keys(locationLevels).indexOf(level) - 1];
        const shouldShow = !prevLevel || selectedFilters[prevLevel] !== '';

        if (!shouldShow) return null;

        return (
          <div key={level} className="filter-row">
            {options.map((option) => (
              <button
                key={option.value}
                className={`filter-button ${selectedFilters[level] === option.value ? 'active' : ''}`}
                onClick={() => handleFilterClick(level, option.value)}
              >
                {language === 'en' ? option.value : option.th}
              </button>
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default FilterBar;
