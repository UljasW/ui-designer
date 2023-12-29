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
  const snappingArea = 500;
  

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

    if (!activeObjects || !currentCanvas || activeObjects?.length < 1) return;

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

    const snapped = snap(activeObject, activeObjectLines, objectsLines);
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
      if (
        checkIfLinesAreCloseAndAdjust(activeObject, activeObjectLines, element)
      ) {
        return true;
      }
    });

    return false;
  };

  const checkIfLinesAreCloseAndAdjust = (
    activeObject: fabric.fabric.Object,
    activeObjectLines: Lines,
    objectLines: Lines
  ) => {
    const xLinesActive = [
      activeObjectLines.x.left,
      activeObjectLines.x.center,
      activeObjectLines.x.right,
    ];
    const yLinesActive = [
      activeObjectLines.y.top,
      activeObjectLines.y.center,
      activeObjectLines.y.bottom,
    ];
  
    const xLinesObj = [
      objectLines.x.left,
      objectLines.x.center,
      objectLines.x.right,
    ];
    const yLinesObj = [
      objectLines.y.top,
      objectLines.y.center,
      objectLines.y.bottom,
    ];
  
    // Check and snap x lines
    for (let index = 0; index < xLinesActive.length; index++) {
      for (let index2 = 0; index2 < xLinesObj.length; index2++) {
        if (Math.abs(xLinesActive[index] - xLinesObj[index2]) < snapDistance) {
          switch (index) {
            case 0:
              activeObject.set("left", xLinesObj[index2]);
              return true;
            case 1:
              activeObject.set("left", xLinesObj[index2] - activeObject.getScaledWidth() / 2);
              return true;
            case 2:
              activeObject.set("left", xLinesObj[index2] - activeObject.getScaledWidth());
              return true;
          }
        }
      }
    }
  
    // Check and snap y lines
    for (let index = 0; index < yLinesActive.length; index++) {
      for (let index2 = 0; index2 < yLinesObj.length; index2++) {
        if (Math.abs(yLinesActive[index] - yLinesObj[index2]) < snapDistance) {
          switch (index) {
            case 0:
              activeObject.set("top", yLinesObj[index2]);
              return true;
            case 1:
              activeObject.set("top", yLinesObj[index2] - activeObject.getScaledHeight() / 2);
              return true;
            case 2:
              activeObject.set("top", yLinesObj[index2] - activeObject.getScaledHeight());
              return true;
          }
        }
      }
    }
  
    return false;
  };
  

    /* xLinesActive.forEach((xLineActive) => {
      xLinesObj.forEach((xLineObj) => {
        if (Math.abs(xLineActive - xLineObj) < snapDistance) {
          activeObject.set("left", xLineObj);
          return true;
        }
      });
    });

    yLinesActive.forEach((yLineActive) => {
      yLinesObj.forEach((yLineObj) => {
        if (Math.abs(yLineActive - yLineObj) < snapDistance) {
          activeObject.set("top", yLineObj);
          return true;
        }
      });
    }); */

  

  const filterObjectsNearActiveObject = (
    activeObject: fabric.fabric.Object,
    allObjects: fabric.fabric.Object[]
  ) => {
    //const activeObjectCenter = activeObject.getCenterPoint();

    const objectsNearActiveObject = allObjects.filter((object) => {
      if (object === activeObject) return false;

      /* const objectCenter = object.getCenterPoint();
      const distance = Math.sqrt(
        Math.pow(activeObjectCenter.x - objectCenter.x, 2) +
          Math.pow(activeObjectCenter.y - objectCenter.y, 2)
      );
      return distance < snappingArea; */

      return true;
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

  const callculateLines = (object: fabric.fabric.Object): Lines => {
    const centerPoint = object.getCenterPoint();

    const top = object.top;

    const left = object.left;

    if (!centerPoint || !top || !left)
      return {
        y: { top: 0, center: 0, bottom: 0 },
        x: { left: 0, center: 0, right: 0 },
      };

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
