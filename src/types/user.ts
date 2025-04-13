export interface userLoginRequest {
  email: string;
  password: string;
}

export interface userLoginResponse {
  token: string;
}

export interface UserInfoResponse {
  id: string;
  name: string;
  email: string;
  nickName: string;
  avatar: string;
  roleName: string[];
}

export interface userListRequest {
  page: number;
  pageSize: number;
  status?: number;
  keyword?: string;
  value?: string;
}

export interface UserListRespose {
  total: number;
  page: number;
  pageSize: number;
  items: UserListResponseItem[];
}

export interface UserListResponseItem {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  name: string;
  nickName: string;
  avatar: string;
  email: string;
  mobile: string;
  status: number;
}

export interface UserRegistyRequest {
  name: string;
  password: string;
  avatar: string;
  email: string;
  nickName: string;
  mobile: string;
}

export interface UserInfoResponse {
  id: string;
  createdAt: number;
  updatedAt: number;
  deletedAt: number;
  name: string;
  nickName: string;
  avatar: string;
  email: string;
  mobile: string;
  status: number;
  roles: Role[];
}

export interface Role {
  id: string;
  created_at: number;
  updatedAt: number;
  deletedAt: number;
  name: string;
  description: string;
}
export interface UserUpdateRequest {
  avatar: string;
  mobile: string;
  nickName: string;
}

export interface UserUpPwdRequest {
  oldPassword: string;
  newPassword: string;
}
