import type { Metadata } from "next";
import { ActivitiesHeader } from "@/features/myActivities/components/ActivitiesHeader";
import { ActivitiesSection } from "@/features/myActivities/components/ActivitiesClient";

export const metadata: Metadata = {
  title: "내 체험관리",
};

const Activities = () => {
  return (
    <div className="w-full max-w-160">
      <ActivitiesHeader />
      <ActivitiesSection />
    </div>
  );
};

export default Activities;
