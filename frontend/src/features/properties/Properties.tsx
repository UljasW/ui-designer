import React, { useEffect, useState } from "react";
import { fabric } from "fabric";
import Input from "../../components/Input";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
  setCurrentColor: React.Dispatch<React.SetStateAction<string>>;
  updateDb: (objects: any) => void;

}

export default function Properties(props: FabricCanvasProps) {
  const [selectedObj, setSelectedObj] = useState<any | null>(null);

  const [fillColor, setFillColor] = useState<string>("");
  const [borderRadius, setBorderRadius] = useState<number>(0);
  const [strokeColor, setStrokeColor] = useState<string>("black");
  const [strokeWidth, setStrokeWidth] = useState<number>(0);
  const [textValue, setTextValue] = useState<string>(""); 

  const [width, setWidth] = useState<number>(100);
  const [hight, setHight] = useState<number>(1);

  useEffect(() => {
    const canvasInstance = props.canvas.current;

    const handleSelectionCreated = (e: any) => {



      if (canvasInstance && e.selected.length === 1) {
        setSelectedObj(e.selected[0]);
        const selectedObject = e.selected[0];

        // Update state with the properties of the newly selected object
        setFillColor(selectedObject.fill || "");
        setBorderRadius(selectedObject.rx || 0); // Assuming rx and ry are the same
        setStrokeColor(selectedObject.stroke || "black");
        setStrokeWidth(selectedObject.strokeWidth || 0);
        if (selectedObject.type === "text") {
          setTextValue(selectedObject.text || "");
        }

        initDimensions(canvasInstance);
      }
    };

    const handleSelectionCleared = () => {
      setSelectedObj(null);
    };

    if (canvasInstance) {
      canvasInstance.on("selection:created", handleSelectionCreated);
      canvasInstance.on("selection:updated", handleSelectionCreated);
      canvasInstance.on("selection:cleared", handleSelectionCleared);
      canvasInstance.on("object:scaling", handleScaling);
    }

    return () => {
      if (canvasInstance) {

        canvasInstance.off("selection:created", handleSelectionCreated);
        canvasInstance.off("selection:updated", handleSelectionCreated);
        canvasInstance.off("selection:cleared", handleSelectionCleared);
        canvasInstance.off("object:scaling", handleScaling);
        
      }
    };
  }, [props.canvas]);

  const handleScaling = (e: any) => {
    const object = e.target;

    const height = object.height * object.scaleY;
    const width = object.width * object.scaleX;

    setHight(height);
    setWidth(width);
  };

  const initDimensions = (canvasInstance: fabric.Canvas) => {
    const obj = canvasInstance.getActiveObject();

    if (!obj) return;


    const height = (obj.height ?? 0) * (obj.scaleY ?? 0);
    const width = (obj.width ?? 0) * (obj.scaleX ?? 0);

    setHight(height);
    setWidth(width);
  };

  function handleColorChange(event: any) {
    const canvasInstance = props.canvas.current;

    if (!canvasInstance) {
      return;
    }

    const obj = canvasInstance.getActiveObject();

    if (obj) {
      obj.set({ fill: event.currentTarget.value as string });
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

      canvasInstance.renderAll();
    }
  }

  function handleStrokeColorChange(event: any) {
    const canvasInstance = props.canvas.current;
    if (!canvasInstance) return;
    const obj = canvasInstance.getActiveObject();
    if (obj) {
      obj.set({ stroke: event.currentTarget.value });
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
      canvasInstance.renderAll();
    }
  }

  function handleTextChange(event: any) {
    const canvasInstance = props.canvas.current;
    if (!canvasInstance) return;

    const obj = canvasInstance.getActiveObject();
    if (obj && obj.type === "text") {
      const textObj = obj as fabric.Text;
      textObj.text = event.currentTarget.value;
      textObj.set("text", event.currentTarget.value);
      setTextValue(event.currentTarget.value);
      canvasInstance.renderAll();
    }
  }

  function handleWidthChange(event: any) {
    const canvasInstance = props.canvas.current;
    if (!canvasInstance) return;
    const obj = canvasInstance.getActiveObject();

    if (!obj) return;

    setWidth(event.currentTarget.value);

    const scaleX = event.currentTarget.value / (obj.width ?? 1);

    obj.scaleX = scaleX;

    canvasInstance.renderAll();
  }

  function handleHightChange(event: any) {
    const canvasInstance = props.canvas.current;
    if (!canvasInstance) return;
    const obj = canvasInstance.getActiveObject();

    if (!obj) return;

    setHight(event.currentTarget.value);

    const scaleY = event.currentTarget.value / (obj.height ?? 1);

    obj.scaleY = scaleY;

    canvasInstance.renderAll();
  }

  return (
    <div
      style={{
        width: "250px",
        padding: "20px", // Assuming your app uses 20px padding, for example
        background: "#F3F4F6", // Replace with the background color used in your app
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Replace with the shadow style used in your app
        display: "flex",
        flexDirection: "column",
        gap: "10px", // Adjust the gap to match the spacing in your app
        zIndex: 100,
        borderLeft: "1px solid #ced4da",
      }}
    >
      {selectedObj && selectedObj.type === "text" && (
        <div>
          <label>Text Content</label>
          <Input
            type={"text"}
            placeholder={"Enter text"}
            value={textValue}
            onChange={handleTextChange}
            width="150px"
          ></Input>
        </div>
      )}
      <h4>Current color: {selectedObj ? selectedObj.fill : null} </h4>
      <label>Select color</label>
      <input
        style={{
          width: "150px",
          border: "1px solid #ced4da",
          borderRadius: "5px",
        }}
        type="color"
        value={fillColor}
        onChange={handleColorChange}
      ></input>

      <label>Select borderradius</label>

      <Input
        type={"number"}
        placeholder={"Enter radius"}
        value={borderRadius}
        onChange={handleRadiusChange}
        width="150px"
      ></Input>

      {/* New Inputs */}
      <h4>Current stroke color: {selectedObj ? selectedObj.stroke : null} </h4>
      <label>Select stroke color</label>
      <input
        style={{
          width: "150px",
          border: "1px solid #ced4da",
          borderRadius: "5px",
        }}
        type="color"
        value={strokeColor}
        onChange={handleStrokeColorChange}
      ></input>

      <label>Select stroke width</label>

      <Input
        type={"number"}
        placeholder={"Enter stroke width"}
        value={strokeWidth}
        onChange={handleStrokeWidthChange}
        width="150px"
      ></Input>

      <label>Select width</label>

      <Input
        type={"number"}
        placeholder={"Enter hight"}
        value={width}
        onChange={handleWidthChange}
        width="150px"
      ></Input>

      <label>Select height</label>

      <Input
        type={"number"}
        placeholder={"Enter hight"}
        value={hight}
        onChange={handleHightChange}
        width="150px"
      ></Input>
    </div>
  );
}
