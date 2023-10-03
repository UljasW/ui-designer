import axios from "axios";
import { apiUrl } from "../../constants";

export default async (token: string) => {
  try {

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
