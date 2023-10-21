import fabric from "fabric";

export default function useSnapping(
  canvas: React.MutableRefObject<fabric.fabric.Canvas | undefined>
) {
  const checkSnapping = () => {
    console.log("checkSnapping");
    const canvasInstance = canvas.current;

    if (!canvasInstance) return;

    const activeObjects = canvasInstance?.getActiveObjects();

    if (activeObjects?.length !== 1) return;
    const activeObject = activeObjects[0];

    const activeObjectCenter = activeObject.getCenterPoint();
    console.log("activeObjectCenter: ", activeObjectCenter);

    const activeObjectSupportLines = getSupportLines(activeObject);

    console.log("activeObjectSupportLines: ", activeObjectSupportLines);
  };

  const getSupportLines = (obj: fabric.fabric.Object) => {
    const activeObjectCenter = obj.getCenterPoint();
    const height = obj.height || 0;
    const width = obj.width || 0;

    const objTopLine = activeObjectCenter.y - height / 2;
    const objLine = activeObjectCenter.y + height / 2;
    const objLeftLine = activeObjectCenter.x - width / 2;
    const objRightLine = activeObjectCenter.x + width / 2;

    return {
      top: objTopLine,
      bottom: objLine,
      left: objLeftLine,
      right: objRightLine,
    };
  };

  return {
    checkSnapping,
  };
}
