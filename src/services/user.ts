import {
  UserInfoResponse,
  userListRequest,
  UserListRespose,
  userLoginRequest,
  userLoginResponse,
  UserRegistyRequest,
  UserUpdateRequest,
  UserUpPwdRequest,
} from "@/types/user";
import { del, get, patch, post, put } from "./api";
import { ApiResponse } from "@/types/index";
export function UserLogin(data: userLoginRequest): Promise<userLoginResponse> {
  return post<userLoginResponse>("/api/v1/users/login", data);
}

export function UserInfo(): Promise<UserInfoResponse> {
  return get<UserInfoResponse>("/api/v1/users/info");
}

export function UserLogout(): Promise<ApiResponse> {
  return post<ApiResponse>("/api/v1/users/logout", "");
}

// 获取用户列表
export function UserList(params: userListRequest): Promise<UserListRespose> {
  return get<UserListRespose>("/api/v1/users", params);
}

export function UserRegistry(data: UserRegistyRequest): Promise<unknown> {
  return post<ApiResponse>("/api/v1/users/create", data);
}

export function UserDelete(id: string): Promise<unknown> {
  return del<ApiResponse>(`/api/v1/users/${id}`);
}

export function UserEnable(id: string, password: string): Promise<unknown> {
  return put<ApiResponse>(`/api/v1/users/enable/${id}`, {
    password,
  });
}

export function userQuery(
  id: string,
  query?: string
): Promise<UserInfoResponse> {
  return get<UserInfoResponse>(`/api/v1/users/${id}`, {
    query: query,
  });
}

export function userAddRole(
  id: string,
  roleNames: string[]
): Promise<ApiResponse> {
  return put<ApiResponse>(`/api/v1/users/${id}/roles`, {
    roleNames: roleNames,
  });
}

export function userRemoveRole(
  id: string,
  roleNames: string[]
): Promise<ApiResponse> {
  return post<ApiResponse>(`/api/v1/users/${id}/roles`, {
    roleNames: roleNames,
  });
}

export function userUpdate(data: UserUpdateRequest): Promise<ApiResponse> {
  return put<ApiResponse>(`/api/v1/users`, data);
}

export function userUpdatePassword(
  data: UserUpPwdRequest
): Promise<ApiResponse> {
  return patch<ApiResponse>(`/api/v1/users`, data);
}
