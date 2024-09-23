import { AxiosResponse } from "axios";
export interface ISaleState {
    sales: any,
    loading : boolean,
    error : boolean
}
// Define user type
export interface DetailInterface {
    productid:[];
    productDetailid:[];
    quantity:number;
    price:number;
    lineTotal:number;
    
  
}

// Define user type
export interface Sale {
    parentid:string;
    subTotal: number;
    totalAmount:number;
    customerid:string;
    paymentStatus:string;

    status :string;
    address:string;
   detail:DetailInterface;
 
}

// Define Different action type
 interface AddSaleAction {
    type: string;
    payload: Sale;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

interface DeleteSaleAction {
    type: string;
    payload: Sale;
    subtypes?: string[];
    promise?: Promise<AxiosResponse<any>>;
}

export interface SaleState {
    Sales: Sale;
    loading: boolean;
    error: boolean;
}
export type SaleActionsTypes = AddSaleAction | DeleteSaleAction;
export const SALE_LIST_REQUEST = "SALE_LIST_REQUEST"
export const SALE_LIST_SUCCESS = "SALE_LIST_SUCCESS"
export const SALE_LIST_FAIL = "SALE_LIST_FAIL"
export const SALE_DETAIL_REQUEST = "SALE_DETAIL_REQUEST"
export const SALE_DETAIL_SUCCESS = "SALE_DETAIL_SUCCESS"
export const SALE_DETAIL_FAIL = "SALE_DETAIL_FAIL"
export const SALE_SAVE_REQUEST = "SALE_SAVE_REQUEST"
export const SALE_SAVE_SUCCESS = "SALE_SAVE_SUCCESS"
export const SALE_SAVE_FAIL = "SALE_SAVE_FAIL"
export const SALE_UPDATE_REQUEST = "SALE_UPDATE_REQUEST"
export const SALE_UPDATE_SUCCESS = "SALE_UPDATE_SUCCESS"
export const SALE_UPDATE_FAIL = "SALE_UPDATE_FAIL"
export const SALE_DELETE_REQUEST = "SALE_DELETE_REQUEST"
export const SALE_DELETE_SUCCESS = "SALE_DELETE_SUCCESS"
export const SALE_DELETE_FAIL = "SALE_DELETE_FAIL"

