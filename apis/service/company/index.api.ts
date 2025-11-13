import http from "@/apis/api";
import { APISURLS } from "@/apis/url";
import { BaseResponse, PaginationBaseResponse } from "@/utils/apiBaseResponse";

export const CompanyDDLApi = async () => {
  const url = `${APISURLS.Company.DDL}`;
  return http.get<BaseResponse<CompanyDropdown[]>>(url);
};


export const CreateCompanyApi = async (payload: CompanyBase) => {
  const data = payload;
  return http.post<BaseResponse<CompanyType>>(APISURLS.Company.Create, data);
};

export const GetCompaniesApi = async (
  pageNumber: number = 0,
  pageSize: number = 10,
  isDescending: boolean = true
) => {
  const url = `${APISURLS.Company.GetAll}?PageNumber=${pageNumber}&PageSize=${pageSize}&IsDescending=${isDescending}`;
  return http.get<PaginationBaseResponse<CompanyType[]>>(url);
};

export const DeleteCompanyApi = async (id: string) => {
  const url = `${APISURLS.Company.Delete}/${id}`;
  return http.delete<BaseResponse<boolean>>(url);
};

export const UpdateCompanyApi = async (id: string, payload: CompanyBase) => {
  const url = `${APISURLS.Company.Update}/${id}`;
  return http.put<BaseResponse<CompanyType>>(url, payload);
};

export interface CompanyDropdown {
  id: string;
  code: string;
  name: string;
  description?: string | null;
}


export interface BaseDto {
  id: string;
  isActive: boolean;
  createdBy?: string | null;
  createdAt: string;
  modifiedBy?: string | null;
  modifiedAt?: string | null;
}

export interface CompanyBase {
  name: string;
  gstin: string;
  pan: string;
  address: string;
  email: string;
  phone: string;
  state: string;
  country: string;
  ownerId?: string | null;
}


export interface CompanyType extends CompanyBase, BaseDto { }