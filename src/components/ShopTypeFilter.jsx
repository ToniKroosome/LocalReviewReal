import React, { useState } from 'react';
import { shopTypes } from '../data/shopTypes';
import '../styles/ShopTypeFilter.css';

/**
 * Recursive item used to render a tree of shop types. Each level can be
 * collapsed/expanded. Leaf nodes trigger the `onSelect` callback.
 */
const ShopTypeItem = ({ node, depth, onSelect, selected, language }) => {
  const [open, setOpen] = useState(false);
  const hasChildren = node.children && node.children.length > 0;
  const isActive = selected === node.id;

  const handleClick = () => {
    if (hasChildren) {
      setOpen((prev) => !prev);
    } else {
      onSelect(node.id);
    }
  };

  return (
    <div className="shop-type-item" style={{ marginLeft: depth * 12 }}>
      <button
        className={`shop-type-button ${isActive ? 'shoptype-active' : ''}`}
        onClick={handleClick}
      >
        {language === 'th' && node.name_th ? node.name_th : node.name}
      </button>
      {hasChildren && open && (
        <div className="shop-type-children">
          {node.children.map((child) => (
            <ShopTypeItem
              key={child.id}
              node={child}
              depth={depth + 1}
              onSelect={onSelect}
              selected={selected}
              language={language}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ShopTypeFilter = ({ selected, onSelect, language = 'en' }) => (
  <div className="shop-type-section">
    <div className="shop-type-row">
      {shopTypes.map((root) => (
        <ShopTypeItem
          key={root.id}
          node={root}
          depth={0}
          onSelect={onSelect}
          selected={selected}
          language={language}
        />
      ))}
    </div>
  </div>
);

export default ShopTypeFilter;
