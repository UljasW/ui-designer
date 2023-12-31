import axios from "axios";
import { apiUrl } from "../../constants";

export default async (email: string, designId: string, token: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/collab/invite`,
      {
        email: email,
        designId: designId
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    alert("Invite sent!");

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
