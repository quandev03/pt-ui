import { create } from 'zustand';
import { IFeedback, ModalTypeReason } from '../types';

export interface IFeedbackStore {
  selectedKeys: React.Key[];
  setSelectedKeys: (selectedKeys: React.Key[]) => void;
  selectedFeedback: IFeedback[];
  setSelectedFeedback: (selectedKeys: IFeedback[]) => void;
  isOpenReasonModal: boolean;
  isOpenDepartmentModal: boolean;
  setOpenReasonModal: (
    isOpen: boolean,
    id: number[],
    type?: ModalTypeReason
  ) => void;
  modalIds: number[] | string[];
  typeModalReason: ModalTypeReason;
  setOpenDepartmentModal: (isOpen: boolean, id: any[]) => void;
  setOpenProgressModal: (isOpen: boolean, id: any[]) => void;
  isOpenProgressModal: boolean;
  reloadToggle: boolean;
  handleToggleReload: () => void;
  listPriority: any[];
  setListPriority: (listPriority: any[]) => void;
}

const useFeedbackStore = create<IFeedbackStore>((set) => ({
  typeModalReason: null,
  selectedKeys: [],
  setSelectedKeys: (selectedKeys: React.Key[]) => {
    set(() => ({ selectedKeys }));
  },
  selectedFeedback: [],
  setSelectedFeedback: (selectedFeedback: IFeedback[]) => {
    set(() => ({ selectedFeedback }));
  },
  isOpenReasonModal: false,
  isOpenDepartmentModal: false,
  modalIds: [],
  setOpenReasonModal: (
    isOpen: boolean,
    id: number[],
    type: ModalTypeReason = null
  ) => {
    set(() => ({
      isOpenReasonModal: isOpen,
      modalIds: id,
      typeModalReason: type,
    }));
  },
  setOpenDepartmentModal: (isOpen: boolean, id: any[]) => {
    set(() => ({ isOpenDepartmentModal: isOpen, modalIds: id }));
  },
  setOpenProgressModal: (isOpen: boolean, id: any[]) => {
    set(() => ({ isOpenProgressModal: isOpen, modalIds: id }));
  },
  handleToggleReload: () => {
    set((state) => ({ reloadToggle: !state.reloadToggle }));
  },
  reloadToggle: false,
  isOpenProgressModal: false,
  listPriority: [],
  setListPriority: (list: any[]) => {
    set(() => ({ listPriority: list }));
  },
}));
export default useFeedbackStore;
