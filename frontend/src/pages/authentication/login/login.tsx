import React, { useState } from "react";
import loginUser from "../../../api/authentication/loginUser";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();


  const handleUsernameChange = (event : any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event : any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event : any) => {
    event.preventDefault(); 
    console.log("Username:", email);
    console.log("Password:", password);
    try {
      const response = await loginUser(email, password);
      if(!response || response.status !== 200){
        return;
      }
      localStorage.setItem("jwt", response?.data);
      navigate("/home")
    } catch (error) {
      alert("An error occurred while logging in. Please try again.");
      console.error(error);
    }
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
          placeholder="Email" 
          value={email}
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
