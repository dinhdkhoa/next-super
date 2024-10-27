import authAPI from "@/apiRequests/auth"
import guestAPI from "@/apiRequests/guest"
import { useAppContext } from "@/components/app-provider"
import { RoleType } from "@/types/jwt.types"
import { useMutation } from "@tanstack/react-query"

const useLogout = (role?: RoleType) => {
  if(role == 'Guest') {
    return useMutation({
      mutationFn: guestAPI.logoutClient
    })
  }
  return useMutation({
    mutationFn: authAPI.logoutClient
  })
}
export default useLogout

