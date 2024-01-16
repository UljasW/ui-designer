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
  const [isScreenLargeEnough, setIsScreenLargeEnough] = useState(
    window.innerWidth >= 1000
  );

  const { renderObjectsOnCanvas } = useRenderObjectsOnCanvas();

  const { updateDb, getObjects, deleteObjects, updateObjectsLiveVisually } =
    useLiveCollaboration(
      searchParams.get("id") || "",
      renderObjectsOnCanvas,
      canvas
    );

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

  useEffect(() => {
    const handleResize = () => {
      setIsScreenLargeEnough(window.innerWidth >= 1000);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isScreenLargeEnough]);

  useEffect(() => {
    fetchObjectsAndRender();

    return () => {
      console.log("Unmounting DesignerTool");
    };
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
  }, [isCanvasInitialized, canvas.current]);
  

  return (
    <>
      {isScreenLargeEnough ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100vh",
            maxHeight: "100vh",
          }}
        >
          <TopBar>
            {isCanvasInitialized && (
              <Selection
                canvas={canvas}
                currentColor={currentColor}
              ></Selection>
            )}
          </TopBar>
          <div
            //shrink this
            style={{
              flex: 1, // Flex grow to take available space
              display: "flex",
              flexDirection: "row",
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
      ) : (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
          <h2>Your screen is not large enough to display the designer tool.</h2>
        </div>
      )}
    </>
  );
}
