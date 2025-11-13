import http from "@/apis/api";
import { BaseDto } from "../company/index.api";
import { BaseResponse, PaginationBaseResponse } from "@/utils/apiBaseResponse";
import { APISURLS } from "@/apis/url";


export const CreateSubCategoriesApi = async (payload: SubCategoriesBaseDto) => {
    const data = payload;
    return http.post<BaseResponse<SubCategoriesType>>(APISURLS.SubCategories.Create, data);
};

export const GetSubCategoriesApi = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    isDescending: boolean = true
) => {
    const url = `${APISURLS.SubCategories.GetAll}?PageNumber=${pageNumber}&PageSize=${pageSize}&IsDescending=${isDescending}`;
    return http.get<PaginationBaseResponse<SubCategoriesType[]>>(url);
};

export const DeleteSubCategoriesApi = async (id: string) => {
    const url = `${APISURLS.SubCategories.Delete}/${id}`;
    return http.delete<BaseResponse<boolean>>(url);
};

export const UpdateSubCategoriesApi = async (id: string, payload: SubCategoriesBaseDto) => {
    const url = `${APISURLS.SubCategories.Update}/${id}`;
    return http.put<BaseResponse<SubCategoriesType>>(url, payload);
};


export const SubCategoriesDDLApi = async () => {
    const url = `${APISURLS.SubCategories.DDL}`;
    return http.get<BaseResponse<SubCategoryDropdown[]>>(url);
};


export interface SubCategoriesBaseDto {
    categoryId: string;         // Guid → string
    code: string;
    name: string;
    description?: string | null;
}

export interface SubCategoriesType extends SubCategoriesBaseDto, BaseDto { }

export interface SubCategoryDropdown {
    id: string;
    code: string;
    name: string;
    description?: string | null;
}