export interface CouponProfileInterface {
    _id?: any;
    profileName?: string;
    couponCount?: number;
    startDate?: string;
    expiryDate?: string;
    name?: string;
    productNo?: string;
    description?: string;
    model?: string;
    points?: number;
    mrp?: number;
    price?: number;
    partNo?: string;
    specification?: string;
    weight?: string;
    pcs?: string;
    size?: string;
    customerType?: string[];
    products?: any[];
    categories?: any[];
    categoryName?: string;
    subcategoryName?: string;
}

interface CouponInfo {
    couponCount: number;
    productid: string;
}

interface CreateCouponProfileInterface {
    _id?: any;
    profileName: string;
    startDate?: string;
    expiryDate?: string;
    customerType?: string[];
    couponInfo: CouponInfo[];
}

export const initialCouponProfileData: CreateCouponProfileInterface = {
    _id: '',
    profileName: new Date().valueOf().toString(),
    startDate: new Date().toISOString().split('T')[0],
    expiryDate: new Date(`${new Date().getMonth()}/${new Date().getDate()}/${new Date().getFullYear() + 50}`).toISOString().split('T')[0],
    customerType: ["Mechanic"],
    couponInfo: [{ couponCount: 0, productid: '' }]
};

export interface CouponSearchInterface {
    _id?: any;
    coupon?: string;
    productsData: {
        name?: string,
        productNo: string,
    };
    createdAt?: any;
}

export interface CouponSearchFilterInterface {
    startDate?: any;
    endDate?: any;
    productid?:any;
  }
  
  export const initialFilterCouponSearch = {
    startDate : '',
    endDate: '',
    productid: '',
  }