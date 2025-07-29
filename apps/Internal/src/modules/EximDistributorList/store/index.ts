import { create } from 'zustand';
import { IEximDistributorItem } from '../type';

const initListEximDistributor: IEximDistributorItem = {
  content: [],
  empty: true,
  first: true,
  last: false,
  number: 0,
  numberOfElements: 0,
  pageable: {
    pageNumber: 0,
    pageSize: 10,
    sort: { sorted: false, unsorted: true, empty: true },
    offset: 0,
    paged: true,
    unpaged: false,
  },
  size: 10,
  sort: { sorted: false, unsorted: true, empty: true },
  totalElements: 0,
  totalPages: 0,
};
export interface IistEximDistributor {
  listEximDistributor: IEximDistributorItem;
  setListEximDistributor: (listEximDistributor: IEximDistributorItem) => void;
}

const useEximDistributorStore = create<IistEximDistributor>((set) => ({
  listEximDistributor: initListEximDistributor,
  setListEximDistributor: (listEximDistributor: IEximDistributorItem) =>
    set({
      listEximDistributor,
    }),
}));

export default useEximDistributorStore;
