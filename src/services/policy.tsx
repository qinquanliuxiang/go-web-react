import { PolicesListResponse, PolicyListRequest } from "@/types/policy";
import { get } from "./api";

export function GetPolicyList(
  params: PolicyListRequest
): Promise<PolicesListResponse> {
  return get<PolicesListResponse>("/api/v1/polices", params);
}
