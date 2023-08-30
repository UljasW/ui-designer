import React, { useEffect, useState } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function Properties(props: FabricCanvasProps) {
  const [selectedObj, setSelectedObj] = useState<any | null>(null);

  useEffect(() => {
    const canvasInstance = props.canvas.current;

    const handleSelectionCreated = (e: any) => {
      console.log("Selection");
      console.log("Selection created");
      if (canvasInstance && e.selected.length === 1) {
        setSelectedObj(e.selected[0]);
        console.log("Selection");

        console.log(e.selected[0]);
      }
    };

    const handleSelectionCleared = () => {
      setSelectedObj(null);
    };

    if (canvasInstance) {
      canvasInstance.on("selection:created", handleSelectionCreated);
      canvasInstance.on("selection:updated", handleSelectionCreated);
      canvasInstance.on("selection:cleared", handleSelectionCleared);
    }

    return () => {
      if (canvasInstance) {
        canvasInstance.off("selection:created", handleSelectionCreated);
        canvasInstance.off("selection:updated", handleSelectionCreated);
        canvasInstance.off("selection:cleared", handleSelectionCleared);
      }
    };
  }, [props.canvas]);

  function handleColorChange(event: any) {
    const canvasInstance = props.canvas.current;

    if (!canvasInstance) {
      return;
    }

    const obj = canvasInstance.getActiveObject();

    if (obj) {
      obj.set({ fill: event.currentTarget.value as string });
      console.log(event.currentTarget.value as string);
      props.setCurrentColor(event.currentTarget.value as string);
      canvasInstance.renderAll();
    }
  }

  return (
    <div
      style={{
        width: "200px",
        background: "LightGrey",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h4>Current color: {selectedObj ? selectedObj.fill : null} </h4>
      <label>Select color</label>
      <input
        style={{ width: "150px" }}
        type="color"
        onChange={handleColorChange}
      ></input>
    </div>
  );
}
