
import { PaginatedResponse } from "@/utils/types/pagination";


/**
 * ✅ Get paginated stock list
 */
// export async function fetchStockListApi(
//   request: UserPaginationQuery
// ): Promise<ApiResponse<PaginatedResponse<Stock>>> {
//   const res = await api.post<ApiResponse<PaginatedResponse<Stock>>>(
//     APIS.STOCKLIST,
//     request
//   );
//   return res.data;
// }

// /**
//  * ✅ Create new stock
//  */
// export async function createStockApi(
//   data: AddStock
// ): Promise<ApiResponse<Stock>> {
//   const res = await api.post<ApiResponse<Stock>>(APIS.ADDSTOCK, data);
//   return res.data;
// }

// /**
//  * ✅ Get stock by ID
//  */
// export async function getStockByIdApi(id: number): Promise<ApiResponse<Stock>> {
//   const url = APIS.GETSTOCKBYID.replace("{id}", id.toString());
//   const res = await api.get<ApiResponse<Stock>>(url);
//   return res.data;
// }

// /**
//  * ✅ Update stock
//  */
// export async function updateStockApi(
//   data: UpdateStock
// ): Promise<ApiResponse<Stock>> {
//   const url = APIS.UPDATESTOCK.replace("{id}", data.id.toString());
//   const res = await api.patch<ApiResponse<Stock>>(url, data);
//   return res.data;
// }

// /**
//  * ✅ Delete stock (soft delete)
//  */
// export async function deleteStockApi(id: number): Promise<ApiResponse<Stock>> {
//   const url = APIS.DELETESTOCK.replace("{id}", id.toString());
//   const res = await api.delete<ApiResponse<Stock>>(url);
//   return res.data;
// }


// export async function getProdctDDLList(): Promise<ApiResponse<{ id: number; name: string }[]>> {
//   const url = APIS.PRODUCTDDLLIST;
//   const res = await api.get<ApiResponse<{ id: number; name: string }[]>>(url);
//   return res.data;
// }


export interface UserPaginationQuery {
  page: number;
  limit: number;
  search?: string;
  filters?: Record<string, any>;
  sort?: {
    field: string;
    order: 'asc' | 'desc';
  };
}