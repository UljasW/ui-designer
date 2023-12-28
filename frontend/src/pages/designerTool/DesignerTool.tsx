import React, { useState, useEffect, useRef } from "react";
import FabricCanvas from "../../features/canvas/FabricCanvas";
import Selection from "../../features/selection/Selection";
import Layers from "../../features/layers/Layers";
import Properties from "../../features/properties/Properties";
import fabric from "fabric";
import useLiveCollaboration from "../../hooks/useLiveCollaboration";
import { useSearchParams } from "react-router-dom";
import useRenderObjectsOnCanvas from "../../hooks/useRenderObjectsOnCanvas";
import useSnapping from "../../hooks/useSnapping";

export default function DesignerTool() {
  const canvas = useRef<fabric.fabric.Canvas>();
  const [isCanvasInitialized, setCanvasInitialized] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [searchParams] = useSearchParams();
  const [designId, setDesignId] = useState<string>();
  const { checkSnapping } = useSnapping(canvas);

  const { renderObjectsOnCanvas } = useRenderObjectsOnCanvas();

  const { updateDb, getObjects, deleteObjects, updateObjectsLiveVisually } =
    useLiveCollaboration(
      searchParams.get("id") || "",
      renderObjectsOnCanvas,
      canvas
    );

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


  useEffect(() => {
    if (canvas.current && isCanvasInitialized) {
      console.log("Adding event listeners"); // Added for debug
      
      canvas.current.on("mouse:move", (e: any) => {
        console.log("Mouse moved");
         // Added for debug
      });

      canvas.current.on("object:modified", (e: any) => {
        console.log("Object modified"); // Added for debug
        updateObjectsLiveVisually(canvas.current?.getObjects());
      });

      return () => {
        canvas.current?.off("object:modified");
        canvas.current?.off("mouse:move");
      };
    }
  }, [canvas.current, isCanvasInitialized]);

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
          width: "100vw",
          height: "100vh",
        }}
      >
        <Layers
          updateDb={updateDb}
          canvas={canvas}
          deleteObjects={deleteObjects}
          updateObjectsLiveVisually={updateObjectsLiveVisually}
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
