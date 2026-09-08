import type { Metadata } from "next";
import Link from "next/link";
import BalanceGame from "@/features/recommendation/balance/components/BalanceGame";
import { Back } from "@/constants/icons";

export const metadata: Metadata = {
  title: "밸런스 게임",
};

const BalanceGamePage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-40">
      <div className="absolute top-10 md:top-24 md:left-40 lg:left-56">
        <Link
          href="/recommendation"
          className="text-14-bold hover:bg-primary-100 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 transition"
        >
          <Back className="text-primary-500 h-5 w-5 md:h-6 md:w-6" />
          추천 목록
        </Link>
      </div>

      <BalanceGame />
    </main>
  );
};

export default BalanceGamePage;
