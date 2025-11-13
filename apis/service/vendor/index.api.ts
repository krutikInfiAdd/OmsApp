import http from "@/apis/api";
import { BaseDto } from "../company/index.api";
import { BaseResponse, PaginationBaseResponse } from "@/utils/apiBaseResponse";
import { APISURLS } from "@/apis/url";

export const CreateVendorApi = async (payload: VendorBaseDto) => {
    const data = payload;
    return http.post<BaseResponse<VendorType>>(APISURLS.Vendor.Create, data);
};

export const GetVendorApi = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    isDescending: boolean = true
) => {
    const url = `${APISURLS.Vendor.GetAll}?PageNumber=${pageNumber}&PageSize=${pageSize}&IsDescending=${isDescending}`;
    return http.get<PaginationBaseResponse<VendorType[]>>(url);
};

export const DeleteVendorApi = async (id: string) => {
    const url = `${APISURLS.Vendor.Delete}/${id}`;
    return http.delete<BaseResponse<boolean>>(url);
};

export const UpdateVendorApi = async (id: string, payload: VendorBaseDto) => {
    const url = `${APISURLS.Vendor.Update}/${id}`;
    return http.put<BaseResponse<VendorType>>(url, payload);
};


export const VendorDDLApi = async () => {
    const url = `${APISURLS.Vendor.DDL}`;
    return http.get<BaseResponse<VendorDropdown[]>>(url);
};


export interface VendorBaseDto {
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
    country?: string | null; // default: "India" (can be handled in frontend logic)
    pinCode?: string | null;
    gstType?: string | null;
    creditLimit?: number | null;
    paymentTerms?: string | null;
    bankName?: string | null;
    accountNumber?: string | null;
    ifscCode?: string | null;
}

export interface VendorType extends VendorBaseDto, BaseDto { }

export interface VendorDropdown {
    id: string;
    code: string;
    name: string;
    description?: string | null;
}