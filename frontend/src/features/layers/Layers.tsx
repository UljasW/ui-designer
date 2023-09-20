import React, { useEffect, useState } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
  updateDb: (objects: any) => void;
}

export default function Layers(props: FabricCanvasProps) {
  const [objList, setObjList] = useState<any[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<any[] | null>([]);

  useEffect(() => {
    const canvasInstance = props.canvas.current;

    const updateObjects = () => {
      if (!canvasInstance) {
        return;
      }
      const tempObjList = canvasInstance.getObjects();
      if (tempObjList === objList) {
        return;
      }

      setObjList(canvasInstance.getObjects());
    };

    const handleSelectionCreated = (e: any) => {
      console.log(e.selected);

      if (canvasInstance) {
        setSelectedObjects(e.selected);
      }
    };

    const handleSelectionCleared = () => {
      props.updateDb(selectedObjects);
      setSelectedObjects(null);
      if (canvasInstance) {
        setObjList(canvasInstance.getObjects());
      }
    };

    if (canvasInstance) {
      updateObjects();
      canvasInstance.on("object:added", updateObjects);
      canvasInstance.on("object:removed", updateObjects);
      canvasInstance.on("selection:created", handleSelectionCreated);
      canvasInstance.on("selection:updated", handleSelectionCreated);
      canvasInstance.on("selection:cleared", handleSelectionCleared);
    }

    return () => {
      if (canvasInstance) {
        canvasInstance.off("object:added", updateObjects);
        canvasInstance.off("object:removed", updateObjects);
        canvasInstance.off("selection:created", handleSelectionCreated);
        canvasInstance.off("selection:updated", (e) => {
          props.updateDb(selectedObjects);
          handleSelectionCreated(e);
        });
        canvasInstance.off("selection:cleared", handleSelectionCleared);
      }
    };
  }, [props.canvas]);

  function moveDown() {
    const canvasInstance = props.canvas.current;


    if (!selectedObjects || !canvasInstance || selectedObjects.length > 1) return;

    const selectedObj = selectedObjects[0];
  
    const idx = canvasInstance.getObjects().indexOf(selectedObj);
  
    // If it's already at the top, do nothing
    if (idx <= 0) return;

    (canvasInstance.getObjects()[idx - 1] as any).layerIndex = idx;
    selectedObj.moveTo(idx - 1);
    selectedObj.layerIndex = idx - 1;
  
    setObjList(canvasInstance.getObjects());
    canvasInstance.renderAll();
  }
  
  function moveUp() {
    const canvasInstance = props.canvas.current;
    
    if (!selectedObjects || !canvasInstance || selectedObjects.length > 1) return;

    const selectedObj = selectedObjects[0];
  
    const idx = canvasInstance.getObjects().indexOf(selectedObj);
    const lastIdx = canvasInstance.getObjects().length - 1;
  
    // If it's already at the bottom, do nothing
    if (idx >= lastIdx) return;

    (canvasInstance.getObjects()[idx + 1] as any).layerIndex = idx;
    selectedObj.moveTo(idx + 1);
    selectedObj.layerIndex = idx + 1;
  
    setObjList(canvasInstance.getObjects());
    canvasInstance.renderAll();
  }
  

  const isObjectMatch = (obj: any, selectedObjs: any[] | null) => {
    if (!selectedObjs) return false;
    return selectedObjs.some((selectedObj) => selectedObj.id === obj.id);
  };

  return (
    <div
      style={{
        width: "200px",
        background: "LightGrey",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {objList.map((obj, index) => {
        const reverseIndex = objList.length - 1 - index;
        const reverseObj = objList[reverseIndex];



        return (
          <button
            key={reverseIndex}
            style={
              isObjectMatch(reverseObj, selectedObjects) ? { color: "red" } : {}
            }
            onClick={() => {
              const canvasInstance = props.canvas.current;
              canvasInstance?.setActiveObject(reverseObj);
              canvasInstance?.renderAll();
            }}
          >
            {" "}
            {reverseObj.layerIndex} - {reverseObj.type} - {reverseObj.fill}
          </button>
        );
      })}

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
        }}
      >
        <div
          style={{
            display: selectedObjects && selectedObjects.length === 1 ? "flex" : "none",
            flexDirection: "row",
            justifyContent: "center",
          }}
        >
          <button onClick={moveUp}>Move up</button>
          <button onClick={moveDown}>Move down</button>
        </div>
      </div>
    </div>
  );
}
