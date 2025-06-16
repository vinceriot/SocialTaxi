import { create } from 'zustand';

type Address = {
  displayName: string;
  latitude: number;
  longitude: number;
  [key: string]: any;
};

type AddressStore = {
  selectedAddress: Address | null;
  setSelectedAddress: (address: Address) => void;
  clearAddress: () => void;
};

export const useAddressStore = create<AddressStore>((set) => ({
  selectedAddress: null,
  setSelectedAddress: (address) => set({ selectedAddress: address }),
  clearAddress: () => set({ selectedAddress: null }),
}));