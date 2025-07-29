import { axiosClient } from 'apps/Internal/src/service';
import {
  IDetail,
  IDiscountManagement,
  IPayloadDiscount,
  IPayloadDiscountForm,
  ParamsDiscountManagement,
  Req,
} from '../types';
import { IPage } from '@react/commons/types';
import dayjs from 'dayjs';
import { formatDateBe } from '@react/constants/moment';
import { prefixCatalogService } from '@react/url/app';

interface Res {
  content: IDiscountManagement[];
  totalElements: number;
  size: number;
}

export const Discount = {
  getDiscountList: async (param: ParamsDiscountManagement) => {
    const res = await axiosClient.get<Req, Res>(
      `${prefixCatalogService}/discount/search`,
      {
        params: param,
      }
    );

    if (!res) throw new Error('Opps');
    return res;
  },
  getProductsList: async (param: {
    categoryId: string | number | undefined;
  }) => {
    const res = await axiosClient.get<Req, Res>(
      `${prefixCatalogService}/product/products`,
      {
        params: { ...param, status: 1 },
      }
    );

    if (!res) throw new Error('Opps');
    return res;
  },
  getDiscountDetail: async (id: string | number) => {
    const res = await axiosClient.get<string, IDetail>(
      `${prefixCatalogService}/discount/${id}`
    );
    return res;
  },
  deleteDiscount: async (id: string | number) => {
    const res = await axiosClient.delete(
      `${prefixCatalogService}/discount/${id}`
    );
    return res;
  },
  postAddDiscount: async (payload: IPayloadDiscountForm) => {
    try {
      const formData = new FormData();
      const {
        files,
        discountCode,
        discountName,
        calType,
        discountType,
        fromDate,
        toDate,
        orgType,
        orgIds,
        productCategoryId,
        productIds,
        description,
        discountDetails,
      } = payload;

      console.log(files);

      formData.append(
        'request',
        new Blob(
          [
            JSON.stringify({
              discountCode,
              discountName,
              calType,
              discountType,
              fromDate,
              toDate,
              orgType,
              orgIds,
              productCategoryId,
              productIds,
              description,
              discountDetails: discountDetails,
              attachments: files
                ? files.map((item: any) => ({
                    id: item.id,
                    description: item.desc,
                    fileName: item.name,
                    fileUrl: item.url ? item.url : '',
                    fileVolume: item.size,
                    createdDate: dayjs(item.date).format(formatDateBe),
                  }))
                : [],
            }),
          ],
          {
            type: 'application/json',
          }
        )
      );

      if (files && files.length > 0) {
        files
          .filter((item) => !item.id)
          .forEach((item) => {
            formData.append('files', item.files as Blob);
          });
      }

      const res = await axiosClient.post<string, IPage<IPayloadDiscount>>(
        `${prefixCatalogService}/discount`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return res;
    } catch (error) {
      // Catch and log error here
      console.error('Error in postAddDiscount:', error);
      throw error; // Re-throw error after logging
    }
  },
  putUpdateDiscount: async (
    payload: IPayloadDiscountForm & { id: string | number }
  ) => {
    try {
      const formData = new FormData();
      const {
        files,
        discountCode,
        discountName,
        calType,
        discountType,
        fromDate,
        toDate,
        orgType,
        orgIds,
        productCategoryId,
        productIds,
        description,
        discountDetails,
        id,
      } = payload;

      formData.append(
        'request',
        new Blob(
          [
            JSON.stringify({
              discountCode,
              discountName,
              calType,
              discountType,
              fromDate,
              toDate,
              orgType,
              orgIds,
              productCategoryId,
              productIds,
              description,
              discountDetails: discountDetails,
              attachments: files
                ? files.map((item: any) => ({
                    id: item.id,
                    description: item.desc,
                    fileName: item.name,
                    fileUrl: item.url ? item.url : '',
                    fileVolume: item.size,
                    createdDate: dayjs(item.date).format(formatDateBe),
                  }))
                : [],
            }),
          ],
          {
            type: 'application/json',
          }
        )
      );

      if (files && files.length > 0) {
        files
          .filter((item) => !item.id)
          .forEach((item) => {
            formData.append('files', item.files as Blob);
          });
      }

      const res = await axiosClient.put<string, IPage<IPayloadDiscount>>(
        `${prefixCatalogService}/discount/${id}`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      return res;
    } catch (error) {
      // Catch and log error here
      console.error('Error in postAddDiscount:', error);
      throw error; // Re-throw error after logging
    }
  },
};
