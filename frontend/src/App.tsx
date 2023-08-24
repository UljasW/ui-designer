// App.js
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import FabricCanvas from "./features/canvas/FabricCanvas";
import { fabric } from "fabric";

export default function App() {
  const canvas = useRef<fabric.Canvas>();
  const MemoizedFabricCanvas = React.memo(FabricCanvas);

  useEffect(() => {
    if (canvas.current) {
      canvas.current.on("selection:created", (e) => {
        if (e.selected) {
          e.selected.map((element) => {
            if (canvas.current) {
              canvas.current.bringToFront(element);
            }
          });
        }
        console.log(canvas.current?.getActiveObject);
      });
    }
  }, [canvas]);

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
    }
  }, [canvas]);

  return (
    <div className="App">
      <button onClick={addStuff}>ADD</button>
      <MemoizedFabricCanvas canvas={canvas} />
    </div>
  );
}
