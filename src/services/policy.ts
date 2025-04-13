import {
  PolicesListResponse,
  PolicyCreateRequest,
  PolicyListRequest,
  PolicyUpdateRequest,
} from "@/types/policy";
import { del, get, post, put } from "./api";
import { ApiResponse } from "@/types";

export function GetPolicyList(
  params: PolicyListRequest
): Promise<PolicesListResponse> {
  return get<PolicesListResponse>("/api/v1/polices", params);
}

export function CreatePolicy(data: PolicyCreateRequest): Promise<ApiResponse> {
  return post<ApiResponse>(`/api/v1/polices`, data);
}

export function DeletePolicy(id: string): Promise<ApiResponse> {
  return del<ApiResponse>(`/api/v1/polices/${id}`);
}

export function UpdatePolicy(
  id: string,
  data: PolicyUpdateRequest
): Promise<ApiResponse> {
  return put<ApiResponse>(`/api/v1/polices/${id}`, data);
}
