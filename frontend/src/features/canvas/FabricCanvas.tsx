import React, { useEffect, useRef, useState, useMemo } from "react";
import { fabric } from "fabric";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
}

interface CustomFabricRect extends fabric.Rect {
  id: string;
  layerIndex: number;
}

interface CustomFabricText extends fabric.Text {
  id: string;
  layerIndex: number;
}


fabric.Rect.prototype.toObject = (function (toObject) {
  return function (this: CustomFabricRect) {
    return fabric.util.object.extend(toObject.call(this), {
      id: this.id,
      layerIndex: this.layerIndex
    });
  };
})(fabric.Rect.prototype.toObject);





fabric.Text.prototype.toObject = (function (toObject) {
  return function (this: CustomFabricText) {
    return fabric.util.object.extend(toObject.call(this), {
      id: this.id,
      layerIndex: this.layerIndex
    });
  };
})(fabric.Text.prototype.toObject);


const FabricCanvas: React.FC<FabricCanvasProps> = ({ canvas }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fabricInstance = useRef<fabric.Canvas | undefined>();

  useEffect(() => {
    if (canvasRef.current && !fabricInstance.current) {

      
      const fabricCanvas = new fabric.Canvas(canvasRef.current);

      
      fabricCanvas.preserveObjectStacking = true;

      fabricInstance.current = fabricCanvas;
      canvas.current = fabricCanvas;
    }
  }, [canvas]);

  return <canvas ref={canvasRef} width={window.innerWidth - 400}  height={window.innerHeight - 50} />;
};

export default FabricCanvas;
