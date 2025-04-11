// services/api.ts
import { ApiResponse } from "@/types";
import axios, { AxiosError } from "axios";
const viteEnv = import.meta.env.VITE_ENV || "dev";
let host = "";

switch (viteEnv) {
  case "dev":
    host = "http://127.0.0.1:8080";
    break;
  case "pro": {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    const prot = window.location.port;
    host = `${protocol}//${hostname}:${prot}/`;
    break;
  }
}
console.log("host", host);

const apiClient = axios.create({
  baseURL: host,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// 请求拦截器：添加 token 等
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    // res ApiResponse 类型
    const res = response.data;
    if (res.code === 0) {
      // 后端 res 中的 data
      return res.data;
    } else {
      return Promise.reject(new Error(res.msg || "请求失败"));
    }
  },
  (error: AxiosError) => {
    // 新增 401 状态码处理
    if (error?.response?.status === 401) {
      localStorage.removeItem("token");
    }
    // 处理后端返回非业务错误
    const apiRes = error.response?.data as ApiResponse;
    const msg = apiRes?.msg || "接口异常";
    return Promise.reject(new Error(msg));
  }
);

// 封装 GET 请求
export const get = <T>(url: string, params?: unknown): Promise<T> => {
  return apiClient.get(url, { params });
};

// 封装 POST 请求
export const post = <T>(url: string, data: unknown): Promise<T> => {
  return apiClient.post(url, data);
};

// 封装 PUT 请求
export const put = <T>(url: string, data: unknown): Promise<T> => {
  return apiClient.put(url, data);
};

// 封装 DELETE 请求
export const del = <T>(url: string): Promise<T> => {
  return apiClient.delete(url);
};
