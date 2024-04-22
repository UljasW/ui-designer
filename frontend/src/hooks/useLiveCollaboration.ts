import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import { socketUrl } from "../constants";

export default function useLiveCollaboration(
  designId: string,
  renderObjectsOnCanvas: (
    canvasInstance: fabric.Canvas,
    objectsContainer: any
  ) => void,
  canvas: React.MutableRefObject<fabric.Canvas | undefined>
) {
  const token = localStorage.getItem("jwt");

  const socketRef = useRef<any>();

  useEffect(() => {
    socketRef.current = io(`${socketUrl}`, {
      query: { token, designId },
    });

    socketRef.current.on("connect", () => {
      console.log("Socket connected!");
    });

    socketRef.current.on("disconnect", () => {
      console.log("Socket disconnected!");
    });

    socketRef.current.on("updated-objects-live-visually", (data: any) => {
      console.log("update-objects-live-visually received from server: ", data);

      if (!canvas.current) return;
      renderObjectsOnCanvas(canvas.current, data);
    });

    // Cleanup the socket connection on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [designId, token, canvas]);

  //save changes when user deselects object
  const updateDb = (objects: any) => {
    if (!socketRef.current) return;
    console.log("Sending objects");

    socketRef.current.emit("update-db", { objects }, (response: any) => {
      console.log("Server Acknowledgement:", response);
    });
  };

  function cloneFabricObjectsAsync(
    originalObjects: fabric.Object[],
    callback: (clonedObjects: fabric.Object[]) => void
  ): void {
    let clonePromises: Promise<fabric.Object>[] = originalObjects.map((obj) => {
      return new Promise<fabric.Object>((resolve) => {
        obj.clone((cloned: fabric.Object | null) => {
          if (cloned) {
            resolve(cloned);
          } else {
            throw new Error("Cloning failed");
          }
        });
      });
    });

    Promise.all(clonePromises).then((clonedObjects) => {
      callback(clonedObjects);
    });
  }

  const updateObjectsLiveVisually = (rawObjects: fabric.Object[] | undefined) => {
    if (!socketRef.current || !rawObjects) return;

    const activeObj = canvas.current?.getActiveObject();


    cloneFabricObjectsAsync(rawObjects, (objects) => {
      console.log(objects);

      const index = objects.findIndex(
        (obj) => (obj as any).id === (activeObj as any).id
      );

      if (index === -1) return;

      objects[index].selectable=false;
      objects[index].hasControls=false;


      socketRef.current.emit(
        "update-objects-live-visually",
        { objects },
        (response: any) => {
          console.log("Server Acknowledgement:", response);
        }
      );
    });
  };

  /* const updateObjectsLiveVisually = (objects: fabric.Object[] | undefined) => {
    if (!socketRef.current || !objects) return;

    const objectsClone = objects.map(obj => ({ ...obj }));

    const activeObj = canvas.current?.getActiveObject();

    const index = objectsClone.findIndex(
      (obj) => (obj as any).id === (activeObj as any).id
    );

    if (index !== -1) {
        objectsClone[index] = {
            ...objectsClone[index],
            selectable: false,
            hasControls: false
        };

        console.log(objectsClone[index])

        socketRef.current.emit(
          "update-objects-live-visually",
          { objects: objectsClone },
          (response: any) => {
            console.log("Server Acknowledgement:", response);
          }
        );
    }
}; */

  const deleteObjects = (objects: any) => {
    if (!socketRef.current) return;
    console.log("Sending objects");

    socketRef.current.emit("delete-objects", { objects }, (response: any) => {
      console.log("Server Acknowledgement:", response);
    });
  };

  const getObjects = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (!socketRef.current) {
        reject("Socket reference is not defined");
        return;
      }

      socketRef.current.emit("get-objects", (response: any) => {
        console.log("Server Acknowledgement:", response);
        resolve(response);
      });
    });
  };

  return {
    updateDb,
    getObjects,
    deleteObjects,
    updateObjectsLiveVisually,
  };
}
