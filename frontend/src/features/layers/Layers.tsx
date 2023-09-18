import React, { useEffect, useState } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
  updateObjList: (objects: any) => void;
}

export default function Layers(props: FabricCanvasProps) {
  const [objList, setObjList] = useState<any[]>([]);
  const [selectedObj, setSelectedObj] = useState<any | null>(null);

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
      console.log("Selection created");
      if (canvasInstance && e.selected.length === 1) {
        setSelectedObj(e.selected[0]);
        console.log(e.selected[0]);
      }
    };

    const handleSelectionCleared = () => {
      setSelectedObj(null);
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
        canvasInstance.off("selection:updated", handleSelectionCreated);
        canvasInstance.off("selection:cleared", handleSelectionCleared);
      }
    };
  }, [props.canvas]);

  function moveDown() {
    const canvasInstance = props.canvas.current;
    if (!selectedObj || !canvasInstance) return;

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
    if (!selectedObj || !canvasInstance) return;

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

  const isObjectMatch = (obj1: any, obj2: any) => {
    if (!obj1 || !obj2) return false;
    return obj1.id === obj2.id;
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
              isObjectMatch(reverseObj, selectedObj) ? { color: "red" } : {}
            }
            onClick={() => {
              const canvasInstance = props.canvas.current;
              canvasInstance?.setActiveObject(reverseObj);
              canvasInstance?.renderAll();
            }}
          >
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
            display: selectedObj ? "flex" : "none",
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
