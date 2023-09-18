import fabric from "fabric";
import React, { useCallback, useEffect, useState } from "react";
import { nanoid } from 'nanoid'

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.fabric.Canvas | undefined>;
  currentColor: string
}

export default function Selection(props: FabricCanvasProps) {
  const canvas = props.canvas.current;
  const [mousePos, setMousePos] = useState<[number, number] | undefined>();
  const [rect, setRect] = useState<fabric.fabric.Rect | undefined>();
  const [text, setText] = useState<fabric.fabric.Text | undefined>();


  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:down", () => {
        if (rect) {
          rect.set({ selectable: true, hasControls: true });
          canvas.setActiveObject(rect); // Make the rectangle the active object
          canvas.renderAll();
          setRect(undefined); // Clear the rect object
        }
        if (text) {
          text.set({ selectable: true, hasControls: true });
          canvas.setActiveObject(text); // Make the rectangle the active object
          canvas.renderAll();
          setText(undefined); // Clear the rect object
        }
      });

      canvas.on("mouse:move", (options) => {
        const pointer = canvas.getPointer(options.e);
        setMousePos([pointer.x, pointer.y]);

        if (rect) {
          rect.set({ left: pointer.x, top: pointer.y });

          canvas.renderAll();
        }

        if (text) {
          text.set({ left: pointer.x, top: pointer.y });

          canvas.renderAll();
        }
      });
    }

    // Cleanup event listeners on component unmount
    return () => {
      if (canvas) {
        canvas.off("mouse:down");
        canvas.off("mouse:move");
      }
    };
  }, [canvas, rect, text]);

  const addRect = useCallback(() => {
    if (canvas && !rect) {
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



      setRect(rect);
      canvas.add(rect);
    }
  }, [canvas, mousePos]);

  const addText = useCallback(() => {
    if (canvas && !text) {
      const text = new fabric.fabric.Text('Sample Text', {  // <-- Set the desired text here
        top: mousePos ? mousePos[1] : 100,
        left: mousePos ? mousePos[0] : 100,
        fontSize: 24,  // Adjust font size to your liking
        selectable: false, // Initially not selectable
        hasControls: false, // No controls for now
        fill: props.currentColor,
        
      });

      (text as any).id = nanoid();
      (rect as any).layerIndex = canvas.getObjects().length;


      setText(text);
      canvas.add(text);
    }
}, [canvas, mousePos]);



  return (
    <div
      style={{
        height: "50px",
        background: "LightGrey",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <button disabled={rect || text ? true : false} onClick={addRect}>
        ADD RECT
      </button>

      <button disabled={rect || text ? true : false} onClick={addText}>
        ADD TEXT
      </button>

    </div>
  );
}
