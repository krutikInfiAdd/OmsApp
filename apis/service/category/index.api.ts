import http from "@/apis/api";
import { APISURLS } from "@/apis/url";
import { BaseResponse, PaginationBaseResponse } from "@/utils/apiBaseResponse";
import { BaseDto } from "../company/index.api";

export const CreateCategoriesApi = async (payload: CategoriesBaseDto) => {
    const data = payload;
    return http.post<BaseResponse<CategoriesType>>(APISURLS.Categories.Create, data);
};

export const GetCategoriesApi = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    isDescending: boolean = true
) => {
    const url = `${APISURLS.Categories.GetAll}?PageNumber=${pageNumber}&PageSize=${pageSize}&IsDescending=${isDescending}`;
    return http.get<PaginationBaseResponse<CategoriesType[]>>(url);
};

export const DeleteCategoriesApi = async (id: string) => {
    const url = `${APISURLS.Categories.Delete}/${id}`;
    return http.delete<BaseResponse<boolean>>(url);
};

export const UpdateCategoriesApi = async (id: string, payload: CategoriesBaseDto) => {
    const url = `${APISURLS.Categories.Update}/${id}`;
    return http.put<BaseResponse<CategoriesType>>(url, payload);
};


export const CategoriesDDLApi = async () => {
    const url = `${APISURLS.Categories.DDL}`;
    return http.get<BaseResponse<CategoryDropdown[]>>(url);
};


export interface CategoriesBaseDto {
    code: string;
    name: string;
    description?: string | null;
}

export interface CategoriesType extends CategoriesBaseDto, BaseDto { }

export interface CategoryDropdown {
    id: string;
    code: string;
    name: string;
    description?: string | null;
}