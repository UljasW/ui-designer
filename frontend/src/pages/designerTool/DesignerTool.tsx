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
import TopBar from "../../components/TopBar";

export default function DesignerTool() {
  const canvas = useRef<fabric.fabric.Canvas>();
  const [isCanvasInitialized, setCanvasInitialized] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [searchParams] = useSearchParams();
  const [designId, setDesignId] = useState<string>();

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

    return () => {
      console.log("Unmounting DesignerTool");
      

    }
  }, [canvas]);

  useEffect(() => {
    if (canvas.current && isCanvasInitialized) {
      console.log("Adding event listeners");

      const handleObjectModified = (e: any) => {
        console.log("Object modified");
        updateObjectsLiveVisually(canvas.current?.getObjects());
      };

      canvas.current.on("object:modified", handleObjectModified);

      return () => {
        canvas.current?.off("object:modified", handleObjectModified);
      };
    }
  }, [canvas.current, isCanvasInitialized]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        width: "100vw",
        height: "100vh",
        maxHeight: "100vh",
      }}
    >
      <TopBar>
        {isCanvasInitialized && (
          <Selection canvas={canvas} currentColor={currentColor}></Selection>
        )}
      </TopBar>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "row",
          flex: 1, 
          width: "100vw",
          height: "calc(100vh - 50px)",
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
