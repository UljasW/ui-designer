import React, { useEffect } from "react";
import { FabricJSCanvas, useFabricJSEditor } from "fabricjs-react";

interface CanvasProps {
  onReady: Function
}

function Canvas({ onReady }: CanvasProps) {
  const { editor } = useFabricJSEditor();
  
  useEffect(() => {
    onReady(editor);
  }, [editor, onReady]);

  return (
    <div className="canvas-component">
      {/* Rendering the canvas */}
      <FabricJSCanvas className="sample-canvas" />‰
    </div>
  );
}

export default Canvas;
