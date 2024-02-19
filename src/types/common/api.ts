import { RESERVATION_STATUS } from '@/constants/reservation';

export type Category = '문화 · 예술' | '식음료' | '스포츠' | '투어' | '관광' | '웰빙';

interface SubImageUrl {
  id: number;
  imageUrl: string;
}

export interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: Category;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
  subImages?: SubImageUrl[];
}

interface ActivityInfo {
  id: number;
  title: string;
  bannerImageUrl: string;
}

export type ReservationStatus = keyof typeof RESERVATION_STATUS;

export enum ReservationStatusEnum {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  DECLINED = 'declined',
  CANCELED = 'canceled',
  COMPLETED = 'completed',
}
export interface ReservationBase {
  id: number;
  teamId: string;
  userId: number;
  scheduleId: number;
  status: ReservationStatus;
  reviewSubmitted: boolean;
  totalPrice: number;
  headCount: number;
  date: string;
  startTime: string;
  endTime: string;
  createdAt: string;
  updatedAt: string;
}

export interface Reservation extends ReservationBase {
  activity: ActivityInfo;
}

export interface ScheduledReservation extends ReservationBase {
  nickname: string;
  activityId: number;
}

export interface Time {
  id: number;
  startTime: string;
  endTime: string;
}

export interface TimeSlot {
  times: Time[];
  date: string;
}

export interface ActivityId {
  activityId: number;
}
