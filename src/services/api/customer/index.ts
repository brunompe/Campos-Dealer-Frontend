import { CustomerType, ResponseType } from "@/models/Customer.interface";
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

export const Customer = {
  getCustomers: (): Promise<ResponseType> => requests.get("Customer"),
  createCustomer: (customer: CustomerType): Promise<CustomerType[]> =>
    requests.post("Customer", customer),
  updateCustomer: (customer: CustomerType): Promise<CustomerType[]> =>
    requests.put(`Customer`, customer),
  deleteCustomer: (id: number): Promise<void> =>
    requests.delete(`Customer?id=${id}`),
};
