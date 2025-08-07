import { create } from 'zustand';
import { IParameter } from '../type';
import { DEFAULT_PARAMS } from '../constant';


interface IListPhonNumbers {
    parameter: IParameter;
    setParamester: (paramters: IParameter) => void;
}

const useSearchParams = create<IListPhonNumbers>((set) => ({
    parameter: DEFAULT_PARAMS,
    setParamester: (parameter: IParameter) => set({ parameter }),
}));

export default useSearchParams;
