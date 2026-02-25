import React, { useState } from 'react';
import './ColorPicker.css';

const colors = ['#e41a1c', '#377eb8', '#4daf4a', '#984ea3', '#ff7f00', '#ffff33', '#a65628', '#f781bf'];

const ColorPicker = ({ color, onColorChange }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleColorClick = (newColor) => {
    onColorChange(newColor);
    setIsOpen(false);
  };

  return (
    <div className="color-picker">
      <div className="selected-color" onClick={() => setIsOpen(!isOpen)}>
        <div className="color-circle" style={{ backgroundColor: color }}></div>
      </div>
      {isOpen && (
        <div className="color-dropdown">
          {colors.map((c) => (
            <div
              key={c}
              className="color-option"
              onClick={() => handleColorClick(c)}
            >
              <div className="color-circle" style={{ backgroundColor: c }}></div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ColorPicker;
