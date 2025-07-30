import { useLoaderData } from 'react-router-dom';
import { IUserInfo, MenuObjectItem } from '../types';

export type LoaderData = {
  profile: IUserInfo;
  menus: MenuObjectItem[];
};

export const useGetLoaderData = (): LoaderData => {
  const loaderData = useLoaderData();
  return loaderData as LoaderData;
};
