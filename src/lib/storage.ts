import { isClient } from "./utils";

const StorageService = {
    getAccessToken: () => (isClient ? localStorage.getItem('accessToken') : null), // use as function bc if it's a value it's gonna be an instance so always return one value
    getRefreshToken: () => (isClient ? localStorage.getItem('refreshToken') : null),
    setAccessToken: (token: string) => { if (isClient) localStorage.setItem('accessToken', token) },
    setRefreshToken: (token: string) => {
        if (isClient) localStorage.setItem('refreshToken', token)
    },
    removeTokens: () => {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
    }
}

export default StorageService