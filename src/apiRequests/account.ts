import http from "@/lib/https";
import { AccountResType } from "@/schemaValidations/account.schema";
import { LoginBodyType, LoginResType } from "@/schemaValidations/auth.schema";

const accountAPI = {
    getAccount: () => http.get<AccountResType>('accounts/me'),
    
}

export default accountAPI