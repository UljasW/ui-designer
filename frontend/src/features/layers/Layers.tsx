import React, { useEffect, useRef, useState } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
  updateDb: (objects: any) => void;
  deleteObjects: (objects: any) => void
  updateObjectsLiveVisually: (objects: any) => void;
}

export default function Layers(props: FabricCanvasProps) {
  const [objList, setObjList] = useState<any[]>([]);
  const [selectedObjects, setSelectedObjects] = useState<any[] | null>(null);

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
      setSelectedObjects(e.selected);
    };

    const handleSelectionCleared = (e: any) => {
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
    props.updateObjectsLiveVisually(canvasInstance.getObjects());

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
    props.updateObjectsLiveVisually(canvasInstance.getObjects());
    //props.switchPlacesDb(selectedObj.id, (canvasInstance.getObjects()[idx + 1] as any ).id);
  }

  const isObjectMatch = (obj: any, selectedObjs: any[] | null) => {
    if (!selectedObjs) return false;
    return selectedObjs.some((selectedObj) => selectedObj.id === obj.id);
  };

  return (
    <div
      style={{
        width: "250px",
        background: "LightGrey",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)"
      }}
    >
      {objList.map((obj, index) => {
        const reverseIndex = objList.length - 1 - index;
        const reverseObj = objList[reverseIndex];
  
        return (
          <button
            key={reverseIndex}
            style={{
              color: isObjectMatch(reverseObj, selectedObjects) ? "red" : "#555",
              backgroundColor: "white",
              borderRadius: "4px",
              padding: "10px",
              margin: "5px",
              cursor: "pointer",
              border: "none",
              boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
              textAlign: "left",
              width: "100%",
              overflow: "hidden", // handle long text
              whiteSpace: "nowrap",
              textOverflow: "ellipsis"
            }}
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
          alignItems: "center",
          justifyContent: "flex-end",
          width: "100%",
          marginTop: "auto"
        }}
      >
        <div
          style={{
            display: selectedObjects && selectedObjects.length === 1 ? "flex" : "none",
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
            padding: "10px"
          }}
        >
          {['Move up', 'Move down'].map((text, idx) => (
            <button
              key={idx}
              onClick={idx === 0 ? moveUp : moveDown}
              style={{
                backgroundColor: "#4CAF50",
                color: "white",
                padding: "10px",
                margin: "5px",
                borderRadius: "4px",
                cursor: "pointer",
                border: "none",
                boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
              }}
            >
              {text}
            </button>
          ))}
        </div>
        <button
          style={{
            display: selectedObjects ? "flex" : "none",
            background: "#F44336",
            color: "white",
            fontWeight: "bold",
            fontSize: "16px",
            padding: "10px",
            margin: "5px",
            borderRadius: "4px",
            cursor: "pointer",
            border: "none",
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)"
          }}
          onClick={() => {
            const canvasInstance = props.canvas.current;
            if (canvasInstance && selectedObjects) {
              selectedObjects.forEach((obj) => {
                canvasInstance.remove(obj);
              });
              props.deleteObjects(selectedObjects);
              canvasInstance.discardActiveObject().renderAll();
              setSelectedObjects(null);
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
  
}
