import React, { useState } from 'react';
import { navigationCategories } from '../data/navigationCategories';
import '../styles/CategoryTabs.css';

/**
 * CategoryTabs renders two main tabs (Offline, Online) with nested
 * sub-category buttons. Colors are defined in the data.
 */
const CategoryTabs = () => {
  const [activeMain, setActiveMain] = useState('offline');
  const [activeSub, setActiveSub] = useState('');

  const mainCategories = navigationCategories;
  const currentMain = mainCategories.find(c => c.id === activeMain);
  const subCategories = currentMain?.subCategories || [];

  return (
    <div className="category-tabs">
      <div className="main-tabs">
        {mainCategories.map(cat => (
          <button
            key={cat.id}
            className={`main-tab ${activeMain === cat.id ? 'active' : ''}`}
            style={{ '--tab-color': cat.color } as React.CSSProperties}
            onClick={() => { setActiveMain(cat.id); setActiveSub(''); }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {subCategories.length > 0 && (
        <div className="sub-tabs">
          {subCategories.map(sub => (
            <button
              key={sub.id}
              className={`sub-tab ${activeSub === sub.id ? 'active' : ''}`}
              onClick={() => setActiveSub(sub.id)}
            >
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryTabs;
