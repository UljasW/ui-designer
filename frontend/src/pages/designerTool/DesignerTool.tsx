import React, { useState, useEffect, useRef } from "react";
import FabricCanvas from "../../features/canvas/FabricCanvas";
import Selection from "../../features/selection/Selection";
import Layers from "../../features/layers/Layers";
import Properties from "../../features/properties/Properties";
import fabric from "fabric";
import useLiveCollaboration from "../../hooks/useLiveCollaboration";
import { useSearchParams } from "react-router-dom";
import useRenderObjectsOnCanvas from "../../hooks/useRenderObjectsOnCanvas";

export default function DesignerTool() {
  const canvas = useRef<fabric.fabric.Canvas>();
  const [isCanvasInitialized, setCanvasInitialized] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [searchParams] = useSearchParams();
  const { renderObjectsOnCanvas } = useRenderObjectsOnCanvas();
  const { updateDb, getObjects, deleteObjects } = useLiveCollaboration(
    searchParams.get("id") || ""
  );
  const [designId, setDesignId] = useState<string>();

  useEffect(() => {
    const fetchObjectsAndRender = async () => {
      try {
        const objects = await getObjects();
        if (objects && canvas.current) {
          setCanvasInitialized(true);
          renderObjectsOnCanvas(canvas.current, objects);
        }
      } catch (error) {
        console.error("Error fetching objects:", error);
      }
    };

    fetchObjectsAndRender();
  }, [canvas]);

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {isCanvasInitialized && (
        <Selection canvas={canvas} currentColor={currentColor}></Selection>
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          width: "100%",
          height: "100%",
        }}
      >
        <Layers
          updateDb={updateDb}
          canvas={canvas}
        ></Layers>
        <FabricCanvas canvas={canvas}></FabricCanvas>
        <Properties
          canvas={canvas}
          setCurrentColor={setCurrentColor}
        ></Properties>
      </div>
    </div>
  );
}
