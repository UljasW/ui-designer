import fabric from "fabric";
import React, { useCallback, useEffect, useState } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.fabric.Canvas | undefined>;
}

export default function Selection(props: FabricCanvasProps) {
  const canvas = props.canvas.current;
  const [mousePos, setMousePos] = useState<[number, number] | undefined>();
  const [rect, setRect] = useState<fabric.fabric.Rect | undefined>();

  useEffect(() => {
    if (canvas) {
      canvas.on("mouse:down", () => {
        if (rect) {
          rect.set({ selectable: true, hasControls: true });
          canvas.setActiveObject(rect); // Make the rectangle the active object
          canvas.renderAll();
          setRect(undefined); // Clear the rect object
        }
      });

      canvas.on("mouse:move", (options) => {
        const pointer = canvas.getPointer(options.e);
        setMousePos([pointer.x, pointer.y]);

        if (rect) {
          rect.set({ left: pointer.x, top: pointer.y });

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
  }, [canvas, rect]);

  const addRedRect = useCallback(() => {
    if (canvas && !rect) {
      const rect = new fabric.fabric.Rect({
        top: mousePos ? mousePos[1] : 100,
        left: mousePos ? mousePos[0] : 100,
        width: 60,
        height: 70,
        fill: "red",
        selectable: false, // Initially not selectable
        hasControls: false, // No controls for now
      });

      setRect(rect);
      canvas.add(rect);
    }
  }, [canvas, mousePos]);

  const addBlueRect = useCallback(() => {
    if (canvas && !rect) {
      const rect = new fabric.fabric.Rect({
        top: mousePos ? mousePos[1] : 100,
        left: mousePos ? mousePos[0] : 100,
        width: 60,
        height: 70,
        fill: "blue",
        selectable: false, // Initially not selectable
        hasControls: false, // No controls for now
      });

      setRect(rect);
      canvas.add(rect);
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
      <button disabled={rect ? true : false} onClick={addRedRect}>
        ADD RED RECT
      </button>
      <button disabled={rect ? true : false} onClick={addBlueRect}>
        ADD BLUE RECT
      </button>
    </div>
  );
}
