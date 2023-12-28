import React, { useEffect, useRef, useState, useMemo } from "react";
import { fabric } from "fabric";

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

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
}

const FabricCanvas: React.FC<FabricCanvasProps> = ({ canvas }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fabricInstance = useRef<fabric.Canvas | undefined>();

  useEffect(() => {
    if (canvasRef.current && !fabricInstance.current && containerRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        width: containerRef.current.clientWidth,
        height: containerRef.current.clientHeight,
      });

      fabricInstance.current = fabricCanvas;
      canvas.current = fabricCanvas;
    }
  }, [canvas]);

  useEffect(() => {
    const resizeCanvas = () => {
      fabricInstance.current?.setDimensions({
        width: containerRef.current?.clientWidth || 0,
        height: containerRef.current?.clientHeight || 0,
      });
    };

    window.addEventListener("resize", resizeCanvas);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
    };
  }, [canvas.current]);

  return (
    <div ref={containerRef} style={{ height: "100%", width: "100%" }}>
      <canvas ref={canvasRef} />
    </div>
  );
};

export default FabricCanvas;
