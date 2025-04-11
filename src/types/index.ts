export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  msg?: string;
}

export interface options {
  label: string;
  value: string;
}
