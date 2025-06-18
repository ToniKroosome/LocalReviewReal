import React from 'react';
import '../styles/MultiLayerToggle.css';

/**
 * Recursive toggle tree for categories or locations.
 * Props:
 * - data: array of category nodes { id, label, label_th?, children? }
 * - type: "shop" | "location" (controls color palette)
 * - selectedId: currently selected node id
 * - onSelect: callback when a leaf or node is clicked
 */
const colorPalettes = {
  shop: ['#0d47a1', '#1976d2', '#64b5f6'],
  location: ['#1b5e20', '#388e3c', '#81c784']
};

const ToggleItem = ({ node, depth, type, selectedId, onSelect, language }) => {
  const colors = colorPalettes[type] || [];
  const color = colors[Math.min(depth, colors.length - 1)] || '#555';
  const isSelected = selectedId === node.id;

  return (
    <div className="toggle-item">
      <button
        className={`toggle-chip ${isSelected ? 'selected' : ''}`}
        style={{ '--chip-color': color }}
        onClick={() => onSelect(node.id)}
      >
        {language === 'th' && node.label_th ? node.label_th : node.label}
      </button>
      {node.children && (
        <div className="toggle-children">
          {node.children.map(child => (
            <ToggleItem
              key={child.id}
              node={child}
              depth={depth + 1}
              type={type}
              selectedId={selectedId}
              onSelect={onSelect}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const MultiLayerToggle = ({ data, type, selectedId, onSelect, language = 'en' }) => (
  <div className="multi-layer-toggle">
    {data.map(node => (
      <ToggleItem
        key={node.id}
        node={node}
        depth={0}
        type={type}
        selectedId={selectedId}
        onSelect={onSelect}
        language={language}
      />
    ))}
  </div>
);

export default MultiLayerToggle;
