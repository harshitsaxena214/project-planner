import axios from "axios";

export const createApi = (token: string | null) => {
  return axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL,
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  });
};