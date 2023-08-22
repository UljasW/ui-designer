// App.js
import React, { useContext } from 'react';
import FabricCanvas from './features/canvas/FabricCanvas';
import { fabric } from 'fabric';

export default function App() {
  
  return (
    <div className="App">
      <h1>Your UI Designer App</h1>
      <FabricCanvas />
    </div>
  );
}
