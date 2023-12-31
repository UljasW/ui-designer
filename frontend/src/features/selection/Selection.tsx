import fabric from "fabric";
import React, { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Button from "../../components/Button";
import { useNavigate } from "react-router-dom";
import useSnapping from "../../hooks/useSnapping";
import Checkbox from "../../components/Checkbox";
import Input from "../../components/Input";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.fabric.Canvas | undefined>;
  currentColor: string;
}

export default function Selection(props: FabricCanvasProps) {
  const canvas = props.canvas.current;
  const [mousePos, setMousePos] = useState<[number, number] | undefined>();
  const [object, setObject] = useState<fabric.fabric.Object | undefined>();
  const navigate = useNavigate();
  const [enableSnapping, setEnableSnapping] = useState(true);
  const [snappingDistance, setSnappingDistance] = useState<number>(5);
  const [snappingArea, setSnappingArea] = useState<number>(200);
  const [mouseDown, setMouseDown] = useState<boolean>(false);

  const { checkSnapping } = useSnapping(props.canvas);

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:down", () => {
        setMouseDown(true);
        if (!object) {
          return;
        }

        object.set({ selectable: true, hasControls: true });
        canvas.setActiveObject(object); // Make the rectangle the active object
        canvas.renderAll();
        setObject(undefined); // Clear the rect object
      });

      canvas.on("mouse:up", () => {
        setMouseDown(false);
        if (object === undefined) {
          canvas.getObjects("line").forEach((obj) => {
            canvas.remove(obj);
          });
          canvas.renderAll();
        }
      });

      canvas.on("mouse:move", (options) => {
        setObjPos(canvas, options);
        console.log(object);
        if (enableSnapping && (mouseDown || object !== undefined)) {
          console.log("snapping");
          checkSnapping(snappingDistance, snappingArea);
        }
        canvas.renderAll();
      });
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (canvas) {
        canvas.off("mouse:down");
        canvas.off("mouse:up");
        canvas.off("mouse:move");
      }
    };
  }, [
    canvas,
    object,
    enableSnapping,
    snappingDistance,
    snappingArea,
    mouseDown,
  ]);

  const setObjPos = (canvas: any, options: any) => {
    const pointer = canvas.getPointer(options.e);
    setMousePos([pointer.x, pointer.y]);

    if (!object) {
      return;
    }
    object.set({ left: pointer.x, top: pointer.y });
  };

  const addRect = useCallback(() => {
    if (canvas && !object) {
      const rect = new fabric.fabric.Rect({
        top: mousePos ? mousePos[1] : 100,
        left: mousePos ? mousePos[0] : 100,
        width: 60,
        height: 70,
        selectable: false, // Initially not selectable
        hasControls: false, // No controls for now
        strokeWidth: 0,
        fill: props.currentColor,
        stroke: props.currentColor,
      });

      (rect as any).id = nanoid();
      (rect as any).layerIndex = canvas.getObjects().length;

      setObject(rect);
      canvas.add(rect);
      canvas.setActiveObject(rect);
    }
  }, [canvas, mousePos]);

  const addText = useCallback(() => {
    if (canvas && !object) {
      const text = new fabric.fabric.Text("Sample Text", {
        // <-- Set the desired text here
        top: mousePos ? mousePos[1] : 100,
        left: mousePos ? mousePos[0] : 100,
        fontSize: 24, // Adjust font size to your liking
        selectable: false, // Initially not selectable
        hasControls: false, // No controls for now
        fill: props.currentColor,
        stroke: props.currentColor,
        strokeWidth: 0,
      });

      console.log(text);

      (text as any).id = nanoid();
      (text as any).layerIndex = canvas.getObjects().length;

      setObject(text);
      canvas.add(text);
      canvas.setActiveObject(text);
    }
  }, [canvas, mousePos]);

  const handleSnapClick = () => {
    setEnableSnapping((prevState) => !prevState);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <Button
          onClick={function (e: any): void {
            addRect();
          }}
          color={"primary"}
          content={"Add rectangle"}
          height="40px"
        ></Button>

        <Button
          onClick={function (e: any): void {
            addText();
          }}
          color={"primary"}
          content={"Add text"}
          max-height="40px"
        ></Button>
        <Checkbox checked={enableSnapping} onClick={handleSnapClick} />
        <div style={{ background: "lightGrey", borderRadius: "5px" }}>
          <Input
            type={"number"}
            placeholder=""
            value={snappingDistance}
            height="10px"
            width="50px"
            onChange={(e: any) => {
              console.log(e.target.value);
              setSnappingDistance(e.target.value);
            }}
          />
          <label>Snapping distance</label>
        </div>
        <div style={{ background: "lightGrey", borderRadius: "5px" }}>
          <Input
            type={"number"}
            placeholder=""
            value={snappingArea}
            height="10px"
            width="50px"
            onChange={(e: any) => {
              console.log(e.target.value);
              setSnappingArea(e.target.value);
            }}
          />
          <label>Snapping area</label>
        </div>
      </div>

      <Button
        onClick={function (e: any): void {
          navigate("/");
        }}
        color={"primary"}
        height="40px"
        content={"Home"}
      ></Button>
    </div>
  );
}
