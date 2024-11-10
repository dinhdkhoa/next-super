import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT : z.string(),
    NEXT_PUBLIC_URL: z.string(),
    NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: z.string(),
    NEXT_PUBLIC_GOOGLE_CLIENT_ID: z.string(),
})

const config = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT:process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
    NEXT_PUBLIC_GOOGLE_CLIENT_ID:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI: process.env.NEXT_PUBLIC_GOOGLE_AUTHORIZED_REDIRECT_URI,
})

if(!config.success){
    throw new Error('Các giá trị env không hợp lệ!!')
}

const envConfig = config.data
export default envConfig