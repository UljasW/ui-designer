import axios from "axios";
import { apiUrl } from "../../constants";

export default async (email: string, designId: string, token: string) => {
  try {
    const response = await axios.post(`${apiUrl}/collab/invite`, {
      email,
      designId,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
