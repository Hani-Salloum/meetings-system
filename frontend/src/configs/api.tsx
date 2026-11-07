import axios from "axios";

import { env } from "@/env/client";
import { handleError } from "@/utils/error-handler/index";

export const ClientPublic = env.NEXT_PUBLIC_CLIENT_URL;
export const BaseUrl = env.NEXT_PUBLIC_API_URL;
export const ApiBaseUrl = BaseUrl;
export const ImageBaseUrl = `${BaseUrl}/public`;

export const auth = {
  admin: "a_accessToken",
  user_id: 'user_id',
  user_email: 'user_email'
};

export const Client = {
  admin: () => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem(auth.admin);
      return initClient({ token: token || undefined });
    }
    return initClient();
  },
  client: () => initClient(),
  noAuth: axios.create({ baseURL: ApiBaseUrl }),
};

function initClient(props?: { token?: string }) {
  const { token } = props || {};
  const client = axios.create({
    baseURL: ApiBaseUrl,
    // ? this is for the cookie based authentication
    // withCredentials: true,
    headers: {
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
  client.interceptors.response.use(
    (response) => response,
    (error) => {
      handleError(error);
      return Promise.reject(error);
    }
  );
  return client;
}
