import { fabric } from "fabric";

export default function useRenderObjectsOnCanvas() {
  const renderObjectsOnCanvas = (
    canvasInstance: fabric.Canvas,
    objectsContainer: any
  ) => {
    canvasInstance.clear();

    const sortedDataObjects = objectsContainer.objects
      .sort((a: any, b: any) => a.layerIndex - b.layerIndex);


      console.log(sortedDataObjects)


    sortedDataObjects.forEach((obj: any) => {
      let fabricObj;

      switch(obj.type) {
        case 'rect':
          fabricObj = new fabric.Rect(obj);
          break;
        case 'text':
          fabricObj = new fabric.Text(obj.text,obj);
          break;
        default:
          console.error("Unsupported object type: ", obj.type);
          return;
      }

      canvasInstance.add(fabricObj);
    });

    canvasInstance.renderAll();

    return;
  };

  return {
    renderObjectsOnCanvas,
  };
}
