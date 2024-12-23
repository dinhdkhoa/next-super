
import { create } from "zustand";
import { RoleType, TokenPayload } from "@/types/jwt.types"
import { createJSONStorage, persist } from 'zustand/middleware';
import createSelectors from "@/lib/createSelectors"

type AuthState = {
    isLoggedIn: boolean,
    role?: RoleType,
  }
  
  const initAuthState: AuthState = {
    isLoggedIn: false,
    role: undefined,
  }
  
  type AuthAction = {
    setRole: (role?: RoleType) => void
  }
  
export const useAuthStoreBase = create(
    persist<AuthState & AuthAction>(
      (set, get) => ({
        ...initAuthState,
        setRole: (role?: RoleType) => {
          set({ isLoggedIn: Boolean(role), role });
        }
      }),
      {
        name: 'userRole',
        storage: createJSONStorage(() => localStorage)
      }
    )
  );

  export default createSelectors(useAuthStoreBase)