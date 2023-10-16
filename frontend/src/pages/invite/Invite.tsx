import React, { ChangeEvent, FormEvent, useState } from "react";

export default function Invite() {
    const [designName, setDesignName] = useState<string>("");


    const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
        console.log("Design Name: " + designName);
        //createDesign(designName, localStorage.getItem("jwt") || "");
      };
    
      const handleDesignNameChange = (event: ChangeEvent<HTMLInputElement>): void => {
        setDesignName(event.target.value);
      };

      
  return (
    <div>
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
    </div>
  );
}
