import type { Metadata } from "next";
import Link from "next/link";
import RouletteGame from "@/features/recommendation/roulette/components/Roulette";
import { Back } from "@/constants/icons";

export const metadata: Metadata = {
  title: "체험 룰렛",
};

const RoulettePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-28">
      <div className="absolute top-16 left-1/3 md:top-24 md:left-28">
        <Link
          href="/recommendation"
          className="text-14-bold hover:bg-primary-100 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 transition"
        >
          <Back className="text-primary-500 h-5 w-5 md:h-6 md:w-6" />
          추천 목록
        </Link>
      </div>

      <h1 className="text-24-bold text-gray-900">체험 룰렛</h1>

      <p className="text-16-medium mt-2 text-center text-gray-500">
        오늘 어떤 체험을 하면 좋을지 룰렛으로 정해보세요.
      </p>

      <RouletteGame />
    </main>
  );
};

export default RoulettePage;
