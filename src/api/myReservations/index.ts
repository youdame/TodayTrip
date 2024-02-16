import instance from '@/api/axiosInstance';
import { GetMyReservationsRes, GetMyReservationsParams } from '@/types/myReservations';

export const getMyReservations = async ({
  cursorId,
  size,
  status,
}: GetMyReservationsParams): Promise<GetMyReservationsRes> => {
  return await instance.get(
    `/my-reservations?${cursorId === undefined ? '' : `&cursorId=${cursorId}`}&size=${size}${status === undefined ? '' : `&status=${status}`}`,
  );
};
