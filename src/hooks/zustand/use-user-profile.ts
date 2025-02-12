import { create } from "zustand"

const useUserProfile = create((set) => ({
  // Initial state
  profile: null as any, // Initialize with null or a default profile object

  // Actions to modify the state
  setProfile: (profile: any) => set(() => ({ profile })),
  reset: () => set({ profile: null }) // Reset the profile to null
}))

export default useUserProfile
