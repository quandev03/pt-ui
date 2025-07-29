import { axiosClient } from 'apps/Internal/src/service';
import {
  ICategoryProduct,
  ICategoryProductParams,
  PayloadCreateUpdateCategoryProduct,
} from '../types';
import { urlCategoryProduct } from './url';
import { IPage } from '@react/commons/types';

export const categoryProductService = {
  getListCategotyType: async () => {
    const res = await axiosClient.get<any, any>(
      `${urlCategoryProduct}/combobox/category-type`
    );
    return res;
  },
  getListCategoryProducts: async (params: ICategoryProductParams) => {
    const paramCustom = {
      status: params.status,
      "search-string": params.q ?? "",
      page: params.page ?? "",
      size: params.size ?? ""
    }
    const res = await axiosClient.get<any, any>(urlCategoryProduct, { params: paramCustom });
    return res;
  },
  getCategoryProductsDetail: async (id: string) => {
    const res = await axiosClient.get<string, ICategoryProduct>(`${urlCategoryProduct}/${id}`);
    return res;
  },
  postAddCategoryProduct: async (data: PayloadCreateUpdateCategoryProduct) => {
    const res = await axiosClient.post(urlCategoryProduct, data);
    return res;
  },
  putAddCategoryProduct: async (data: PayloadCreateUpdateCategoryProduct) => {
    const res = await axiosClient.put(`${urlCategoryProduct}/${data.id}`, data);
    return res;
  },
  deleteAddCategoryProduct: async (id: string) => {
    const res = await axiosClient.delete(`${urlCategoryProduct}/${id}`);
    return res;
  },
};
