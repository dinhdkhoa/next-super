import envConfig from "@/config"
import { LoginResType } from "@/schemaValidations/auth.schema"
import StorageService from "./storage"
import { RoleType, TokenPayload } from "@/types/jwt.types"
import jwt from 'jsonwebtoken'
import { Role } from "@/constants/type"
import { getCookieValueOnClient } from "./utils"
import { redirect } from "@/i18n/routing"
import { defaultLocale } from "@/i18n/i18n"

type CustomRequest = RequestInit & { baseUrl?: string | undefined }

const FORM_ERROR_STATUS = 422
const UNAUTHORIZED_ERROR_STATUS = 401

type FormErrorPayload = {
    message: string,
    errors: {
        field: string,
        message: string
    }[]
}

export class HttpError extends Error {
    status: number
    payload: {
        message: string,
        [key: string] :any
    }

    constructor({ status, payload }: { status: number, payload: any }) {
        super(payload.message)
        this.status = status
        this.payload = payload
    }
}

export class FormError extends HttpError {
    status: typeof FORM_ERROR_STATUS
    payload: FormErrorPayload

    constructor({ status, payload }: { status: typeof FORM_ERROR_STATUS, payload: FormErrorPayload }) {
        super({ status: FORM_ERROR_STATUS, payload: payload })
        this.status = status
        this.payload = payload
    }
}

class SessionToken {
    private token = ''
    private _expiresAt = ''
    get value() { 
        return this.token
    }
    set value(token: string) {
        if (!isClient) {
            throw new Error('Cannot set token on server side')
        }
        this.token = token
    }

    get expiresAt() {
        return this._expiresAt
    }
    set expiresAt(expireAt: string) {
        // Nếu gọi method này ở server thì sẽ bị lỗi
        if (!isClient) {
            throw new Error('Cannot set _expiresAt on server side')
        }
        this._expiresAt = expireAt
 }

}
/**
 *  chỉ lấy đc ở client, với server 
 * nếu muốn có gắn sessionToken vào header phải lấy từ cookies() - next/headers
 */
export const clientSessionToken = new SessionToken()

const request = async <ResponseType>(method: 'GET' | 'POST' | 'PUT' | 'DELETE', url: string, options?: CustomRequest | undefined) => {
    const body = options?.body ? (isFormData(options.body) ? options.body : JSON.stringify(options.body)) : undefined
    
    const baseHeader : Record<string, any> = isFormData(body) ? {} : {
        'Content-Type': 'application/json',
    }

    if(isClient){
        const accessToken = StorageService.getAccessToken()
        if(accessToken){
            baseHeader.Authorization = `Bearer ${accessToken}`
        }
    }

    const baseURL = options?.baseUrl === undefined ? envConfig.NEXT_PUBLIC_API_ENDPOINT : options.baseUrl
    const fullURL = url.startsWith('/') ? `${baseURL}${url}` : `${baseURL}/${url}`

    const res = await fetch(fullURL, {
        ...options,
        headers: {
            ...baseHeader as any,
            ...options?.headers,
        },
        body,
        method
    })

    const payload: ResponseType = await res.json()

    const data = {
        status: res.status,
        payload
    }
    //interceptors 

    if (!res.ok) {
        if (res.status == FORM_ERROR_STATUS){
            throw new FormError({
                status: 422,
                payload: data.payload as FormErrorPayload
            })
        } else if (res.status == UNAUTHORIZED_ERROR_STATUS) {
            if (isClient) {
                await handleUnthorizedResponseOnClient(baseHeader as any)
            } else {
                const paramRefreshToken = (options?.headers as any)?.Authorization.split('Bearer ').pop() as string
                const { cookies } = await import('next/headers')
                const cookieStore = await cookies();
                const locale = cookieStore.get('NEXT_LOCALE')?.value ?? defaultLocale;
                redirect({
                    href: `/logout?at=${paramRefreshToken}`,
                    locale
                })
            }
        } else {
            throw new HttpError(data)
        }
    }

    if(isClient){
        if (url === 'api/auth/login' || url === 'auth/register' || url === 'api/auth/refresh-token' || url === 'api/guest/auth/refresh-token' || url === 'api/guest/auth/login') {
            StorageService.setAccessToken((payload as LoginResType).data.accessToken)
            StorageService.setRefreshToken((payload as LoginResType).data.refreshToken)
            //  handle auth with cookies
            // clientSessionToken.value = (payload as LoginResType).data.token;
            // clientSessionToken.expiresAt = (payload as LoginResType).data.expiresAt;

        } else if (url === 'api/auth/logout' || url === 'api/guest/auth/logout') {
            StorageService.removeTokens()
            //  handle auth with cookies
            // clientSessionToken.value = '';
            // clientSessionToken.expiresAt = new Date().toUTCString()
        } else if (url === 'api/auth/set-cookies'){
            StorageService.setAccessToken((payload as LoginResType['data']).accessToken)
            StorageService.setRefreshToken((payload as LoginResType['data']).refreshToken)
        }
    }

    return data
}

const isClient = typeof window !== 'undefined'


const isFormData = (body: BodyInit | null | undefined ) => {
    return body && body instanceof FormData
}

const handleUnthorizedResponseOnClient = async (baseHeader: HeadersInit | undefined) : Promise<void | string> => {
   // handle 401 on client
        let role : RoleType | null = null
        const accessToken = StorageService.getAccessToken()
        if(accessToken) role = (jwt.decode(accessToken) as TokenPayload).role
        const logoutURL = (accessToken && role == Role.Guest) ? '/api/guest/auth/logout' : '/api/auth/logout'
        const locale = getCookieValueOnClient('NEXT_LOCALE')

        await fetch(logoutURL, 
            {
                method: 'POST',
                body: null,
                headers: {
                    ...baseHeader
                }
            }
        )
        // clientSessionToken.value = '';
        // clientSessionToken.expiresAt = '';
        location.href = `/${locale}/login?sessionExpired=true`
}

const http = {
    get: <T>(url: string, options?: Omit<CustomRequest, 'body'>) => request<T>('GET', url, { ...options }),
    post: <T>(url: string, body: any, options?: Omit<CustomRequest, 'body'>) => request<T>('POST', url, { ...options, body }),
    put: <T>(url: string, body: any, options?: Omit<CustomRequest, 'body'>) => request<T>('PUT', url, { ...options, body }),
    delete: <T>(url: string, body?: any, options?: Omit<CustomRequest, 'body'>) => request<T>('DELETE', url, { ...options, body })
}
export default http