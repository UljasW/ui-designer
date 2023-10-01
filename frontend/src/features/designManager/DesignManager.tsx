import React, { ChangeEvent, FormEvent, useEffect, useState } from "react";
import getDesignes from "../../api/design/getDesignes";
import { useNavigate } from "react-router-dom";

export default function DesignManager() {
  const [designList, setDesignList] = useState<any[]>();
  const navigate = useNavigate();

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    throw new Error("Function not implemented.");
  }

  function handleDesignNameChange(event: ChangeEvent<HTMLInputElement>): void {
    throw new Error("Function not implemented.");
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

  function handleDesignClick(e: any): void {
    e.preventDefault();
    navigate("/designer/?id=" + e.target.value);
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
          <button onClick={handleDesignClick} key={design.designId}>
            <h3>{design.designName}</h3>
            <p>{design.designId}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
