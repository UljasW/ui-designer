import axios from "axios";

export default async (token: string) => {
  try {
    const apiUrl = process.env.REACT_APP_API_URL;

    const response = await axios.delete("`${apiUrl}/auth`", {
        headers:{
            "Authorization" : `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
