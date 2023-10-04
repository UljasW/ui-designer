

import axios, { AxiosResponse } from "axios";
import { apiUrl } from "../../constants";

export default async ( id: string, token: string)  => {
    try {
        return await axios.delete(`${apiUrl}/design/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

    } catch (error : any) {
        console.error(error.response ? error.response.data : error.message);
    }
    
};
