import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import sendInvite from "../../api/collaboration/sendInvite";
import { useSearchParams } from "react-router-dom";
import getCollaborators from "../../api/collaboration/getCollaborators";
import getInvitationsByDesign from "../../api/collaboration/getInvitationsByDesign";
import Button from "../../components/Button";
import Input from "../../components/Input";
export default function Invite() {
  const [email, setEmail] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [collaborators, setCollaborators] = useState<any[]>();
  const [invitations, setInvitations] = useState<any[]>();

  useEffect(() => {
    fetchCollaborators();
    fetchInvitations();
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    sendInvite(
      email,
      searchParams.get("id") || "",
      localStorage.getItem("jwt") || ""
    );
  };

  const fetchCollaborators = async () => {
    try {
      const response = await getCollaborators(
        localStorage.getItem("jwt") || "",
        searchParams.get("id") || ""
      );
      setCollaborators(response);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const fetchInvitations = async () => {
    try {
      const response = await getInvitationsByDesign(
        localStorage.getItem("jwt") || "",
        searchParams.get("id") || ""
      );
      setInvitations(response);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  };

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <form style={{ marginBottom: "20px" }}>
        <Input
          value={email}
          type={"email"}
          placeholder={"Email"}
          onChange={handleEmailChange}
        />

        <Button
          onClick={(e: any) => {
            handleSubmit(e);
          }}
          color="primary"
          content={"Send Invite"}
        />
      </form>

      <div style={{ display: "flex", flexDirection: "row" }}>
        <div
          style={{
            width: "200px",
            backgroundColor: "lightgrey",
            padding: "10px",
            margin: "5px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <h2>Collaborators</h2>
          {collaborators?.map((collaborator) => (
            <div>{collaborator.email}</div>
          ))}
        </div>

        <div
          style={{
            width: "200px",
            backgroundColor: "lightgrey",
            padding: "10px",
            margin: "5px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "flex-start",
          }}
        >
          <h2>Invitations</h2>
          {invitations?.map((invite) => (
            <div
              style={{
                width: "150px",
                backgroundColor: "grey",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              {invite.user.email}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
