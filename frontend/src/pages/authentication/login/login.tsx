import React, { useState } from "react";
import loginUser from "../../../api/authentication/loginUser";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
import { Link } from "react-router-dom";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleUsernameChange = (event: any) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event: any) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    console.log("Username:", email);
    console.log("Password:", password);
    try {
      const response = await loginUser(email, password);
      if (!response || response.status !== 200) {
        return;
      }
      localStorage.setItem("jwt", response?.data);
      navigate("/");
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
        height: "100vh",
      }}
    >
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius:"10px", border: '1px solid #ced4da', padding: "10px"
        }}
      >
        <h3>Login</h3>
        <Input
          type={"email"}
          placeholder={"Enter email"}
          value={email}
          onChange={handleUsernameChange}
        ></Input>


        <Input
          type={"password"}
          placeholder={"Enter password"}
          value={password}
          onChange={handlePasswordChange}
        ></Input>

        <Button
          onClick={function (e: any): void {
            handleSubmit(e);
          }}
          color={"primary"}
          content={"Login"}
        ></Button>

        <Link to="/register">Don't have an account? Register</Link>
      
      </form>
    </div>
  );
}
