import fabric from "fabric";
import React, { useCallback, useEffect, useState } from "react";
import { nanoid } from "nanoid";
import Button from "../../components/Button";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.fabric.Canvas | undefined>;
  currentColor: string;
}

export default function Selection(props: FabricCanvasProps) {
  const canvas = props.canvas.current;
  const [mousePos, setMousePos] = useState<[number, number] | undefined>();
  const [object, setObject] = useState<fabric.fabric.Object | undefined>();

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:down", () => {
        if (!object) {
          return;
        }

        object.set({ selectable: true, hasControls: true });
        canvas.setActiveObject(object); // Make the rectangle the active object
        canvas.renderAll();
        setObject(undefined); // Clear the rect object
      });

      canvas.on("mouse:move", (options) => {
        const pointer = canvas.getPointer(options.e);
        setMousePos([pointer.x, pointer.y]);

        if (!object) {
          return;
        }
        object.set({ left: pointer.x, top: pointer.y });
        canvas.renderAll();
      });
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (canvas) {
        canvas.off("mouse:down");
        canvas.off("mouse:move");
      }
    };
  }, [canvas, object]);

  const addRect = useCallback(() => {
    if (canvas && !object) {
      const rect = new fabric.fabric.Rect({
        top: mousePos ? mousePos[1] : 100,
        left: mousePos ? mousePos[0] : 100,
        width: 60,
        height: 70,
        selectable: false, // Initially not selectable
        hasControls: false, // No controls for now
        fill: props.currentColor,
      });

      (rect as any).id = nanoid();
      (rect as any).layerIndex = canvas.getObjects().length;

      setObject(rect);
      canvas.add(rect);
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
      });

      console.log(text);

      (text as any).id = nanoid();
      (text as any).layerIndex = canvas.getObjects().length;

      setObject(text);
      canvas.add(text);
    }
  }, [canvas, mousePos]);

  return (
    <div>
      <Button
        onClick={function (e: any): void {
          addRect();
        }}
        color={"primary"}
        content={"Add rectangle"}
      ></Button>

      <Button
        onClick={function (e: any): void {
          addText();
        }}
        color={"primary"}
        content={"Add text"}
      ></Button>
    </div>
   
  );
}
