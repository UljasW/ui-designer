import fabric from "fabric";
import React, { useCallback, useEffect, useState } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.fabric.Canvas | undefined>;
}
export default function Selection(props: FabricCanvasProps) {
  const canvas = props.canvas.current;

  useEffect(() => {
    if (canvas) {
      // Listen for mouse:down event (click)
      canvas.on('mouse:down', (options) => {
        const pointer = canvas.getPointer(options.e);
        console.log(`Canvas clicked at position: x=${pointer.x}, y=${pointer.y}`);
      });

      // Listen for mouse:move event
      canvas.on('mouse:move', (options) => {
        const pointer = canvas.getPointer(options.e);
        console.log(`Mouse position: x=${pointer.x}, y=${pointer.y}`);
      });
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (canvas) {
        canvas.off('mouse:down');
        canvas.off('mouse:move');
      }
    };
  }, [canvas]);
  

  const addStuff = useCallback(() => {
    if (canvas) {
      const rect = new fabric.fabric.Rect({
        top: 100,
        left: 100,
        width: 60,
        height: 70,
        fill: "red",
        selectable: true,
        hasControls: true,
      });

      canvas.add(rect);
      console.log(canvas.getObjects())
    }
  }, [canvas]);

  const addStuff2 = useCallback(() => {

    if (canvas) {

      const rect = new fabric.fabric.Rect({
        top: 0,
        left: 0,
        width: 60,
        height: 70,
        fill: "blue",
        selectable: true,
        hasControls: true,
      });

      canvas.add(rect);
    }
  }, [canvas]);

  return (
    <div
      style={{
        height: "50px",
        background: "LightGrey",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <button onClick={addStuff}>ADD</button>
      <button onClick={addStuff2}>ADD2</button>
    </div>
  );
}
