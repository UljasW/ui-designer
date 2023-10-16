import React, { ChangeEvent, FormEvent, useState } from "react";
import sendInvite from "../../api/collaboration/sendInvite";
import { useSearchParams } from "react-router-dom";
export default function Invite() {
  const [email, setEmail] = useState<string>("");
  const [searchParams] = useSearchParams();

  const handleSubmit = (event: FormEvent<HTMLFormElement>): void => {
    event.preventDefault();
    sendInvite(
      email,
      searchParams.get("id") || "",
      localStorage.getItem("jwt") || ""
    );
  };

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
    </div>
  );
}

