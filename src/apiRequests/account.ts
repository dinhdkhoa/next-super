import http from "@/lib/https";
import { AccountListResType, AccountResType, ChangePasswordBodyType, CreateEmployeeAccountBodyType, CreateGuestBodyType, CreateGuestResType, GetGuestListQueryParamsType, GetListGuestsResType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";
import queryString from "query-string";

const accountAPI = {
    getAccount: () => http.get<AccountResType>('accounts/me'),
    updateAccount: (body: UpdateMeBodyType) => http.put<AccountResType>('accounts/me',body),
    changePW: (body: ChangePasswordBodyType) => http.put<AccountResType>('accounts/change-password', body),
    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>('accounts', body),
    addGuest: (body: CreateGuestBodyType) => http.post<CreateGuestResType>('accounts/guests', body),
    getAccountList: () => http.get<AccountListResType>('accounts'),
    getGuestList:  (queryParams: GetGuestListQueryParamsType) => http.get<GetListGuestsResType>('/accounts/guests?' + queryString.stringify({
        fromDate: queryParams.fromDate?.toISOString(),
        toDate: queryParams.toDate?.toISOString()
    })),
    updateEmployee: ({id, ...body} : UpdateEmployeeAccountBodyType & {id: number}) => http.put<AccountResType>(`accounts/detail/${id}`, body),
    getEmployeeDetail: (id: number) => http.get<AccountResType>(`accounts/detail/${id}`),
    deleteEmployeeDetail: (id: number) => http.delete<AccountResType>(`accounts/detail/${id}`)
}


export default accountAPI