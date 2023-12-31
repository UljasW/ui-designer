import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import getDesignes from "../../api/design/getDesignes";
import { useNavigate } from "react-router-dom";
import createDesign from "../../api/design/createDesign";
import deleteDesign from "../../api/design/deleteDesign";
import Button from "../../components/Button";
import Input from "../../components/Input";
import MyInvites from "../myInvites/MyInvites";
import TopBar from "../../components/TopBar";
import notificationIcon from "../../images/icons8-bell-48.png";

export default function DesignManager() {
  const [designList, setDesignList] = useState<any[]>();
  const navigate = useNavigate();
  const [designName, setDesignName] = useState<string>("");
  const [showInvite, setShowInvite] = useState<boolean>(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    console.log("Design Name: " + designName);
    createDesign(designName, localStorage.getItem("jwt") || "");
  };

  const handleDesignNameChange = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    setDesignName(event.target.value);
  };

  useEffect(() => {
    console.log("Design Manager Mounted");
    fetchDesignes();
    return () => {
      console.log("Design Manager Unmounted");
    };
  }, []);

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
    <div style={{ width: "100%" }}>
      <TopBar height="auto">
        <div
          style={{
            width: "100%",
            display: "flex",
            paddingLeft: "20px",
            paddingRight: "20px",
            justifyContent: "space-between",
          }}
        >
          {" "}
          <form style={{ marginBottom: "20px", display:"flex", height:"100%", justifyContent:"center", alignItems:"center" }}>
            <Input
              value={designName}
              type={"Text"}
              placeholder={"Design Name"}
              height="20px"
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
          <div style={{height:"100%", display:"flex", alignItems:"center"}}>
            <span style={{marginRight:"10px"}}>My Invites</span>
          <img
            src={notificationIcon}
            onClick={(e: any) => {
              setShowInvite(!showInvite);
            }}
            style={{ cursor: "pointer"}}

            height="40px"
          ></img>

          </div>
          
          <MyInvites show={showInvite} />
        </div>
      </TopBar>
      <div style={{ padding: "20px", width: "100%" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
          {designList?.map((design) => (
            <div
              key={design.id}
              style={{
                borderRadius: "10px",
                border: "1px solid #ced4da",
                padding: "10px",
              }}
            >
              <h3 style={{ color: "#333" }}>{design.name}</h3>
              <h4>Is owner: {design.isOwner.toString()}</h4>

              <p style={{ color: "#666" }}>{design.id}</p>
              <div style={{ display: "flex", flexDirection: "row" }}>
                <Button
                  onClick={(e: any) => {
                    handleDesignStart(e, design.id);
                  }}
                  color="primary"
                  content={"View/Edit"}
                />

                {design.isOwner ? (
                  <div>
                    <Button
                      onClick={(e: any) => {
                        handleDesignInvite(e, design.id);
                      }}
                      color="secondary"
                      content={"Invite user"}
                    />
                    <Button
                      onClick={(e: any) => {
                        handleDesignDelete(design.id);
                      }}
                      color="delete"
                      content={"Delete"}
                    />
                  </div>
                ) : (
                  <div></div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
