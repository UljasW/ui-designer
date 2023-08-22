import React, { useEffect, useRef, useState, ReactNode } from 'react';
import { fabric } from 'fabric';
import { CanvasContext } from './CanvasContext';

const FabricCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      setCanvas(prevCanvas => prevCanvas || fabricCanvas);
      console.log("Canvas initialized:", fabricCanvas); // Log here
    }
  }, []);

  return (
    <CanvasContext.Provider value={canvas}>
      <canvas ref={canvasRef} width={500} height={500} />
    </CanvasContext.Provider>
  );
};


export default FabricCanvas;
