import Axios, { isAxiosError, type AxiosRequestConfig } from "axios";
import { clearToken, getToken, markSessionExpired } from "@/api/auth.token";

const PATHS_THAT_KEEP_THE_SESSION = [
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/change-password",
];

export const AXIOS_INSTANCE = Axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

AXIOS_INSTANCE.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

AXIOS_INSTANCE.interceptors.response.use(
  (response) => response,
  (error: unknown) => {
    if (isAxiosError(error) && error.response?.status === 401 && getToken()) {
      const url = error.config?.url ?? "";
      const keepsSession = PATHS_THAT_KEEP_THE_SESSION.some((path) =>
        url.includes(path),
      );

      if (!keepsSession) {
        markSessionExpired();
        clearToken();
      }
    }

    return Promise.reject(error);
  },
);

export const customInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  return AXIOS_INSTANCE({ ...config }).then(({ data }) => data);
};
