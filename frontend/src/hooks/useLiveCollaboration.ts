import { useCallback, useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

export default function useLiveCollaboration(designId: string) {
  const socketRef = useRef<any>(null);

  useEffect(() => {
    console.log('Value of designId before connection:', designId);
    socketRef.current = io("ws://localhost:3001", { query: { designId } });
    
    socketRef.current.on("connect", () => { console.log("Socket connected!"); });

    socketRef.current.on("disconnect", () => { console.log("Socket disconnected!"); });



    // Cleanup the socket connection on unmount
    return () => {
      socketRef.current.disconnect();
    };
  }, [designId]);

  //update collabers canvas (live update)
  /* const update = (objects: any) => {
    console.log("update", objects);
    if (!socket) return;
    socket.emit("update", { objects });
  }; */

  //save changes when user deselects object
  const updateDb = (objects: any) => {
    if (!socketRef.current) return;

    socketRef.current.emit(
      "update-db",
      { objects },
      (response: any) => {
        console.log("Server Acknowledgement:", response);
      }
    );
  };

  //change layerIndex in db
  const moveUpDb = (id: string) => {

    if (!socketRef.current) return;

    socketRef.current.emit(
      "move-up-db",
      { id },
      (response: any) => {
        console.log("Server Acknowledgement:", response);
      }
    );
  };

  //change layerIndex in db
  const moveDownDb = (id: string) => {
    if (!socketRef.current) return;

    socketRef.current.emit(
      "move-down-db",
      { id },
      (response: any) => {
        console.log("Server Acknowledgement:", response);
      }
    );
  };
  return {
    updateDb,
    moveUpDb,
    moveDownDb,
  };
}
