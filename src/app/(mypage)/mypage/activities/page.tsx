"use client";

import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Title from "@/app/(mypage)/_components/Title";

const ActivitiesSection = dynamic(
  () =>
    import("@/features/myActivities/components/ActivitiesSection").then(
      (data) => data.ActivitiesSection,
    ),
  { ssr: false },
);

const Activities = () => {
  const router = useRouter();

  return (
    <div className="w-full max-w-160">
      <Title
        title="내 체험 관리"
        description="체험을 등록하거나 수정 및 삭제가 가능합니다."
        buttonText="체험 등록하기"
        onButtonClick={() => router.push("/activities/new")}
      />

      <ActivitiesSection />
    </div>
  );
};

export default Activities;
