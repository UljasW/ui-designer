import React, { useEffect, useState } from "react";
import { fabric } from "fabric";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function Properties(props: FabricCanvasProps) {
  const [selectedObj, setSelectedObj] = useState<any | null>(null);

  const [fillColor, setFillColor] = useState<string>("");
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const [strokeColor, setStrokeColor] = useState<string>("");
  const [strokeWidth, setStrokeWidth] = useState<number>(0);

  useEffect(() => {
    const canvasInstance = props.canvas.current;

    const handleSelectionCreated = (e: any) => {
      console.log("Selection created");
      if (canvasInstance && e.selected.length === 1) {
        setSelectedObj(e.selected[0]);
        const selectedObject = e.selected[0];

        // Update state with the properties of the newly selected object
        setFillColor(selectedObject.fill || "");
        setBorderRadius(selectedObject.rx || 0); // Assuming rx and ry are the same
        setStrokeColor(selectedObject.stroke || "");
        setStrokeWidth(selectedObject.strokeWidth || 0);
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
      setFillColor(event.currentTarget.value as string);
      canvasInstance.renderAll();
    }
    props.setCurrentColor(event.currentTarget.value as string);
  }

  function handleRadiusChange(event: any) {
    const canvasInstance = props.canvas.current;

    if (!canvasInstance) {
      return;
    }

    const obj = canvasInstance.getActiveObject();

    if (obj instanceof fabric.Rect) {
      // Check if the object is an instance of fabric.Rect
      const radius = parseFloat(event.currentTarget.value);
      obj.set({
        rx: radius,
        ry: radius,
      });

      setBorderRadius(radius);

      console.log(event.currentTarget.value);
      canvasInstance.renderAll();
    }
  }

  function handleStrokeColorChange(event: any) {
    const canvasInstance = props.canvas.current;
    if (!canvasInstance) return;
    const obj = canvasInstance.getActiveObject();
    if (obj) {
      obj.set({ stroke: event.currentTarget.value });
      console.log(event.currentTarget.value);
      setStrokeColor(event.currentTarget.value);
      canvasInstance.renderAll();
    }
  }

  function handleStrokeWidthChange(event: any) {
    const canvasInstance = props.canvas.current;
    if (!canvasInstance) return;
    const obj = canvasInstance.getActiveObject();
    if (obj) {
      const strokeWidth = parseFloat(event.currentTarget.value);
      obj.set({ strokeWidth });
      setStrokeWidth(strokeWidth);
      console.log(event.currentTarget.value);
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
        value={fillColor}
        onChange={handleColorChange}
      ></input>

      <label>Select borderradius</label>
      <input
        style={{ width: "150px" }}
        type="number"
        value={borderRadius}
        onChange={handleRadiusChange}
      ></input>

      {/* New Inputs */}
      <h4>Current stroke color: {selectedObj ? selectedObj.stroke : null} </h4>
      <label>Select stroke color</label>
      <input
        style={{ width: "150px" }}
        type="color"
        value={strokeColor}
        onChange={handleStrokeColorChange}
      ></input>

      <label>Select stroke width</label>
      <input
        style={{ width: "150px" }}
        type="number"
        value={strokeWidth}
        onChange={handleStrokeWidthChange}
      ></input>
    </div>
  );
}
