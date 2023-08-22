// WrapperComponent.tsx
import React, { useState } from 'react';
import TestPage from './TestPage';
import FabricCanvas from '../features/canvas/FabricCanvas';

const WrapperComponent = () => {
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  return (
    <div>
        <TestPage canvas={canvas}/>

        <FabricCanvas setCanvas={setCanvas} />
    </div>
    
  );
};

export default WrapperComponent;
