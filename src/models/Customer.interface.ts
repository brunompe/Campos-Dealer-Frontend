export interface ResponseType {
  dados: CustomerType[] | ProductType[];
  message: string;
  success: boolean;
}

export interface CustomerType {
  id: number;
  name: string;
  city: string;
}

export interface ProductType {
  id: number;
  value: string;
  description: string;
}

export interface SaleType {
  id: number;
  customerId: number;
  productId: number;
  quantity: number;
  productPrice: number;
  totalPrice?: string;
  saleData?: Date;
}
