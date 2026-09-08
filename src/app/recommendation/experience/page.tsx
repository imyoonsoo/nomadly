import type { Metadata } from "next";
import Link from "next/link";
import { Back } from "@/constants/icons";
import RecommendationTest from "@/features/recommendation/experience/components/RecommendationTest";

export const metadata: Metadata = {
  title: "추천 테스트",
};

const RecommendationPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-24">
      <div className="absolute top-32 md:top-24 md:left-56">
        <Link
          href="/recommendation"
          className="text-14-bold hover:bg-primary-100 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 transition"
        >
          <Back className="text-primary-500 h-5 w-5 md:h-6 md:w-6" />
          추천 목록
        </Link>
      </div>
      <RecommendationTest />
    </main>
  );
};

export default RecommendationPage;
