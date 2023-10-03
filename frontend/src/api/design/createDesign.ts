import axios from "axios";
import { apiUrl } from "../../constants";

export default async (name: string, token: string) => {
    try {
      const response = await axios.post("${apiUrl}/design", { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  