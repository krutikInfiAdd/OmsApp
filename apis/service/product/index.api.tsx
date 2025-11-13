import http from "@/apis/api";
import { BaseDto } from "../company/index.api";
import { BaseResponse, PaginationBaseResponse } from "@/utils/apiBaseResponse";
import { APISURLS } from "@/apis/url";


export const CreateSubCategoriesApi = async (payload: ProductBaseDto) => {
    const data = payload;
    return http.post<BaseResponse<ProductType>>(APISURLS.Categories.Create, data);
};

export const GetSubCategoriesApi = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    isDescending: boolean = true
) => {
    const url = `${APISURLS.Products.GetAll}?PageNumber=${pageNumber}&PageSize=${pageSize}&IsDescending=${isDescending}`;
    return http.get<PaginationBaseResponse<ProductType[]>>(url);
};

export const DeleteSubCategoriesApi = async (id: string) => {
    const url = `${APISURLS.Products.Delete}/${id}`;
    return http.delete<BaseResponse<boolean>>(url);
};

export const UpdateSubCategoriesApi = async (id: string, payload: ProductBaseDto) => {
    const url = `${APISURLS.Products.Update}/${id}`;
    return http.put<BaseResponse<ProductType>>(url, payload);
};


export const SubCategoriesDDLApi = async () => {
    const url = `${APISURLS.Products.DDL}`;
    return http.get<BaseResponse<ProductDropdown[]>>(url);
};


export interface ProductBaseDto {
    subCategoryId?: string | null;  // Guid? → optional string
    name: string;
    description?: string | null;
    unitPrice: number;              // decimal → number
    taxSlabId?: string | null;      // Guid? → optional string
    isTaxable?: boolean | null;     // bool? → boolean | null
}

export interface ProductType extends ProductBaseDto, BaseDto { }

export interface ProductDropdown {
    id: string;
    code: string;
    name: string;
    description?: string | null;
}