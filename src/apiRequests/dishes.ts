import http from "@/lib/https";
import { AccountListResType, AccountResType, ChangePasswordBodyType, CreateEmployeeAccountBodyType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import { CreateDishBodyType, DishListResType, DishResType, UpdateDishBodyType } from "@/schemaValidations/dish.schema";

const dishesAPI = {
    getDishes: () => http.get<DishListResType>('dishes', { next: { tags: ['tables-list'] } }),
    getDishDetail: (id: number) => http.get<DishResType>(`dishes/${id}`),
    updateDish: ({id, ...body}: UpdateDishBodyType & {id: number}) => http.put<DishResType>(`dishes/${id}`,body),
    deleteDish: (id: number) => http.delete<DishResType>(`dishes/${id}`),
    addDish: (body: CreateDishBodyType) => http.post<DishResType>(`dishes`, body),
}


export default dishesAPI