import React from 'react'

// Define a type for the button props
type ButtonProps = {
  onClick: (e:any) => void; // Function for click event
  color: 'primary' | 'delete' | 'secondary'; // Color type with three options
  content: any;
  width?: string;
  height?: string;
  padding?: string;
}

export default function Button({ onClick, color, content, width, height , padding}: ButtonProps) {
  // Define the styles for each button type
  const colorStyles = {
    primary: {
      backgroundColor: '#4f46e5', // Example primary color
      color: 'white',
    },
    delete: {
      backgroundColor: '#dc3545', // Example delete color
      color: 'white',
    },
    secondary: {
      backgroundColor: 'white', // Example secondary color
      color: 'black',
      border: '1px solid black',
    },
  };



  return (
    <button style={{
      border: 'none', // Set default border to none
      padding: padding || '10px 20px',
      textAlign: 'center',
      textDecoration: 'none',
      display: 'inline-block',
      fontSize: '16px',
      margin: '4px 2px',
      cursor: 'pointer',
      width: width || 'auto',
      height: height || 'auto',
      borderRadius: '10px',
      ...colorStyles[color], // Spread the styles for the specific button color, which can override the default border
    }} onClick={onClick}>
      {content}
    </button>
  )
  
}
