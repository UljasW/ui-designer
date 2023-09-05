import React, { useState } from "react";
import loginUser from "../../../api/authentication/loginUser";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (event : any) => {
    setUsername(event.target.value);
  };

  const handlePasswordChange = (event : any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = (event : any) => {
    event.preventDefault(); 
    console.log("Username:", username);
    console.log("Password:", password);
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height : "100vh"
      }}
    >
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          placeholder="Username" 
          value={username}
          onChange={handleUsernameChange}
        />
        <input 
          type="password" 
          placeholder="Password" 
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">LOGIN</button>
      </form>
    </div>
  );
}
