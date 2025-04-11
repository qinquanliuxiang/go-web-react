import { PolicyItem } from "./policy";

export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  msg?: string;
}

export interface Options {
  label: string;
  value: string;
}

export interface PolicyOptions extends Options {
  rawData: PolicyItem;
}
