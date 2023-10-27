import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import getDesignes from "../../api/design/getDesignes";
import { useNavigate } from "react-router-dom";
import createDesign from "../../api/design/createDesign";
import deleteDesign from "../../api/design/deleteDesign";

export default function DesignManager() {
  const [designList, setDesignList] = useState<any[]>();
  const navigate = useNavigate();
  const [designName, setDesignName] = useState<string>("");

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
      setDesignList(response);
      console.log(response);
    } catch (err) {
      console.log(err);
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
    <div style={{ padding: "20px" }}>
      <form onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          type="text"
          placeholder="Design Name"
          onChange={handleDesignNameChange}
          style={{ padding: "10px", marginRight: "10px", fontSize: "16px" }}
        />
        <button type="submit" style={{ padding: "10px", fontSize: "16px" }}>
          Create
        </button>
      </form>
      <div>
        {designList?.map((design) => (
          <div key={design.id} style={{ marginBottom: "15px" }}>
            <h3 style={{ color: "#333" }}>{design.name}</h3>
            <h4>Is owner: {design.isOwner.toString()}</h4>

            <p style={{ color: "#666" }}>{design.id}</p>
            <div style={{display:"flex", flexDirection:"row"}}>
              <button
                onClick={(e: any) => {
                  handleDesignStart(e, design.id);
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
                View
              </button>
              {design.isOwner ? (
                <div>
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      handleDesignInvite(e, design.id);
                    }}
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      color: "#fff",
                      backgroundColor: "blue",
                      border: "none",
                      cursor: "pointer",
                      marginRight: "10px",
                    }}
                  >
                    Invite user
                  </button>
                  <button
                    onClick={(e: any) => {
                      e.preventDefault();
                      handleDesignDelete(design.id);
                    }}
                    style={{
                      padding: "10px",
                      fontSize: "16px",
                      color: "#fff",
                      backgroundColor: "#f44336",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Delete
                  </button>{" "}
                </div>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
