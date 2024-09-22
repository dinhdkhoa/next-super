import http from "@/lib/https";

const revalidateTag = (tag: string) => http.get(`api/revalidate/?tag=${tag}`, {baseUrl: ''})

export default revalidateTag