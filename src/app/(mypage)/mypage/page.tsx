import type { Metadata } from "next";
import ProfileEditForm from "@/features/mypage/components/ProfileEditForm";

export const metadata: Metadata = {
  title: "마이페이지",
};

const MyPage = () => {
  return <ProfileEditForm />;
};

export default MyPage;
