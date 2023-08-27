import fabric from "fabric";
import React, { useCallback, useEffect } from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.fabric.Canvas | undefined>;
}

export default function Selection(props: FabricCanvasProps) {
  const canvas = props.canvas.current;
  useEffect(() => {
    if (canvas) {
      canvas.on("selection:created", (e: any) => {
        moveUp(e);
      });

      canvas.on("selection:updated", (e: any) => {
        moveUp(e);
      });

    }
  }, [canvas]);

  function moveUp(e:any) {
    if (e.selected) {
      e.selected.map((element: any) => {
        if (canvas) {
          canvas.bringToFront(element);
        }
      });
    }
  }

  const addStuff = useCallback(() => {
    if (canvas) {
      const rect = new fabric.fabric.Rect({
        top: 100,
        left: 100,
        width: 60,
        height: 70,
        fill: "red",
        selectable: true,
        hasControls: true,
      });

      canvas.add(rect);
    }
  }, [canvas]);

  const addStuff2 = useCallback(() => {

    if (canvas) {

      const rect = new fabric.fabric.Rect({
        top: 100,
        left: 100,
        width: 60,
        height: 70,
        fill: "blue",
        selectable: true,
        hasControls: true,
      });

      canvas.add(rect);
    }
  }, [canvas]);

  return (
    <div
      style={{
        height: "50px",
        background: "grey",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <button onClick={addStuff}>ADD</button>
      <button onClick={addStuff2}>ADD2</button>
    </div>
  );
}
