import React, { useState, useEffect, useRef } from "react";
import FabricCanvas from "../../features/canvas/FabricCanvas";
import Selection from "../../features/selection/Selection";
import Layers from "../../features/layers/Layers";
import Properties from "../../features/properties/Properties";
import fabric from "fabric";

export default function DesignerTool() {
  const canvas = useRef<fabric.fabric.Canvas>();
  const [isCanvasInitialized, setCanvasInitialized] = useState(false);

  useEffect(() => {
    if (canvas.current) {
      setCanvasInitialized(true);
    }
  }, [canvas]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {isCanvasInitialized && <Selection canvas={canvas}></Selection>}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        <Layers canvas={canvas}></Layers>
        <FabricCanvas canvas={canvas}></FabricCanvas>
        <Properties canvas={canvas}></Properties>
      </div>
    </div>
  );
}
