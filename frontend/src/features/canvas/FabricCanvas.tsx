import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
}

const FabricCanvas: React.FC<FabricCanvasProps> = ({ canvas }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current && !canvas.current && containerRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });


      canvas.current = fabricCanvas;
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current && canvas.current) {
        console.log("Resizing canvas: "+ containerRef.current.clientWidth);

        canvas.current.setWidth(containerRef.current.clientWidth);
        canvas.current.setHeight(containerRef.current.clientHeight);
      
        
        canvas.current.renderAll(); // Re-render the canvas after resizing
      }
    };

    window.addEventListener("resize", handleResize);

    // Trigger resize on initial mount to set correct dimensions
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FabricCanvas;
