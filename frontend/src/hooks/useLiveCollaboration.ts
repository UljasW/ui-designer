import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useLiveCollaboration(designId: string) {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    /* const socketInstance = io("ws://localhost:3001", { query: { designId } });

    socketInstance.on("design-updated", (data) => {
      if (data.status === "success") {
      } else {
        console.log("Unknown error");
      }
    });

    socketInstance.on("design-update-error", (data) => {
      console.log(data.message || "Unknown error");
    });

    setSocket(socketInstance);

    // Cleanup the socket connection on unmount
    return () => {
      socketInstance.disconnect();
    }; */
  }, [designId]);

  //update collabers canvas (live update)
  const update = (objects: any) => {
    console.log("update", objects);
    if (!socket) return;
    socket.emit("update", { objects });
  };

  //save changes when user deselects object
  const saveToDb = (objects: any) => {
    console.log("update-db", objects);
    if (!socket) return;
    socket.emit("update-db", { objects });
  };
  
  //change layerIndex in db
  const moveUpDb = (id: string) => {
    console.log("moveUpDb", id);
    if (!socket) return;
    socket.emit("move-up", { id });
  };

  //change layerIndex in db
  const moveDownDb = (id: string) => {
    console.log("moveDownDb", id);
    if (!socket) return;
    socket.emit("move-down", { id });
  };
  return {
    saveToDb, moveUpDb, moveDownDb
  };
}
