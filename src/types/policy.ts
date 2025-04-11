export interface PolicesListResponse {
  total: number;
  page: number;
  pageSize: number;
  items: PolicyItem[];
}

export interface PolicyItem {
  id: string;
  name: string;
  path: string;
  method: string;
  describe: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface PolicyListRequest {
  page: number;
  pageSize: number;
  keyword?: string;
  value?: string;
}
