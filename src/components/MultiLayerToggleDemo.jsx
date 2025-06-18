import React, { useState } from 'react';
import MultiLayerToggle from './MultiLayerToggle';
import { multiLayerCategories } from '../data/multiLayerCategories';

/**
 * Example component showing how to use MultiLayerToggle
 * for both shop type and location categories.
 */
const filterNodes = (nodes, term) => {
  if (!term) return nodes;
  return nodes
    .map((n) => {
      if (n.children) {
        const children = filterNodes(n.children, term);
        if (children.length || n.label.toLowerCase().includes(term)) {
          return { ...n, children };
        }
        return null;
      }
      return n.label.toLowerCase().includes(term) ? n : null;
    })
    .filter(Boolean);
};

const MultiLayerToggleDemo = () => {
  const [selected, setSelected] = useState('');
  const [language, setLanguage] = useState('en');
  const [search, setSearch] = useState('');

  return (
    <div style={{ padding: '16px' }}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
        <button onClick={() => setLanguage(language === 'en' ? 'th' : 'en')}>
          {language === 'en' ? 'TH' : 'EN'}
        </button>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value.toLowerCase())}
          placeholder="Search categories"
        />
      </div>
      <h3>Shop Type</h3>
      <MultiLayerToggle
        data={filterNodes(multiLayerCategories.shop, search)}
        type="shop"
        selectedId={selected}
        onSelect={setSelected}
        language={language}
      />

      <h3 style={{ marginTop: '24px' }}>Location</h3>
      <MultiLayerToggle
        data={filterNodes(multiLayerCategories.location, search)}
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