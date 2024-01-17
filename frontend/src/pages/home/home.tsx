import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import getDesignes from "../../api/design/getDesignes";
import { useNavigate } from "react-router-dom";
import createDesign from "../../api/design/createDesign";
import deleteDesign from "../../api/design/deleteDesign";
import Button from "../../components/Button";
import Input from "../../components/Input";
import TopBar from "../../components/TopBar";
import notificationIcon from "../../images/icons8-bell-48.png";
import MyInvites from "../../features/myInvites/MyInvites";
import getInvitations from "../../api/collaboration/getInvitations";

export default function Home() {
  const [designList, setDesignList] = useState<any[]>();
  const navigate = useNavigate();
  const [designName, setDesignName] = useState<string>("");
  const [showInvite, setShowInvite] = useState<boolean>(false);
  const [invites, setInvites] = useState<any[]>([]);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    console.log("Design Name: " + designName);
    createDesign(designName, localStorage.getItem("jwt") || "");
  };

  const handleDesignNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setDesignName(event.target.value);
  };
  const fetchDesignes = async () => {
    try {
      const response = await getDesignes(localStorage.getItem("jwt") || "");
      console.log(response);

      setDesignList(response);
      console.log(response);
    } catch (err) {
      console.log(err);
      navigate("/login");
    }
  };
  const fetchInvites = async () => {
    const data = await getInvitations(localStorage.getItem("jwt") || "");
    setInvites(data);
  };

  useEffect(() => {
    console.log("Design Manager Mounted");
    fetchDesignes();
    fetchInvites();
    return () => {
      console.log("Design Manager Unmounted");
    };
  }, []);

  const handleDesignStart = (e: any, id: string): void => {
    e.preventDefault();
    navigate("/designer?id=" + id);
  };

  const handleDesignInvite = (e: any, id: string): void => {
    e.preventDefault();
    navigate("/invite?id=" + id);
  };

  const handleDesignDelete = async (id: string) => {
    await deleteDesign(id, localStorage.getItem("jwt") || "");
    fetchDesignes();
  };

  return (
    <div style={{ width: "100vw" }}>
      <TopBar height="auto">
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          {" "}
          <form
            style={{
              marginBottom: "20px",
              display: "flex",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Input
              value={designName}
              type={"Text"}
              placeholder={"Design Name"}
              height="20px"
              width="100px"
              onChange={handleDesignNameChange}
            />

            <Button
              onClick={(e: any) => {
                handleSubmit(e);
              }}
              color="primary"
              height="40px"
              content={"Create"}
            />
          </form>
          <div
            style={{ height: "100%", display: "flex", alignItems: "center"}}
          >
            {invites.length > 0 ? (
              <span style={{ marginRight: "10px", fontWeight:"bold" }}>New invite</span>
            ) : (
              <span style={{ marginRight: "10px" }} className="inviteText">
                My Invities
              </span>
            )}

            <img
              src={notificationIcon}
              alt="Notification Icon"
              onClick={(e: any) => {
                setShowInvite(!showInvite);
              }}
              style={{ cursor: "pointer",borderRadius:"10px", backgroundColor:invites.length > 0 ? "green":""  }}
              height="40px"
            ></img>
          </div>
          <MyInvites show={showInvite} invites={invites} />
        </div>
      </TopBar>
      <div style={{ padding: "20px" }}>
        <div
          style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}
          className="designListContainer"
        >
          {designList?.map((design) => (
            <div
              key={design.id}
              style={{
                borderRadius: "10px",
                border: "1px solid #ced4da",
                padding: "10px",
              }}
            >
              <div style={{ width: "280px" }}>
                <h3 style={{ color: "#333" }}>{design.name}</h3>
                <h4>Is owner: {design.isOwner.toString()}</h4>

                <div style={{ display: "flex", flexDirection: "row" }}>
                  <Button
                    onClick={(e: any) => {
                      handleDesignStart(e, design.id);
                    }}
                    color="primary"
                    height="35px"
                    padding="5px 10px"
                    width="max-content"
                    content={"View/Edit"}
                  />

                  {design.isOwner && (
                    <>
                      <Button
                        onClick={(e: any) => {
                          handleDesignInvite(e, design.id);
                        }}
                        color="secondary"
                        height="35px"
                        padding="5px 10px"
                        width="max-content"
                        content={"Invite user"}
                      />
                      <Button
                        onClick={(e: any) => {
                          handleDesignDelete(design.id);
                        }}
                        height="35px"
                        padding="5px 10px"
                        width="max-content"
                        color="delete"
                        content={"Delete"}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
