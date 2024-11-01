import http from "@/lib/https";
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";
import queryString from 'query-string';

const indicatorsAPI = {

    getDashboardData:  (queryParams: DashboardIndicatorQueryParamsType) => http.get<DashboardIndicatorResType>('indicators/dashboard/?' + queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
    })),
}

export default indicatorsAPI