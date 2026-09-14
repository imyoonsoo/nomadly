import type { Metadata } from "next";
import { BookmarkedActivities } from "@/features/activities/components/BookmarkedActivities";

export const metadata: Metadata = {
  title: "찜한 체험",
};

const Page = () => {
  return <BookmarkedActivities />;
};

export default Page;
