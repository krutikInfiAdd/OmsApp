import http from "@/apis/api";
import { BaseDto } from "../company/index.api";
import { BaseResponse, PaginationBaseResponse } from "@/utils/apiBaseResponse";
import { APISURLS } from "@/apis/url";


export const CreateTaxSlabsApi = async (payload: TaxSlabsBaseDto) => {
    const data = payload;
    return http.post<BaseResponse<TaxSlabsType>>(APISURLS.TaxSlabs.Create, data);
};

export const GetTaxSlabsApi = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    isDescending: boolean = true
) => {
    const url = `${APISURLS.TaxSlabs.GetAll}?PageNumber=${pageNumber}&PageSize=${pageSize}&IsDescending=${isDescending}`;
    return http.get<PaginationBaseResponse<TaxSlabsType[]>>(url);
};

export const DeleteTaxSlabsApi = async (id: string) => {
    const url = `${APISURLS.TaxSlabs.Delete}/${id}`;
    return http.delete<BaseResponse<boolean>>(url);
};

export const UpdateTaxSlabsApi = async (id: string, payload: TaxSlabsBaseDto) => {
    const url = `${APISURLS.TaxSlabs.Update}/${id}`;
    return http.put<BaseResponse<TaxSlabsType>>(url, payload);
};


export const TaxSlabsDDLApi = async () => {
    const url = `${APISURLS.TaxSlabs.DDL}`;
    return http.get<BaseResponse<TaxSlabsDropdown[]>>(url);
};


export interface TaxSlabsBaseDto {
    hsnCode: string;
    productType: string;
    description: string;
    cgst?: number | null;
    sgst?: number | null;
    igst?: number | null;
}

export interface TaxSlabsType extends TaxSlabsBaseDto, BaseDto { }

export interface TaxSlabsDropdown {
    id: string;
    code: string;
    name: string;
    description?: string | null;
}