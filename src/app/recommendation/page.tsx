import type { Metadata } from "next";
import Link from "next/link";
import { House } from "@/constants/icons";

export const metadata: Metadata = {
  title: "체험 추천",
};

const RECOMMENDATION_LIST = [
  {
    id: "experience",
    title: "체험 추천 테스트",
    description: "테스트를 통해 체험 추천을 받으세요.",
    href: "/recommendation/experience",
    status: "play",
  },
  {
    id: "mbti",
    title: "MBTI별 체험 추천",
    description: "자신의 MBTI와 맞는 체험 추천을 받으세요.",
    href: "/recommendation/mbti",
    status: "play",
  },
  {
    id: "roulette",
    title: "체험 룰렛",
    description: "룰렛을 돌려 오늘의 추천 체험을 골라보세요.",
    href: "/recommendation/roulette",
    status: "play",
  },
  {
    id: "balance",
    title: "체험 밸런스 게임",
    description: "더 끌리는 체험을 골라 취향을 알아보세요.",
    href: "/recommendation/balance",
    status: "play",
  },
  {
    id: "coming-soon",
    title: "준비 중",
    description: "새로운 추천이 곧 추가될 예정이에요.",
    href: "",
    status: "disabled",
  },
];

const RecommendationPage = () => {
  return (
    <main className="min-h-screen bg-gray-50 px-6 pt-24 pb-10">
      <section className="mx-auto w-full max-w-240">
        <div className="mb-6">
          <Link
            href="/"
            className="text-14-bold hover:bg-primary-100 inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2 text-gray-700 transition"
          >
            <House className="text-primary-500 h-4 w-4" />
            홈으로
          </Link>
        </div>

        <h1 className="text-24-bold text-gray-900">체험 추천</h1>
        <p className="text-16-medium mt-2 text-gray-500">
          체험을 추천해드려요.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2">
          {RECOMMENDATION_LIST.map((rec) =>
            rec.status === "play" ? (
              <Link
                key={rec.id}
                href={rec.href}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-md"
              >
                <h2 className="text-18-bold text-gray-900">{rec.title}</h2>
                <p className="text-14-medium mt-2 text-gray-500">
                  {rec.description}
                </p>

                <span className="bg-primary-100 text-14-bold text-primary-500 mt-5 inline-flex rounded-full px-4 py-2">
                  테스트하기
                </span>
              </Link>
            ) : (
              <div
                key={rec.id}
                className="rounded-2xl border border-gray-200 bg-gray-100 p-5 opacity-70"
              >
                <h2 className="text-18-bold text-gray-500">{rec.title}</h2>
                <p className="text-14-medium mt-2 text-gray-400">
                  {rec.description}
                </p>

                <span className="text-14-bold mt-5 inline-flex rounded-full bg-gray-200 px-4 py-2 text-gray-400">
                  준비 중
                </span>
              </div>
            ),
          )}
        </div>
      </section>
    </main>
  );
};

export default RecommendationPage;
