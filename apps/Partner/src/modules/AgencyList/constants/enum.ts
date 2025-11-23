export enum RoomRentalStatus {
  RENTED = 'RENTED',
  AVAILABLE = 'AVAILABLE',
  MAINTENANCE = 'MAINTENANCE',
}

export const RoomRentalStatusMap: Record<RoomRentalStatus, string> = {
  [RoomRentalStatus.RENTED]: 'Đã thuê',
  [RoomRentalStatus.AVAILABLE]: 'Chưa thuê',
  [RoomRentalStatus.MAINTENANCE]: 'Bảo trì',
};

export const RoomRentalStatusOptions = [
  {
    label: RoomRentalStatusMap[RoomRentalStatus.RENTED],
    value: RoomRentalStatus.RENTED,
  },
  {
    label: RoomRentalStatusMap[RoomRentalStatus.AVAILABLE],
    value: RoomRentalStatus.AVAILABLE,
  },
  {
    label: RoomRentalStatusMap[RoomRentalStatus.MAINTENANCE],
    value: RoomRentalStatus.MAINTENANCE,
  },
];

