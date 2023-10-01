import axios from "axios";


export default async (token: string) => {
    try {
        const response = await axios.get("http://localhost:3001/design", {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        console.log(error);
    }
};
  