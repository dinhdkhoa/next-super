import http from "@/lib/https";
import { AccountListResType, AccountResType, ChangePasswordBodyType, CreateEmployeeAccountBodyType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const accountAPI = {
    getAccount: () => http.get<AccountResType>('accounts/me'),
    updateAccount: (body: UpdateMeBodyType) => http.put<AccountResType>('accounts/me',body),
    changePW: (body: ChangePasswordBodyType) => http.put<AccountResType>('accounts/change-password', body),
    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>('accounts', body),
    getAccountList: () => http.get<AccountListResType>('accounts'),
    updateEmployee: ({id, ...body} : UpdateEmployeeAccountBodyType & {id: number}) => http.put<AccountResType>(`accounts/detail/${id}`, body),
    getEmployeeDetail: (id: number) => http.get<AccountResType>(`accounts/detail/${id}`),
    deleteEmployeeDetail: (id: number) => http.delete<AccountResType>(`accounts/detail/${id}`)
}


export default accountAPI