import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import getDesignes from "../../api/design/getDesignes";
import { useNavigate } from "react-router-dom";
import createDesign from "../../api/design/createDesign";

export default function DesignManager() {
  const [designList, setDesignList] = useState<any[]>();
  const navigate = useNavigate();
  const [designName, setDesignName] = useState<string>("");

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    console.log("Design Name: " + designName);
    createDesign(designName, localStorage.getItem("jwt") || "");
  }

  function handleDesignNameChange(event: ChangeEvent<HTMLInputElement>): void {
    setDesignName(event.target.value);
  }

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

  function handleDesignClick(e: any ,id: string): void {
    e.preventDefault();
    navigate("/designer?id=" + id);
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Design Name"
          onChange={handleDesignNameChange}
        />
        <button type="submit">Create</button>
      </form>
      <div>
        {designList?.map((design) => (
          <button onClick={(e:any)=>{
            handleDesignClick(e, design.id);
          }} key={design.id}>
            <h3>{design.name}</h3>
            <p>{design.id}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
