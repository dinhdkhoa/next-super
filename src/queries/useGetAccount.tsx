import accountAPI from "@/apiRequests/account"
import { useQuery } from "@tanstack/react-query"

const useGetAccount = () => {
  return useQuery({
    queryKey: ["get-account-profile"],
    queryFn: accountAPI.getAccount,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}
export default useGetAccount
