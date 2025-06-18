import React from 'react';
import { shopTypes } from '../data/shopTypes';
import '../styles/ShopTypeFilter.css';

const ShopTypeItem = ({ node, depth, onSelect, selected }) => {
  const hasChildren = node.children && node.children.length > 0;
  const isActive = selected === node.id;
  return (
    <div className="shop-type-item" style={{ marginLeft: depth * 12 }}>
      <button
        className={`shop-type-button ${isActive ? 'shoptype-active' : ''}`}
        onClick={() => onSelect(node.id)}
      >
        {node.name}
      </button>
      {hasChildren && (
        <div className="shop-type-children">
          {node.children.map(child => (
            <ShopTypeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selected={selected}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ShopTypeFilter = ({ selected, onSelect }) => (
  <div className="shop-type-section">
    {shopTypes.map(root => (
      <ShopTypeItem
        key={root.id}
        node={root}
        depth={0}
        onSelect={onSelect}
        selected={selected}
      />
    ))}
  </div>
);

export default ShopTypeFilter;
