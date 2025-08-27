import {
  AnyElement,
  ILayoutService,
  MenuObjectItem,
  PayloadType,
  RouterItems,
} from '@vissoft-react/common';
import { ItemType } from 'antd/es/menu/interface';
import {
  LOADER_INIT_KEY,
  OidcClientCredentials,
  baseApiUrl,
  prefixAuthService,
} from '../../../constants';
import { AxiosRequestHeaders } from 'axios';
import { compact } from 'lodash';
import { Link } from 'react-router-dom';
import { routerItems } from '../../../routers';
import { safeApiClient } from '../../../services';

export const layoutPageService: ILayoutService = {
  mappingMenus: (menuData: MenuObjectItem[], pathname: string) => {
    console.log('🚀 ~ menuData:', menuData);
    const urlsActive = menuData?.map((item) => item.uri);
    const menusClean = routerItems.filter(
      (item) => urlsActive?.includes(item.key) || item.hasChild === true
    );
    const menus = compact(
      menusClean.map((item) =>
        layoutPageService.convertMenuItemToItem(item, menusClean, pathname)
      )
    );
    return menus;
  },
  convertMenuItemToItem: (
    { parentId, label, key, icon, hasChild }: RouterItems,
    menus: RouterItems[],
    pathname: string,
    isChildMenu?: boolean
  ) => {
    if (parentId && !isChildMenu) return null;
    const isLinked = !menus.some(
      (value: AnyElement) => value['parentId'] === key
    );
    const menuLabel =
      !isLinked || pathname === key ? (
        <div title={label}>{label}</div>
      ) : (
        <Link to={key} title={label}>
          {label}
        </Link>
      );
    const childrens: ItemType[] = menus
      .filter((item) => item['parentId'] === key)
      .map((subItem) =>
        layoutPageService.convertMenuItemToItem(subItem, menus, pathname, true)
      );
    if (compact(childrens).length === 0 && hasChild === true) return null;
    return {
      key: key,
      icon: icon,
      children: childrens.length ? childrens : null,
      label: menuLabel,
    };
  },
  fetcherChangePassword: async (payload: PayloadType) => {
    return safeApiClient.post(
      `hivn-admin-service/private/api/auth/change-password`,
      payload
    );
  },
  logout: async (refreshToken: string) => {
    const formReq = new URLSearchParams();
    formReq.append('token', refreshToken);
    localStorage.removeItem(LOADER_INIT_KEY);
    const res = await safeApiClient.post<void>(
      `${prefixAuthService}/oauth2/revoke`,
      formReq,
      {
        baseURL: baseApiUrl,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${btoa(
            OidcClientCredentials.clientId +
              ':' +
              OidcClientCredentials.clientSecret
          )}`,
        } as AxiosRequestHeaders,
      }
    );
    return res;
  },
};
