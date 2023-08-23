import React, { useEffect, useRef, useState, ReactNode, SetStateAction, Dispatch } from 'react';
import { fabric } from 'fabric';

interface FabricCanvasProps {
  setCanvas: Dispatch<SetStateAction<fabric.Canvas | null>>;
}

const FabricCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      
      const rect = new fabric.Rect({
        top: 100,
        left: 100,
        width: 60,
        height: 70,
        fill: 'red',
        selectable: true, // Ensure the object is selectable
        hasControls: true, // Display controls for scaling/rotating
      });
      
      fabricCanvas.add(rect);    }
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};




export default FabricCanvas;
