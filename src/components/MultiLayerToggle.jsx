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
// Base HSL values for the two category types. Deeper layers lighten the color
// so the hierarchy is easy to follow at a glance.
const baseHsl = {
  shop: [210, 100, 35], // dark blue
  location: [120, 50, 32] // dark green
};

const getShade = (type, depth) => {
  const [h, s, l] = baseHsl[type] || [0, 0, 50];
  const lightness = Math.min(l + depth * 12, 85); // lighten for deeper levels
  return `hsl(${h}, ${s}%, ${lightness}%)`;
};

const ToggleItem = ({ node, depth, type, selectedId, onSelect, language }) => {
  const color = getShade(type, depth);
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
