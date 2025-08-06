import { useLoaderData } from 'react-router-dom';
import { IAllParamResponse, IUserInfo, MenuObjectItem } from '../types';

export type LoaderData = {
  profile: IUserInfo;
  menus: MenuObjectItem[];
  params: IAllParamResponse;
};

export const useGetLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return loaderData as LoaderData;
};
