// App.js
import React, { useCallback, useContext } from "react";
import FabricCanvas from "./features/canvas/FabricCanvas";
import { fabric } from "fabric";
import { CanvasContext } from "./features/canvas/CanvasContext";

export default function App() {
const canvas = useContext(CanvasContext);
console.log("Canvas in App.tsx:", canvas); // Add this log

  const addCircle = useCallback(() => {
    if (canvas) {
      const circle = new fabric.Circle({
        top: 150,
        left: 150,
        radius: 50,
        fill: "blue",
      });
      canvas.add(circle);
    }
  }, [canvas]);
  

  return (
    <div className="App">
      <h1>Your UI Designer App</h1>
      <FabricCanvas />
      {canvas && <button onClick={addCircle}>Add Circle</button>}
    </div>
  );
  
}
