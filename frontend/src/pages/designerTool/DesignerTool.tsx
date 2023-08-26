import React, { useCallback, useEffect, useRef } from "react";
import FabricCanvas from "../../features/canvas/FabricCanvas";
import Selection from "../../features/selection/Selection";
import Layers from "../../features/layers/Layers";
import Properties from "../../features/properties/Properties";
import fabric from "fabric"

export default function DesignerTool() {
  const canvas = useRef<fabric.fabric.Canvas>();

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
        console.log(canvas.current?.getObjects());
      });
    }
  }, [canvas]);

  const addStuff = useCallback(() => {
    if (canvas.current) {
      const rect = new fabric.fabric.Rect({
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

  const addStuff2 = useCallback(() => {
    if (canvas.current) {
      const rect = new fabric.fabric.Rect({
        top: 100,
        left: 100,
        width: 60,
        height: 70,
        fill: "blue",
        selectable: true,
        hasControls: true,
      });

      canvas.current.add(rect);
    }
  }, [canvas]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Selection></Selection>
      <button onClick={addStuff}>ADD</button>
      <button onClick={addStuff2}>ADD2</button>
      <div style={{display:"flex", justifyContent:"center", flexDirection:"row", width: "100%", height: "100%"}}>
        <Layers></Layers>
        <FabricCanvas canvas={canvas}></FabricCanvas>
        <Properties></Properties>
      </div>
    </div>
  );
}
