import { isClient } from "./utils";

const StorageService = {
    getAccessToken : isClient ? localStorage.getItem('accessToken') : null,
    getRefreshToken : isClient ? localStorage.getItem('refreshToken') : null,
}

export default StorageService