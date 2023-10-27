import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import sendInvite from "../../api/collaboration/sendInvite";
import { useSearchParams } from "react-router-dom";
import getCollaborators from "../../api/collaboration/getCollaborators";
export default function Invite() {
  const [email, setEmail] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [collaborators, setCollaborators] = useState<any[]>();

  useEffect(() => {
    fetchCollaborators();
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
      const response = await getCollaborators(localStorage.getItem("jwt") || "", searchParams.get("id") || "");
      setCollaborators(response);
      console.log(response);
    } catch (err) {
      console.log(err);
    }
  }

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="email"
          placeholder="Email"
          onChange={handleEmailChange}
          style={{ padding: "10px", marginRight: "10px", fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "10px", fontSize: "16px" }}>
          Send Invite
        </button>
      </form>

      <div style={{display:"flex", flexDirection:"row"}}>
        <div>
          {collaborators?.map((collaborator) => (<div>{collaborator.email}</div>))}
        </div>
      </div>
    </div>
  );
}

