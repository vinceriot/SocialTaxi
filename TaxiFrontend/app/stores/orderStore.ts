// store.ts
import type { LatLng } from 'react-native-maps';
import { create } from 'zustand';

interface AddressDetails {
  latitude: number;
  longitude: number;
  fullAddress: string;
}

type VehicleType = 'car' | 'minivan';
type PointSelector = 'from' | 'to' | null;
type PurposeKey =
  | 'Медицинская организация'
  | 'Аэропорт, автовокзалы, железнодорожные вокзалы'
  | 'Место осуществления трудовой деятельности'
  | 'Фонд социального страхования Российской Федерации'
  | 'Пенсионный фонд Российской Федерации'
  | 'Спортивно-оздоровительная организация'
  | '';

interface OrderStore {
  step: number;
  setStep: (step: number) => void;

  orderId: string | null;
  setOrderId: (id: string | null) => void;

  from: string;
  setFrom: (value: string) => void;
  to: string;
  setTo: (value: string) => void;

  vehicleType: VehicleType;
  setVehicleType: (value: VehicleType) => void;

  fromCoord: LatLng | null;
  setFromCoord: (coord: LatLng | null) => void;
  toCoord: LatLng | null;
  setToCoord: (coord: LatLng | null) => void;

  selectingPoint: PointSelector;
  setSelectingPoint: (value: PointSelector) => void;

  guideDog: boolean;
  setGuideDog: (value: boolean) => void;
  textOnly: boolean;
  setTextOnly: (value: boolean) => void;
  canHear: boolean;
  setCanHear: (value: boolean) => void;
  needsAssistance: boolean;
  setNeedsAssistance: (value: boolean) => void;
  hasWheelchair: boolean;
  setHasWheelchair: (value: boolean) => void;
  comment: string;
  setComment: (value: string) => void;

  date: string;
  setDate: (value: string) => void;
  time: string;
  setTime: (value: string) => void;
  showDatePicker: boolean;
  setShowDatePicker: (value: boolean) => void;
  showTimePicker: boolean;
  setShowTimePicker: (value: boolean) => void;

  fromAddressDetails: AddressDetails | null;
  setFromAddressDetails: (value: AddressDetails | null) => void;
  toAddressDetails: AddressDetails | null;
  setToAddressDetails: (value: AddressDetails | null) => void;

  goal: PurposeKey;
  setGoal: (value: PurposeKey) => void;
  returnPickupTime: string;
  setReturnPickupTime: (value: string) => void;
  showReturnPickupPicker: boolean;
  setShowReturnPickupPicker: (value: boolean) => void;
  needReturnPickup: boolean;
  setNeedReturnPickup: (value: boolean) => void;

  menuVisible: boolean;
  setMenuVisible: (value: boolean) => void;

  clearStore: () => void;
}

export const useOrderStore = create<OrderStore>((set) => ({
  step: 1,
  setStep: (step) => set({ step }),

  orderId: null,
  setOrderId: (id) => set({ orderId: id }),

  from: '',
  setFrom: (value) => set({ from: value }),
  to: '',
  setTo: (value) => set({ to: value }),
  fromEntrance: '',
  setFromEntrance: (entrance: string) => set({ fromEntrance: entrance }),
  toEntrance: '',
  setToEntrance: (entrance: string) => set({ toEntrance: entrance }),

  vehicleType: 'car',
  setVehicleType: (value) => set({ vehicleType: value }),

  fromCoord: null,
  setFromCoord: (coord) => set({ fromCoord: coord }),
  toCoord: null,
  setToCoord: (coord) => set({ toCoord: coord }),

  selectingPoint: null,
  setSelectingPoint: (value) => set({ selectingPoint: value }),

  guideDog: false,
  setGuideDog: (value) => set({ guideDog: value }),
  textOnly: false,
  setTextOnly: (value) => set({ textOnly: value }),
  canHear: false,
  setCanHear: (value) => set({ canHear: value }),
  needsAssistance: false,
  setNeedsAssistance: (value) => set({ needsAssistance: value }),
  hasWheelchair: false,
  setHasWheelchair: (value) => set({ hasWheelchair: value }),
  comment: '',
  setComment: (value) => set({ comment: value }),

  date: '',
  setDate: (value) => set({ date: value }),
  time: '',
  setTime: (value) => set({ time: value }),
  showDatePicker: false,
  setShowDatePicker: (value) => set({ showDatePicker: value }),
  showTimePicker: false,
  setShowTimePicker: (value) => set({ showTimePicker: value }),

  fromAddressDetails: null,
  setFromAddressDetails: (value) => set({ fromAddressDetails: value }),
  toAddressDetails: null,
  setToAddressDetails: (value) => set({ toAddressDetails: value }),

  goal: '',
  setGoal: (value) => set({ goal: value }),
  returnPickupTime: '',
  setReturnPickupTime: (value) => set({ returnPickupTime: value }),
  showReturnPickupPicker: false,
  setShowReturnPickupPicker: (value) => set({ showReturnPickupPicker: value }),
  needReturnPickup: false,
  setNeedReturnPickup: (value) => set({ needReturnPickup: value }),

  menuVisible: false,
  setMenuVisible: (value) => set({ menuVisible: value }),

  routePrice: null,
  setRoutePrice: (price) => set({ routePrice: price }),

  clearStore: () => set({
    from: '',
    to: '',
    fromEntrance: '',
    toEntrance: '',
    vehicleType: 'car',
    fromCoord: null,
    toCoord: null,
    selectingPoint: null,
    guideDog: false,
    textOnly: false,
    canHear: false,
    needsAssistance: false,
    hasWheelchair: false,
    comment: '',
    date: '',
    time: '',
    showDatePicker: false,
    showTimePicker: false,
    fromAddressDetails: null,
    toAddressDetails: null,
    goal: '',
    returnPickupTime: '',
    showReturnPickupPicker: false,
    needReturnPickup: false,
    menuVisible: false,
    routePrice: null,
  }),
}));

// ✏️ Добавляем подписку прямо в конце файла:
useOrderStore.subscribe(
  (newState, prevState) => {
    console.group('🛠️ orderStore изменился');
    console.log('← предыдущее состояние', prevState);
    console.log('→ новое состояние     ', newState);
    console.groupEnd();
  },
  (state) => state // селектор: подписываемся на весь state
);