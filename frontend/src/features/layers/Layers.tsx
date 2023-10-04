import React, { useEffect, useRef, useState } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
  updateDb: (objects: any) => void;
}

export default function Layers(props: FabricCanvasProps) {
  const [objList, setObjList] = useState<any[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<any[] | null>([]);

  useEffect(() => {
    //console.log("selectedObjects", selectedObjects);
  }, [selectedObjects]);

  useEffect(() => {
    const canvasInstance = props.canvas.current;
    if (!canvasInstance) {
      return;
    }
    const updateObjects = () => {
      const tempObjList = canvasInstance.getObjects();
      if (tempObjList === objList) {
        return;
      }
      setObjList(canvasInstance.getObjects());
    };

    const handleSelectionCreated = (e: any) => {
      //console.log("created", e.selected);
      setSelectedObjects(e.selected);
    };

    const handleSelectionCleared = (e: any) => {
      //console.log("cleared", e.deselected);
      props.updateDb(e.deselected);
      setSelectedObjects(null);
      setObjList(canvasInstance.getObjects());
    };

    updateObjects();

    canvasInstance.on("object:added", updateObjects);
    canvasInstance.on("object:removed", updateObjects);

    canvasInstance.on("selection:created", handleSelectionCreated);
    canvasInstance.on("selection:updated", (e) => {
      props.updateDb(e.deselected);
      handleSelectionCreated(e);
    });
    canvasInstance.on("selection:cleared", handleSelectionCleared);

    return () => {
      canvasInstance.off("object:added", updateObjects);
      canvasInstance.off("object:removed", updateObjects);
      canvasInstance.off("selection:created", handleSelectionCreated);
      canvasInstance.off("selection:updated", handleSelectionCreated);
      canvasInstance.off("selection:cleared", handleSelectionCleared);
    };
  }, [props.canvas]);

  function moveDown() {
    const canvasInstance = props.canvas.current;

    if (!selectedObjects || !canvasInstance || selectedObjects.length > 1)
      return;

    const selectedObj = selectedObjects[0];

    const idx = canvasInstance.getObjects().indexOf(selectedObj);

    // If it's already at the top, do nothing
    if (idx <= 0) return;

    (canvasInstance.getObjects()[idx - 1] as any).layerIndex = idx;
    selectedObj.moveTo(idx - 1);
    selectedObj.layerIndex = idx - 1;

    setObjList(canvasInstance.getObjects());
    canvasInstance.renderAll();
    //props.switchPlacesDb(selectedObj.id, (canvasInstance.getObjects()[idx - 1] as any ).id);
  }

  function moveUp() {
    const canvasInstance = props.canvas.current;

    if (!selectedObjects || !canvasInstance || selectedObjects.length > 1)
      return;

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
    //props.switchPlacesDb(selectedObj.id, (canvasInstance.getObjects()[idx + 1] as any ).id);
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
            display:
              selectedObjects && selectedObjects.length === 1 ? "flex" : "none",
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
