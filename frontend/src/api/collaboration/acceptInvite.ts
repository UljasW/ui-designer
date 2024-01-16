import axios from "axios";
import { apiUrl } from "../../constants";

export default async (invitationId: string, token: string) => {
  try {
    const response = await axios.post(
      `${apiUrl}/collab/accept-invitation`,
      {
        invitationId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.log(error);
  }
};
