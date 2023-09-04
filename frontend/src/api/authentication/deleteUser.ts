import axios from "axios";

export default async (token: string) => {
  try {
    const response = await axios.delete("auth", {
        headers:{
            "Authorization" : `Bearer ${token}`
        }
    });
    return response.data;
  } catch (error) {
    console.log(error);
  }
};
