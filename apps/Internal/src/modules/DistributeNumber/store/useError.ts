import { create } from 'zustand';

interface IError {
  error: string | null;
  setError: (error: string | null) => void;
}
const useError = create<IError>((set) => ({
    error: null,
    setError: (error: string | null) => set({ error }),
}));
export default useError;