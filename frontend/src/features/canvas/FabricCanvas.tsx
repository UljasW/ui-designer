// FabricCanvas.tsx
import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { fabric } from 'fabric';



const FabricCanvas = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current);
    
    // Example: Add a rectangle to the canvas
    const rect = new fabric.Rect({
      top: 100,
      left: 100,
      width: 60,
      height: 70,
      fill: 'red'
    });
    
    canvas.add(rect);
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};

export default FabricCanvas;
