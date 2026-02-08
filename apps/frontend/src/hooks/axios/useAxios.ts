import { useRouter } from "next/navigation";

import { useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { INVALID_ACCESS_TOKEN, queryKeys } from "@/lib/constants";
import { IUser } from "@/shared/types";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

const useAxios = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const api = axiosInstance;

  let isRefreshing = false;
  let refreshSubscribers: ((token: string) => void)[] = [];

  const addSubscriber = (callback: (token: string) => void) => {
    refreshSubscribers.push(callback);
  };

  const notifySubscribers = (newToken: string) => {
    refreshSubscribers.forEach((callback) => callback(newToken));
    refreshSubscribers = [];
  };

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        error.response.data.errorCode === INVALID_ACCESS_TOKEN
      ) {
        if (isRefreshing) {
          return new Promise((resolve) => {
            addSubscriber((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            });
          });
        }

        isRefreshing = true;
        try {
          const { data } = await api.get("/auth/refresh-token");
          const newAccessToken = data.accessToken;

          queryClient.setQueryData<IUser>([queryKeys.USERS], (oldData) => {
            if (!oldData) return oldData;
            return { ...oldData, accessToken: newAccessToken };
          });

          notifySubscribers(newAccessToken);
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return api(originalRequest);
        } catch (refreshError) {
          toast.info("Session expired, please log in again.");
          queryClient.setQueryData([queryKeys.USERS], null);
          router.push("/");
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );

  return api;
};

export default useAxios;
