import React, { useState, useEffect, useRef } from "react";
import FabricCanvas from "../../features/canvas/FabricCanvas";
import Selection from "../../features/selection/Selection";
import Layers from "../../features/layers/Layers";
import Properties from "../../features/properties/Properties";
import fabric from "fabric";
import useLiveCollaboration from "../../hooks/useLiveCollaboration";
import { useSearchParams } from "react-router-dom";

export default function DesignerTool() {
  const canvas = useRef<fabric.fabric.Canvas>();
  const [isCanvasInitialized, setCanvasInitialized] = useState(false);
  const [currentColor, setCurrentColor] = useState<string>("black");
  const [searchParams, setSearchParams] = useSearchParams();
  const { updateDb, moveUpDb, moveDownDb} = useLiveCollaboration(searchParams.get("id") || "");
  const [designId, setDesignId] = useState<string>();


  useEffect(() => {
    if (canvas.current) {
      setCanvasInitialized(true);

      /*  const handleCanvasUpdate = () => {
        saveToDb(canvas.current?.getObjects());
        console.log(canvas.current?.getObjects());
      };

      canvas.current.on('object:added', handleCanvasUpdate);
      canvas.current.on('object:modified', handleCanvasUpdate);
      canvas.current.on('object:removed', handleCanvasUpdate);

      return () => {
        canvas.current?.off('object:added', handleCanvasUpdate);
        canvas.current?.off('object:modified', handleCanvasUpdate);
        canvas.current?.off('object:removed', handleCanvasUpdate);
      }; */
    }
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
        <Layers updateDb={updateDb} moveDown={moveDownDb} moveUp={moveUpDb} canvas={canvas}></Layers>
        <FabricCanvas canvas={canvas}></FabricCanvas>
        <Properties
          canvas={canvas}
          setCurrentColor={setCurrentColor}
        ></Properties>
      </div>
    </div>
  );
}
/* (e) => {
  props.updateObjList(selectedObjects);
  handleSelectionCreated(e);
} */
