import React, { useEffect, useState } from "react";
import getInvitations from "../../api/collaboration/getInvitations";
import Button from "../../components/Button";
import acceptInvite from "../../api/collaboration/acceptInvite";
interface Props {
  show: boolean;
  invites: any[];
}

export default function MyInvites({ show, invites }: Props) {

  

  const accept = async (id: string) => {
    await acceptInvite(id, localStorage.getItem("jwt") || "");
    window.location.reload();
  };

  return (
    <div
      style={{
        position: "absolute",
        top: "100px",
        right: "10px",
      }}
    >
      {show ? (
        <div
          style={{
            maxWidth: "300px",
            backgroundColor: "#ffffff",
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            borderRadius: "0.375rem",
            padding: "1rem",
          }}
        >
          <h2
            style={{
              fontSize: "1.25rem",
              fontWeight: "600",
              marginBottom: "0.5rem",
            }}
          >
            My Invites
          </h2>
          {invites.length > 0 ? (
            <ul style={{ listStyle: "none", paddingLeft: "20" }}>
              {invites.map((invite, index) => (
                <div>
                  <li
                    key={index}
                    style={{
                      borderBottom: "1px solid #e2e8f0",
                      paddingBottom: "0.25rem",
                      marginBottom: "0.25rem",
                    }}
                  >
                    <p style={{ marginBottom: "0.25rem" }}>
                      {invite.design.name}
                    </p>
                    <small style={{ color: "#4a5568" }}>
                      {invite.design.designer.email}
                    </small>
                  </li>
                  <Button
                    onClick={function (e: any): void {
                      accept(invite.id);

                      
                    }}
                    color={"primary"}
                    content={"Accept"}
                  ></Button>
                </div>
              ))}
            </ul>
          ) : (
            <p>No invites at the moment.</p>
          )}
        </div>
      ) : (
        <div></div>
      )}
    </div>
  );
}
