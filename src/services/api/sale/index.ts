import {
  ProductType,
  ResponseType,
  SaleType,
} from "@/models/Customer.interface";
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

export const Sale = {
  getSales: (): Promise<ResponseType> => requests.get("Sale"),
  createSale: (sale: SaleType): Promise<SaleType[]> =>
    requests.post("Sale", sale),
  updateSale: (sale: SaleType): Promise<SaleType[]> =>
    requests.put(`Sale`, sale),
  deleteSale: (id: number): Promise<void> => requests.delete(`Sale?id=${id}`),
};
