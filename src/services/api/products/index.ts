import { ProductType, ResponseType } from "@/models/Customer.interface";
import axios, { AxiosResponse } from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5254/api/",
});

const responseBody = (response: AxiosResponse) => response.data;

const requests = {
  get: (url: string) => instance.get(url).then(responseBody),
  post: (url: string, body: {}) => instance.post(url, body).then(responseBody),
  put: (url: string, body: {}) => instance.put(url, body).then(responseBody),
  delete: (url: string) => instance.delete(url).then(responseBody),
};

export const Product = {
  getProducts: (): Promise<ResponseType> => requests.get("Product"),
  createProduct: (product: ProductType): Promise<ProductType[]> =>
    requests.post("Product", product),
  updateProduct: (product: ProductType): Promise<ProductType[]> =>
    requests.put(`Product`, product),
  deleteProduct: (id: number): Promise<void> =>
    requests.delete(`Product?id=${id}`),
};
