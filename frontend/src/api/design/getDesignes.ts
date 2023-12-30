import axios from "axios";
import { apiUrl } from "../../constants";


export default async (token: string) => {
    const response = await axios.get(`${apiUrl}/design`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
    return response.data;
};
  