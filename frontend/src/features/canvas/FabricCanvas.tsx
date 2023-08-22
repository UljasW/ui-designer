import React, { useEffect, useRef, useState, ReactNode, SetStateAction, Dispatch } from 'react';
import { fabric } from 'fabric';

interface FabricCanvasProps {
  setCanvas: Dispatch<SetStateAction<fabric.Canvas | null>>;
}

const FabricCanvas: React.FC<FabricCanvasProps> = ({ setCanvas }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      setCanvas(fabricCanvas);
    }
  }, []);

  return <canvas ref={canvasRef} width={500} height={500} />;
};




export default FabricCanvas;
