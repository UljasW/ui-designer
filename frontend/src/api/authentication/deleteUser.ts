import axios from "axios";

export default async (token: string) => {
  try {

    const response = await axios.delete("`http://localhost:3001/auth`", {
        headers:{
            "Authorization" : `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
