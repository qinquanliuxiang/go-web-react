import {
  RolePolicyRequest,
  RoleItem,
  roleListRequest,
  RoleListResponse,
  RoleCreateRequest,
  RoleUpdateRequest,
} from "@/types/role";
import { del, get, post, put } from "@/services/api";
import { ApiResponse } from "@/types";

export function RoleList(params: roleListRequest): Promise<RoleListResponse> {
  return get<RoleListResponse>("/api/v1/roles", params);
}

export function RoleQuery(id: string): Promise<RoleItem> {
  return get<RoleItem>(`/api/v1/roles/${id}`);
}

export function RoleRemovePolices(
  id: string,
  ids: RolePolicyRequest
): Promise<ApiResponse> {
  return post<ApiResponse>(`/api/v1/roles/${id}/polices`, ids);
}

export function RoleAddPolices(
  id: string,
  ids: RolePolicyRequest
): Promise<ApiResponse> {
  return put<ApiResponse>(`/api/v1/roles/${id}/polices`, ids);
}

export function RoleAdd(data: RoleCreateRequest): Promise<ApiResponse> {
  return post<ApiResponse>("/api/v1/roles", data);
}

export function RoleDelete(id: string): Promise<ApiResponse> {
  return del<ApiResponse>(`/api/v1/roles/${id}`);
}

export function UpdateRole(
  id: string,
  data: RoleUpdateRequest
): Promise<ApiResponse> {
  return put<ApiResponse>(`/api/v1/roles/${id}`, data);
}
