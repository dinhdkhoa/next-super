import authAPI from "@/apiRequests/auth"
import guestAPI from "@/apiRequests/guest"
import { useMutation } from "@tanstack/react-query"

const useLogout = () => {
  return useMutation({
    mutationFn: authAPI.logoutClient
  })
}

export const useLogoutGuest = () => {
  return useMutation({
    mutationFn: guestAPI.logoutClient
  })
}

export default useLogout

