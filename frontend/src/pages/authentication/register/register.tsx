import React, { useState } from "react";
import registerUser from "../../../api/authentication/registerUser";
import loginUser from "../../../api/authentication/loginUser";
import { useNavigate } from "react-router-dom";
export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleEmailChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log("Email:", email);
    console.log("Password:", password);
    try {
      console.log(await registerUser(email, password));
      
      const response = await loginUser(email, password);
      localStorage.setItem("jwt", response?.data);
      navigate("/home");
    } catch (error) {
      alert(error);
    }
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Email"
          value={email}
          onChange={handleEmailChange}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={handlePasswordChange}
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
}
