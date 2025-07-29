import { DefaultOptionType } from "antd/es/select";
import { IListphoneNoCatalog } from "../type";

export const mapphoneNoCatalog = (
  waraHouseCatalogs: IListphoneNoCatalog[]
): DefaultOptionType[] => {
  return waraHouseCatalogs?.map((item) => ({
    ...item,
    children: mapphoneNoCatalog(item.children),
  }));
};
