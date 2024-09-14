import http from "@/lib/https";
import { AccountListResType, AccountResType, ChangePasswordBodyType, CreateEmployeeAccountBodyType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import { CreateTableBodyType, TableListResType, TableResType, UpdateTableBodyType } from "@/schemaValidations/table.schema";

const tableAPI = {
    getTables: () => http.get<TableListResType>('tables'),
    getTableDetail: (id: number) => http.get<TableResType>(`tables/${id}`),
    updateTable: ({id, ...body}: UpdateTableBodyType) => http.put<TableResType>(`tables/${id}`,body),
    deleteTable: (id: number) => http.delete<TableResType>(`tables/${id}`),
    addTable: (body: CreateTableBodyType) => http.post<TableResType>(`tables`, body),
}


export default tableAPI