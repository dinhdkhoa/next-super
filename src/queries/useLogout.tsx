import authAPI from "@/apiRequests/auth"
import { useMutation } from "@tanstack/react-query"

const useLogout = () => {
  return useMutation({
    mutationFn: authAPI.logoutClient
  })
}
export default useLogout

