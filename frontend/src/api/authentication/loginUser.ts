import axios from "axios";

export default async (email: string, password: string) => {
  try {
    const response = await axios.post("auth/login", {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
