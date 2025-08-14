import { useLoaderData } from 'react-router-dom';
import { IParamsOption, IUserInfo, MenuObjectItem } from '../types';

export type LoaderData = {
  profile: IUserInfo;
  menus: MenuObjectItem[];
  params: IParamsOption;
};

export const useGetLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return loaderData as LoaderData;
};
