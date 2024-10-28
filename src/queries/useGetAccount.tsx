import accountAPI from "@/apiRequests/account"
import { GetGuestListQueryParamsType } from "@/schemaValidations/account.schema"
import { useQuery } from "@tanstack/react-query"

const useGetAccount = () => {
  return useQuery({
    queryKey: ["get-account-profile"],
    queryFn: accountAPI.getAccount,
    staleTime: Infinity,
    gcTime: Infinity,
  })
}

export const useGetGuestList = (queryParams : GetGuestListQueryParamsType) => {
    return useQuery({
        queryKey: ['guest-list', queryParams],
        queryFn: () => accountAPI.getGuestList(queryParams)
    })
}

export default useGetAccount
