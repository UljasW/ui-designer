import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import sendInvite from "../../api/collaboration/sendInvite";
import { useNavigate, useSearchParams } from "react-router-dom";
import getCollaborators from "../../api/collaboration/getCollaborators";
import getInvitationsByDesign from "../../api/collaboration/getInvitationsByDesign";
import Button from "../../components/Button";
import Input from "../../components/Input";
import TopBar from "../../components/TopBar";
export default function Invite() {
  const [email, setEmail] = useState<string>("");
  const [searchParams] = useSearchParams();
  const [collaborators, setCollaborators] = useState<any[]>();
  const [invitations, setInvitations] = useState<any[]>();
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await sendInvite(
      email,
      searchParams.get("id") || "",
      localStorage.getItem("jwt") || ""
    );
    fetchInvitations();
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
  useEffect(() => {
    fetchCollaborators();
    fetchInvitations();
  }, []);

  const handleEmailChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setEmail(event.target.value);
  };

  return (
    <div>
      <TopBar>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div>
            <Input
              value={email}
              type={"email"}
              width="100px"
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
          </div>

          <Button
            onClick={function (e: any): void {
              navigate("/");
            }}
            color={"primary"}
            content={"Home"}
          ></Button>
        </div>
      </TopBar>

      <div
        className="inviteAndCollabContainer"
      >
        <div
          style={{
            width: "100%",
            maxWidth: "300px",
            padding: "10px",
            margin: "5px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <h2>Collaborators</h2>
          {collaborators?.map((collaborator) => (
            <div
              style={{
                border: "1px solid black",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              {collaborator.email}
            </div>
          ))}
        </div>

        <div
          style={{
            width: "100%",
            maxWidth: "300px",

            padding: "10px",
            margin: "5px",
            borderRadius: "10px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-start",
          }}
        >
          <h2>Invitations</h2>
          {invitations?.map((invite) => (
            <div
              style={{
                border: "1px solid black",
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
