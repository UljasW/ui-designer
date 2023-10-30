import axios from "axios";
import { apiUrl } from "../../constants";


export default async (token: string, designId:string) => {
    try {
        const response = await axios.get(`${apiUrl}/collab/collaborators/${designId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            }
        });
        
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
  