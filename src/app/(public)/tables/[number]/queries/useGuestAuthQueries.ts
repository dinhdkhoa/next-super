import guestAPI from "@/apiRequests/guest"
import revalidateTag from "@/apiRequests/revalidate"
import tableAPI from "@/apiRequests/table"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"


export const useGuestLoginMutation =  () => {

    return useMutation({
        mutationFn: guestAPI.loginClient,
    
    })
}
