import axios from "axios";

export default async (email: string, password: string) => {
  try {
    const response = await axios.post("auth/register", {
      email,
      password,
    });
    return response;
  } catch (error) {
    console.log(error);
  }
};
