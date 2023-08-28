import React from "react";

interface FabricCanvasProps {
  canvas: React.MutableRefObject<fabric.Canvas | undefined>;
}

export default function Properties(props: FabricCanvasProps) {
  return (
    <div
      style={{ width: "200px", background: "LightGrey"}}
    >
      properties
    </div>
  );
}
