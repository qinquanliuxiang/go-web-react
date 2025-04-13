import { PolicyItem } from "./policy";

export interface roleListRequest {
  page: number;
  pageSize: number;
  status?: number;
  keyword?: string;
  value?: string;
}

export interface RoleListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: RoleItem[];
}

export interface RoleItem {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  name: string;
  description: string;
  policys: PolicyItem[];
}

export interface RolePolicyRequest {
  policyIds: string[];
}

export interface RoleCreateRequest {
  name: string;
  describe: string;
  policyIds: string[];
}

export interface RoleUpdateRequest {
  describe: string;
}
