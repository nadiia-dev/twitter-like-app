import { auth } from "@/firebase/config";
import axios from "axios";

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await getAuthToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

async function getAuthToken() {
  const user = auth.currentUser;
  if (user) {
    return await user.getIdToken(true);
  }
  return null;
}
