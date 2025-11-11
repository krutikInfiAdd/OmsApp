import http from "@/apis/api";
import { APISURLS } from "@/apis/url";
import { BaseResponse, PaginationBaseResponse } from "@/utils/apiBaseResponse";
import { BaseDto } from "../company";

export interface SupplierBaseDto {
    code: string;
    name: string;

    contactPerson?: string | null;
    email?: string | null;
    phone?: string | null;

    gstin?: string | null;
    pan?: string | null;

    addressLine1: string;
    addressLine2?: string | null;
    city?: string | null;
    state?: string | null;
    country?: string | null;
    pinCode?: string | null;

    gstType?: string | null;
    creditLimit?: number | null;   // decimal → number
    paymentTerms?: string | null;

    bankName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
}

export interface SupplierType extends SupplierBaseDto, BaseDto { }

export const CreateSupplierApi = async (payload: SupplierBaseDto) => {
    const data = payload;
    return http.post<BaseResponse<SupplierType>>(APISURLS.Supplier.Create, data);
};

export const GetSupplierApi = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    isDescending: boolean = true
) => {
    const url = `${APISURLS.Supplier.GetAll}?PageNumber=${pageNumber}&PageSize=${pageSize}&IsDescending=${isDescending}`;
    return http.get<PaginationBaseResponse<SupplierType[]>>(url);
};

export const UpdateSupplierApi = async (id: string, payload: SupplierBaseDto) => {
    const url = `${APISURLS.Supplier.Update}/${id}`;
    return http.put<BaseResponse<SupplierType>>(url, payload);
};

export const DeleteSupplierApi = async (id: string) => {
    const url = `${APISURLS.Supplier.Delete}/${id}`;
    return http.delete<BaseResponse<boolean>>(url);
};
