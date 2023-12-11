import React, { useState } from "react";
import registerUser from "../../../api/authentication/registerUser";
import loginUser from "../../../api/authentication/loginUser";
import { useNavigate } from "react-router-dom";
import Input from "../../../components/Input";
import Button from "../../../components/Button";
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
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          borderRadius: "10px",
          border: "1px solid #ced4da",
          padding: "10px",
        }}
      >
                <h3>Register</h3>

        <Input
          type={"email"}
          placeholder={"Enter email"}
          value={email}
          onChange={handlePasswordChange}
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
      </form>
    </div>
  );
}
