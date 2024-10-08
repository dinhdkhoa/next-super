import { io } from 'socket.io-client';
import envConfig from "@/config"
import StorageService from './storage';

// "undefined" means the URL will be computed from the `window.location` object

export const socket = io(envConfig.NEXT_PUBLIC_API_ENDPOINT, {
    auth: {
        Authorization: `Bearer ${StorageService.getAccessToken()}`
    }
});