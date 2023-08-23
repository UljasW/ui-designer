// App.js
import React, { useCallback, useContext, useRef, useState } from "react";
import FabricCanvas from "./features/canvas/FabricCanvas";
import { fabric } from 'fabric';

export default function App() {
  const canvas = useRef<fabric.Canvas>();
  const MemoizedFabricCanvas = React.memo(FabricCanvas);

  const addStuff = useCallback(() => {
    if (canvas.current) {
      const rect = new fabric.Rect({
        top: 100,
        left: 100,
        width: 60,
        height: 70,
        fill: "red",
        selectable: true,
        hasControls: true,
      });
  
      canvas.current.add(rect);
      console.log(canvas);

    }
  }, [canvas]);
  
  return (
    <div className="App">
      <button onClick={addStuff}>ILLLA.SE</button>
      <MemoizedFabricCanvas canvas={canvas} />
    </div>
  );
}
