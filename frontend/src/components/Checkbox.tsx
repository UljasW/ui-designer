import React from 'react';

interface CheckboxProps {
  checked: boolean;
  onClick: () => void;
}

export default function Checkbox({ checked, onClick }: CheckboxProps) {
  return (
    <div style={{display:"flex", justifyContent:"center", alignItems:"center"}}>
      <input 
        type="checkbox" 
        id="custom-checkbox" 
        checked={checked} 
        onClick={() => onClick()} 
        style={{ accentColor: '#4f46e5', width: 20, height: 20 }} 
      />
      <label htmlFor="custom-checkbox">Toggle snapping</label>
    </div>
  );
}
