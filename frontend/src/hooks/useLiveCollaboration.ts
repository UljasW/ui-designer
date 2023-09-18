import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useLiveCollaboration(designId: string) {
  const [socket, setSocket] = useState<any>(null);

  useEffect(() => {
    const socketInstance = io("ws://localhost:3001", { query: { designId } });

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
    };
  }, [designId]);

  const saveToDb = (objects: any) => {
    console.log("updateObjList", objects);
    if (!socket) return;
    socket.emit("update-design", { objects });
  };
  return {
    saveToDb,
  };
}
