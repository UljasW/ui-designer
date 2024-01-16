

import axios, { AxiosResponse } from "axios";
import { apiUrl } from "../../constants";

export default async ( collaborationId: string, token: string)  => {
    try {
        return await axios.delete(`${apiUrl}/collab/kick/${collaborationId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error : any) {
        console.error(error.response ? error.response.data : error.message);
    }
    
};
