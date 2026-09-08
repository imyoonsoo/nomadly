import type { Metadata } from "next";
import ReservationStatusPage from "@/features/reservation-status/components/ReservationStatusPage";
import Title from "../../_components/Title";

export const metadata: Metadata = {
  title: "예약현황",
};

const Page = () => {
  return (
    <>
      <Title
        title="예약 현황"
        description="내 체험에 예약된 내역들을 한 눈에 확인할 수 있습니다."
      />
      <ReservationStatusPage />
    </>
  );
};

export default Page;
