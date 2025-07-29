import { create } from 'zustand';

interface IVisibility {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  error: string;
  setError: (error: string) => void;
}

const useModal = create<IVisibility>((set) => ({
  isOpen: false,
  setIsOpen: (isOpen: boolean) => set({ isOpen }),
  error: '',
  setError: (error) => set({ error }),
}));

export default useModal;
