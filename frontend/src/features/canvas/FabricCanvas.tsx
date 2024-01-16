import React, { useEffect, useRef } from "react";
import { fabric } from "fabric";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
}

interface CustomFabricObject extends fabric.Object {
  rx?: any;
  ry?: any;
  id: string;
  layerIndex: number;
  text?: string;
}


fabric.Object.prototype.toObject = (function (toObject) {
  return function (this: CustomFabricObject) {
    return fabric.util.object.extend(toObject.call(this), {
      id: this.id,
      layerIndex: this.layerIndex,
      rx: this.rx || 0,
      ry: this.ry || 0,
      text: this.text || "",
    });
  };
})(fabric.Object.prototype.toObject);



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

        canvas.current.setWidth(window.innerWidth-500);
        canvas.current.setHeight(window.innerHeight-50);
      
        
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
    <div ref={containerRef} style={{  height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FabricCanvas;
