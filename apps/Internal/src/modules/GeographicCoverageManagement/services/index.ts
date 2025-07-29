import { IPage } from '@react/commons/types';
import { prefixCatalogService } from 'apps/Internal/src/constants/app';
import { axiosClient } from 'apps/Internal/src/service';
import {
  ICoverageAreaItem,
  ICoverageAreaParams,
  IFormCoverageArea,
  INationItem,
} from '../types';

export const coverageAreaServices = {
  getCoverageAreas: (params: ICoverageAreaParams) => {
    return axiosClient.get<ICoverageAreaParams, IPage<ICoverageAreaItem>>(
      `${prefixCatalogService}/coverage-range/search`,
      {
        params,
      }
    );
  },

  getCoverageArea: async (id: string | undefined) => {
    return await axiosClient.get<string, ICoverageAreaItem>(
      `${prefixCatalogService}/coverage-range/${id}`
    );
  },

  checkIsAttached: async (id: string | undefined) => {
    return await axiosClient.get<string, boolean>(
      `${prefixCatalogService}/coverage-range/check-coverage-range-is-attached/${id}`
    );
  },

  createCoverageArea: async (data: IFormCoverageArea) => {
    const { avatar, status, nations, ...rest } = data;
    const formData = new FormData();
    const request = JSON.stringify(rest);
    formData.append('avatar', avatar as Blob);
    formData.append(
      'request',
      new Blob([request], { type: 'application/json' })
    );
    return await axiosClient.post<IFormCoverageArea, ICoverageAreaItem>(
      `${prefixCatalogService}/coverage-range`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  updateCoverageArea: async (data: IFormCoverageArea) => {
    const formData = new FormData();
    const { avatar, nations, ...rest } = data;
    const request = JSON.stringify(rest);
    formData.append('avatar', avatar as Blob);
    formData.append(
      'request',
      new Blob([request], { type: 'application/json' })
    );
    return await axiosClient.put<IFormCoverageArea, ICoverageAreaItem>(
      `${prefixCatalogService}/coverage-range/${data.id}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
  },

  deleteCoverageArea: async (id: string) => {
    return await axiosClient.delete(
      `${prefixCatalogService}/coverage-range/${id}`
    );
  },
  getNations: (params: ICoverageAreaParams) => {
    return axiosClient.get<ICoverageAreaParams, IPage<INationItem>>(
      `${prefixCatalogService}/coverage-range/choose-nations`,
      {
        params,
      }
    );
  },
};
