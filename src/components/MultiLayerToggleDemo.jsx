import React, { useState } from 'react';
import MultiLayerToggle from './MultiLayerToggle';
import { multiLayerCategories } from '../data/multiLayerCategories';

/**
 * Example component showing how to use MultiLayerToggle
 * for both shop type and location categories.
 */
const MultiLayerToggleDemo = () => {
  const [selected, setSelected] = useState('');
  const [language, setLanguage] = useState('en');

  return (
    <div style={{ padding: '16px' }}>
      <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}>
        {language === 'en' ? 'TH' : 'EN'}
      </button>
      <h3>Shop Type</h3>
      <MultiLayerToggle
        data={multiLayerCategories.shop}
        type="shop"
        selectedId={selected}
        onSelect={setSelected}
        language={language}
      />

      <h3 style={{ marginTop: '24px' }}>Location</h3>
      <MultiLayerToggle
        data={multiLayerCategories.location}
        type="location"
        selectedId={selected}
        onSelect={setSelected}
        language={language}
      />

      <p style={{ marginTop: '16px' }}>Selected: {selected || 'none'}</p>
    </div>
  );
};

export default MultiLayerToggleDemo;
