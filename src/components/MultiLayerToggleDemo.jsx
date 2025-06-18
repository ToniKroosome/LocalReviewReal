import React, { useState } from 'react';
import MultiLayerToggle from './MultiLayerToggle';
import { multiLayerCategories } from '../data/multiLayerCategories';

/**
 * Example component showing how to use MultiLayerToggle
 * for both shop type and location categories.
 */
const MultiLayerToggleDemo = () => {
  const [selected, setSelected] = useState('');

  return (
    <div style={{ padding: '16px' }}>
      <h3>Shop Type</h3>
      <MultiLayerToggle
        data={multiLayerCategories.shop}
        type="shop"
        selectedId={selected}
        onSelect={setSelected}
      />

      <h3 style={{ marginTop: '24px' }}>Location</h3>
      <MultiLayerToggle
        data={multiLayerCategories.location}
        type="location"
        selectedId={selected}
        onSelect={setSelected}
      />

      <p style={{ marginTop: '16px' }}>Selected: {selected || 'none'}</p>
    </div>
  );
};

export default MultiLayerToggleDemo;
