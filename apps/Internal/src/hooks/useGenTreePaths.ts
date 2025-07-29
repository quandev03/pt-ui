import { BreadcrumbMenuItem } from '@react/commons/types';
import { RegUlid, RegUuid } from '@react/constants/regex';
import { useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import useConfigAppNoPersistStore from '../components/layouts/store/useConfigAppNoPersistStore';
import { pathRoutes } from '../constants/routes';

const useGenTreePaths = () => {
  const { pathname } = useLocation();
  const { menus } = useConfigAppNoPersistStore();
  const [treePaths, setTreePaths] = useState<BreadcrumbMenuItem[]>([]);
  const params = useParams();
  const genTreePaths = () => {
    const pathLocation = pathname === '/' ? pathRoutes.dashboard : pathname;
    const locationArr = pathLocation
      .split('/')
      .filter(
        (item) => !RegUuid.test(item) && !RegUlid.test(item) && !Number(item)
      )
      .filter((item) => {
        let result = true;
        Object.keys(params).forEach((itemParams) => {
          if (item === params[itemParams]) result = false;
        });
        return result;
      });
    console.log(locationArr);
    const locationItem = menus.find(
      (item) => item.key === `/${locationArr[1]}`
    );
    const initTreePaths = locationArr.map((item, index, self) => {
      if (index === 1 && locationItem)
        return locationItem as BreadcrumbMenuItem;
      return {
        key: item,
        isAction: index === self.length - 1,
      } as BreadcrumbMenuItem;
    });
    const treePaths = menus.reduce((acc, cur, _, self) => {
      if (locationItem && cur.key === locationItem['parentId']) {
        acc.splice(1, 0, { ...cur, isText: true });
        const parentItem = self.find(
          (item: any) => item.key === cur['parentId']
        );
        if (parentItem && parentItem.key === cur['parentId']) {
          acc.splice(1, 0, { ...parentItem, isText: true });
        }
      }
      return acc;
    }, initTreePaths);
    return treePaths;
  };
  useEffect(() => {
    const treePaths = genTreePaths();
    setTreePaths(treePaths);
  }, [pathname, menus]);
  return treePaths;
};

export default useGenTreePaths;
