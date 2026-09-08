import type { Metadata } from "next";
import Link from "next/link";
import { Back } from "@/constants/icons";
import MbtiRecommendation from "@/features/recommendation/mbti/components/MbtiRecommendation";

export const metadata: Metadata = {
  title: "MBTI 추천",
};

const MbtiRecommendationPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-36">
      <div className="absolute top-16 left-1/3 md:top-24 md:left-28">
        <Link
          href="/recommendation"
          className="text-14-bold hover:bg-primary-100 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 transition"
        >
          <Back className="text-primary-500 h-5 w-5 md:h-6 md:w-6" />
          추천 목록
        </Link>
      </div>

      <MbtiRecommendation />
    </main>
  );
};

export default MbtiRecommendationPage;
