export interface TransactionDetailViewInterface {
    _id?: any;
    firmName?: string;
    contactPerson?: string;
    mobile?: number;
    state?: string;
    city?: string;
    points?: number;
    coupon?: string;
    productNo? : string;
    categoryName?:string;
    transactionType?: string;
    pointType?: string;
    createdAt? : string;
    refno? : number;
}

export interface TransactionScanInterface {
    customerid?: any;
    coupon?: string;
    points?: number;
    errorMessage? : string;
}
 export interface TransFilterInterface {
   
    type?: string[];
    pointType?: string[];
}

export const initialFilterTrans = {
    
    type: [],
    pointType: [],
}