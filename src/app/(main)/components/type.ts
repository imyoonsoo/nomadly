import { ActivitySummary } from "@/features/activities/type";

export type CardItem = ActivitySummary;

export interface CardListProps {
  items: CardItem[];
  keyword?: string;
}

export interface ActivitiesCardProps extends CardItem {
  keyword?: string;
}
