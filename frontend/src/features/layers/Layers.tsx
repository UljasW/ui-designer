import React, { useEffect, useState } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
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
      setSelectedObj(e.target);
      if (canvasInstance) {
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

  function moveUp() {
    const canvasInstance = props.canvas.current;
    if (!selectedObj || !canvasInstance) return;
  
    const idx = canvasInstance.getObjects().indexOf(selectedObj);

    // If it's already at the top, do nothing
    if (idx <= 0) return;
  
    selectedObj.moveTo(idx - 1);
    canvasInstance.renderAll();
    setObjList(canvasInstance.getObjects());
  }
  
  function moveDown() {
    const canvasInstance = props.canvas.current;
    if (!selectedObj || !canvasInstance) return;
  
    const idx = canvasInstance.getObjects().indexOf(selectedObj);
    const lastIdx = canvasInstance.getObjects().length - 1;
  
    // If it's already at the bottom, do nothing
    if (idx >= lastIdx) return;
  
    selectedObj.moveTo(idx + 1);
    canvasInstance.renderAll();
    setObjList(canvasInstance.getObjects());
  }
  

  const isObjectMatch = (obj1: any, obj2: any) => {
    console.log(obj1);
    console.log(obj2);

    if (!obj1 || !obj2) return false;

    console.log(obj1.type === obj2.type && obj1.fill === obj2.fill);
    return (
      obj1.type === obj2.type &&
      obj1.fill === obj2.fill &&
      obj1.top === obj2.top &&
      obj1.left === obj2.left
    );
  };

  return (
    <div style={{ width: "200px", background: "LightGrey" }}>
      {objList.map((obj, index) => (
        <div
          key={index}
          style={isObjectMatch(obj, selectedObj) ? { color: "red" } : {}}
        >
          {index} - {obj.type} - {obj.fill}
        </div>
      ))}

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
