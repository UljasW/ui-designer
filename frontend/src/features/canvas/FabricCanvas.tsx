import React, { useEffect, useRef, useState, useMemo } from "react";
import { fabric } from "fabric";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
}

const FabricCanvas: React.FC<FabricCanvasProps> = ({ canvas }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricInstance = useRef<fabric.Canvas | undefined>();

  useEffect(() => {
    if (canvasRef.current && !fabricInstance.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current);
      fabricInstance.current = fabricCanvas;
      canvas.current = fabricCanvas;
    }
  }, [canvas]);

  return <canvas ref={canvasRef} width={window.innerWidth - 400}  height={window.innerHeight - 50} />;
};

export default FabricCanvas;
