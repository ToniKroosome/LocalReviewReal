import React, { useState, useRef, useEffect } from 'react';
import '../styles/Dropdown.css';

/**
 * A dropdown component with a compact trigger button but a large menu.
 * Props:
 * - options: array of option strings
 * - onSelect(option): callback when an option is clicked
 * - placeholder: button text when no option selected
 */
const Dropdown = ({ options = [], onSelect, placeholder = 'Select' }) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(null);
  const menuRef = useRef(null);
  const wrapperRef = useRef(null);

  const handleClickOutside = (e) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
      setOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleOptionClick = (option) => {
    setSelected(option);
    setOpen(false);
    if (onSelect) onSelect(option);
  };

  return (
    <div className="dropdown" ref={wrapperRef}>
      <button
        className="dropdown-trigger"
        onClick={() => setOpen((prev) => !prev)}
        type="button"
      >
        {selected || placeholder}
      </button>
      {open && (
        <div className="dropdown-menu" ref={menuRef}>
          {options.map((opt) => (
            <button
              key={opt}
              className="dropdown-option"
              onClick={() => handleOptionClick(opt)}
              type="button"
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
