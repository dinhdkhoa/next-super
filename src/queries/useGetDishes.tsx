import dishesAPI from "@/apiRequests/dishes"
import { useQuery } from "@tanstack/react-query"

const useGetDishes = () => {
    return useQuery({
        queryKey: ["dishes-list"],
        queryFn: dishesAPI.getDishes
      })
}

export default useGetDishes