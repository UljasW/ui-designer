import axios from "axios";
import { apiUrl } from "../../constants";

export default async (email: string, password: string) => {
  try {
    const response = await axios.post(`${apiUrl}/auth/register`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw(error);
  }
};
