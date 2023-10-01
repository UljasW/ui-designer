import axios from "axios";

export default async (email: string, password: string) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL;
    const response = await axios.post(`${apiUrl}/auth/login`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    throw(error)
  }
};
