import http from "@/lib/https";
import { UploadImageResType } from "@/schemaValidations/media.schema";

const mediaAPI = {
    upload: (body: FormData) => http.post<UploadImageResType>('media/upload', body)
}

export default mediaAPI