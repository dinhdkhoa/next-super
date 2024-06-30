import accountAPI from "@/apiRequests/account"
import { useQuery } from "@tanstack/react-query"

const useGetAccount = () => {
  return useQuery({
    queryKey: ["account-profile"],
    queryFn: accountAPI.getAccount
  })
}
export default useGetAccount
