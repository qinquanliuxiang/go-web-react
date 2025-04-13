// src/stores/userStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserInfo } from "@/services/user";
import type { UserInfoResponse } from "@/types/user";

type UserState = {
  userData?: UserInfoResponse;
  loading: boolean;
  error?: Error | null;
  fetchUser: () => Promise<void>;
  clearUser: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      userData: undefined,
      loading: false,
      error: null,

      fetchUser: async () => {
        // 取消重复请求
        if (get().loading) return;

        set({ loading: true, error: null });

        try {
          const data = await UserInfo();
          set({ userData: data, loading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error : new Error(String(error)),
            loading: false,
          });
        }
      },

      clearUser: () => {
        localStorage.removeItem("token");
        set({ userData: undefined, error: null });
      },
    }),
    {
      name: "user-storage",
      partialize: (state) => ({ userData: state.userData }),
      // 添加版本控制
      version: 1,
      migrate: (persistedState, version) => {
        if (version === 0) {
          // 处理旧版本数据结构迁移
          return persistedState;
        }
        return persistedState;
      },
    }
  )
);
