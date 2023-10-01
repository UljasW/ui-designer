import axios from "axios";

export default async (name: string, token: string) => {
    try {
      const response = await axios.post("http://localhost:3001/design", { name }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      console.log(error);
    }
  };
  