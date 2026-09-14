"use client";

import { useRouter } from "next/navigation";
import Title from "@/app/(mypage)/_components/Title";

export const ActivitiesHeader = () => {
  const router = useRouter();

  return (
    <Title
      title="내 체험관리"
      description="체험을 등록하거나 수정 및 삭제가 가능합니다."
      buttonText="체험 등록하기"
      onButtonClick={() => router.push("/activities/new")}
    />
  );
};
