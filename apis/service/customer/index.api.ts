import http from "@/apis/api";
import { APISURLS } from "@/apis/url";
import { BaseResponse, PaginationBaseResponse } from "@/utils/apiBaseResponse";

export const GetCustomerApi = async (
    pageNumber: number = 0,
    pageSize: number = 10,
    isDescending: boolean = true
) => {
    const url = `${APISURLS.Customers.GetAll}?PageNumber=${pageNumber}&PageSize=${pageSize}&IsDescending=${isDescending}`;
    return http.get<PaginationBaseResponse<CustomerResponse[]>>(url);
};


export const UpdateCustomerApi = async (id: string, payload: EditCustomer) => {
    const url = `${APISURLS.Customers.Update}/${id}`;
    return http.put<BaseResponse<CustomerResponse>>(url, payload);
};

export const CreateCustomerApi = async (payload: EditCustomer) => {
    const data = payload;
    return http.post<BaseResponse<CustomerResponse>>(APISURLS.Customers.Create, data);
};

export const DeleteCustomerApi = async (id: string) => {
  const url = `${APISURLS.Customers.Delete}/${id}`;
  return http.delete<BaseResponse<boolean>>(url);
};


export interface CustomerResponse {
    id: string;
    companyId: string;     // Guid → string
    userId: string;        // Guid → string
    name: string;
    contactName: string;
    email: string;
    mobile: string;
    gstin: string;
    address: string;
    city: string;
    state: string;
    country: string;
    creditLimit: number;   // decimal → number
    phone: string;
    isActive: boolean;
    createdBy: string;
    createdAt: string;
    modifiedBy: string;
    modifiedAt: string;
}


export interface EditCustomer {
    name: string;
    contactName: string;
    companyId: string;
    email: string;
    mobile: string;
    gstin: string;
    address: string;
    city: string;
    state: string;
    country: string;
    creditLimit?: number | null; // nullable decimal → optional or null
}