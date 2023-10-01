import axios from "axios";

export default async (email: string, password: string) => {
  try {
    const response = await axios.post(`http://localhost:3001/auth/register`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw(error);
  }
};
