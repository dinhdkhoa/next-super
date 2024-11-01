import indicatorsAPI from "@/apiRequests/indicators";
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query";

export const useGetDashboardData = (queryParams : DashboardIndicatorQueryParamsType) => {
    return useQuery({
        queryKey: ['dashboard', queryParams],
        queryFn: () => indicatorsAPI.getDashboardData(queryParams)
    })
}