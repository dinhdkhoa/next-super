import { z } from "zod";

const configSchema = z.object({
    NEXT_PUBLIC_API_ENDPOINT : z.string(),
    NEXT_PUBLIC_URL: z.string(),
})

const config = configSchema.safeParse({
    NEXT_PUBLIC_API_ENDPOINT:process.env.NEXT_PUBLIC_API_ENDPOINT,
    NEXT_PUBLIC_URL: process.env.NEXT_PUBLIC_URL,
})

if(!config.success){
    console.log(config.error.errors)
    throw new Error('Các giá trị env không hợp lệ!!')
}

const envConfig = config.data
export default envConfig