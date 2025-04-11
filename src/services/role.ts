import {
  RolePolicyRequest,
  RoleItem,
  roleListRequest,
  RoleListResponse,
} from "@/types/role";
import { get, post, put } from "@/services/api";
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
