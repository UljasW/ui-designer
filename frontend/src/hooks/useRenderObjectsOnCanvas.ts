import { fabric } from "fabric";

export default function useRenderObjectsOnCanvas() {
  const renderObjectsOnCanvas = (
    canvasInstance: fabric.Canvas,
    objects: any
  ) => {
    console.log("Rendering objects:", objects);
    // Logic for rendering objects on the canvas
    return;
  };

  return {
    renderObjectsOnCanvas,
  };
}
