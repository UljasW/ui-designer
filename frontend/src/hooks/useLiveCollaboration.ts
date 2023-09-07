import { useCallback, useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function useLiveCollaboration(designId: string) {
  const [socket, setSocket] = useState<any>(null);
  const [designStatus, setDesignStatus] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const socketInstance = io("http://localhost:3000", { query: { designId } });

    socketInstance.on("design-updated", (data) => {
      if (data.status === "success") {
        setDesignStatus("Updated successfully!");
      } else {
        setErrorMsg(data.message || "Unknown error");
      }
    });

    socketInstance.on("design-update-error", (data) => {
      setErrorMsg(data.message || "Unknown error");
    });

    setSocket(socketInstance);

    // Cleanup the socket connection on unmount
    return () => {
      socketInstance.disconnect();
    };
  }, [designId]);

  const updateObjList = useCallback(
    (objects: any) => {
      if (!socket) return;
      socket.emit("update-design", { objects });
    },
    [socket]
  );

  return {
    updateObjList,
    designStatus,
    errorMsg,
  };
}
