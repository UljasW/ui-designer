import fabric from "fabric";

export default function useSnapping(
  canvas: React.MutableRefObject<fabric.fabric.Canvas | undefined>
) {
  //x lines are vertical and y lines are horizontal

  interface Lines {
    y: {
      top: number;
      center: number;
      bottom: number;
    };
    x: {
      left: number;
      center: number;
      right: number;
    };
  }

  //object will teleport this many pixels maximum
  const snapDistance = 10;

  //objects outside this area will not be taken into account
  const snappingArea = 100;

  /* 
run every time a mouse moves
takes canvas as argument

checks if there is an object that is active
if there is an active object, it checks and saves all objects that are close to the active object
calculates lines from each object that is close to the active object
calculates lines from the active object
checks if any coplanar line is close to one of the active object's coplanar lines
if a line is close, it moves the active object to the other line

a total of 6 lines are calculated for each object. 3 horizontal and 3 vertical. One in the middle and one on each side.
 */

  const checkSnapping = () => {
    const currentCanvas = canvas.current;
    const activeObjects = currentCanvas?.getActiveObjects();
    if (!activeObjects || !currentCanvas || activeObjects?.length > 1) return;

    const activeObject = activeObjects[0];

    const allObjects = currentCanvas.getObjects();

    const objectsNearActiveObject = filterObjectsNearActiveObject(
      activeObject,
      allObjects
    );

    const { activeObjectLines, objectsLines } = getAllLines(
      activeObject,
      objectsNearActiveObject
    );
  };

  const snap = (
    activeObject: fabric.fabric.Object,
    activeObjectLines: Lines,
    objectsLines: Lines[]
  ) => {

    //for each object that is close to the active object
    //check if any of the lines in the same plane are close to any of the active object's lines
    //if they are close, move the active object to the other line

    objectsLines.forEach((element) => {
      checkIfLinesAreCloseAndAdjust(activeObject, activeObjectLines, element);
      
    });
  };

  const checkIfLinesAreCloseAndAdjust = (
    activeObject: fabric.fabric.Object,
    activeObjectLines: Lines,
    objectLines: Lines
  ) => {
    // Check each line of the active object against each line of the other object
    // Adjust position if any lines are close
    // Example: Check if the horizontal center lines are close
    if (Math.abs(activeObjectLines.x.center - objectLines.x.center) < snapDistance) {
      activeObject.set("left", objectLines.x.center - activeObject.getScaledWidth() / 2);
    }
    if (Math.abs(activeObjectLines.y.center - objectLines.y.center) < snapDistance) {
      activeObject.set("top", objectLines.y.center - activeObject.getScaledHeight() / 2);
    }

    if (Math.abs(activeObjectLines.x.left - objectLines.x.left) < snapDistance) {
      activeObject.set("left", objectLines.x.left);
    }
    if (Math.abs(activeObjectLines.y.top - objectLines.y.top) < snapDistance) {
      activeObject.set("top", objectLines.y.top);
    }

    if (Math.abs(activeObjectLines.x.right - objectLines.x.right) < snapDistance) {
      activeObject.set("left", objectLines.x.right - activeObject.getScaledWidth());
    }

    if (Math.abs(activeObjectLines.y.bottom - objectLines.y.bottom) < snapDistance) {
      activeObject.set("top", objectLines.y.bottom - activeObject.getScaledHeight());
    }
  };


  const filterObjectsNearActiveObject = (
    activeObject: fabric.fabric.Object,
    allObjects: fabric.fabric.Object[]
  ) => {
    const activeObjectCenter = activeObject.getCenterPoint();

    const objectsNearActiveObject = allObjects.filter((object) => {
      if (object === activeObject) return false;

      const objectCenter = object.getCenterPoint();
      const distance = Math.sqrt(
        Math.pow(activeObjectCenter.x - objectCenter.x, 2) +
          Math.pow(activeObjectCenter.y - objectCenter.y, 2)
      );
      return distance < snappingArea;
    });

    return objectsNearActiveObject;
  };

  const getAllLines = (
    activeObject: fabric.fabric.Object,
    objects: fabric.fabric.Object[]
  ) => {
    const activeObjectLines = callculateLines(activeObject);

    const objectsLines = objects.map((object) => callculateLines(object));

    return {
      activeObjectLines,
      objectsLines,
    };
  };

  const callculateLines = (object: fabric.fabric.Object) => {
    const centerPoint = object.getCenterPoint();

    const top = object.top;

    const left = object.left;

    if (!centerPoint || !top || !left) return;

    const lines: Lines = {
      y: {
        top: top,
        center: centerPoint.y,
        bottom: top + object.getScaledHeight(),
      },
      x: {
        left: left,
        center: centerPoint.x,
        right: left + object.getScaledWidth(),
      },
    };

    return lines;
  };

  return {
    checkSnapping,
  };
}
