import React, { useEffect, useState } from "react";
import getInvitations from "../../api/collaboration/getInvitations";
import acceptInvite from "../../api/collaboration/acceptInvite";

export default function InvitationList() {
  const [invitationList, setInvitationList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    setIsLoading(true);
    const jwt = localStorage.getItem("jwt") || "";
    const data = await getInvitations(jwt);
    console.log(data);
    setInvitationList(data);
    setIsLoading(false);
    
  };

  async function  handleInviteAccept(id: any) {
    await acceptInvite(id, localStorage.getItem("jwt") || "");
    fetchInvitations();
  }

  return (
    <div style={{ padding: "20px" }}>
      {isLoading ? (
        <span style={{ fontSize: "20px", fontWeight: "bold" }}>Loading...</span>
      ) : (
        invitationList.filter((invite: any) => invite.isActive !== false).map((invite: any) => (
          <div
            key={invite.id}
            style={{
              display: "flex",
              flexDirection: "column",
              backgroundColor: "#F3F4F6",
              borderRadius: "12px",
              margin: "10px",
              padding: "15px",
              boxShadow:
                "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            }}
          >
            <h4 style={{ marginBottom: "10px", color: "#4A5568" }}>
              Name: {invite.design.name}
            </h4>
            <span style={{ marginBottom: "5px", color: "#718096" }}>
              Designer: {invite.user.email}
            </span>
            <span style={{ color: "#A0AEC0" }}>Is active: {invite.isActive.toString()}</span>

            <span style={{ color: "#A0AEC0" }}>Id: {invite.id}</span>
            <button
              onClick={(e: any) => {
                handleInviteAccept(invite.id);
              }}
              style={{
                padding: "10px",
                marginRight: "10px",
                fontSize: "16px",
                color: "#fff",
                backgroundColor: "#4CAF50",
                border: "none",
                cursor: "pointer",
              }}
            >
              Accept
            </button>{" "}
          </div>
        ))
      )}
    </div>
  );
}
