import { Activity, Category } from '@/types/common/api';

interface UserInfo {
  id: number;
  nickname: string;
  profileImageUrl: string;
}

interface Review {
  id: number;
  user: UserInfo;
  activityId: number;
  content: string;
  rating: number;
  createdAt: string;
  updatedAt: string;
}

export interface GetActivitiesParam {
  method: 'offset' | 'cursor';
  cursorId?: number | null;
  category?: Category;
  keyword?: string;
  sort?: 'most_reviewed' | 'price_asc' | 'price_desc' | 'latest';
  page?: number;
  size?: number;
}

export interface GetActivitiesRes {
  cursorId: number;
  totalCount: number;
  activities: Omit<Activity, 'subImageUrls'>[];
}

export type GetReviewsRes = {
  reviews: Review[];
  totalCount: number;
};
