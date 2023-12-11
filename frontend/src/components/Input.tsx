import React from 'react';

// Define a type for the input props
type InputProps = {
  type: string;
  placeholder: string;
  value: any;
  onChange?: (e: any) => void; // Function for change event
  onFocus?: (e: any) => void; // Optional function for focus event
  onBlur?: (e: any) => void; // Optional function for blur event
  width?: string;
  height?: string;
}

export default function Input({ type, placeholder, value, onChange, onFocus, onBlur, width, height }: InputProps) {
  // Define the styles for the input
  const baseStyle = {
    width: width || 'auto',
    height: height || 'auto',
    padding: '10px 20px',
    margin: '4px 2px',
    border: '1px solid #ced4da',
    borderRadius: '5px',
    fontSize: '16px',
    outline: 'none', // Remove default focus outline
  };

  // Define the styles for the input when it is focused
  const focusStyle = {
    ...baseStyle,
    borderColor: '#80bdff',
    boxShadow: '0 0 0 0.2rem rgba(0, 123, 255, 0.25)',
  };

  // State to manage whether the input is focused
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <input 
      type={type} 
      placeholder={placeholder} 
      value={value} 
      onChange={onChange} 
      onFocus={(e) => {
        setIsFocused(true);
        if(onFocus) onFocus(e);
      }} 
      onBlur={(e) => {
        setIsFocused(false);
        if(onBlur) onBlur(e);
      }} 
      style={isFocused ? focusStyle : baseStyle} // Apply the focus style if the input is focused
    />
  )
}
