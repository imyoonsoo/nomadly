"use client";

import { useEffect, useState } from "react";
import { CardItem } from "@/app/(main)/components/type";
import Title from "@/app/(mypage)/_components/Title";
import { ActivitiesCard } from "@/app/(main)/components/ActivitiesCard";
import { Pagination } from "@/components/Pagination/Pagination";
import api from "@/lib/api/axios";
import { useBookmarkedIds } from "@/features/activities/hooks/useBookmarkedIds";

export const BookmarkedActivities = () => {
  const [page, setPage] = useState(1);
  const [activities, setActivities] = useState<CardItem[]>([]);
  // 북마크 취소 시 목록에서 제거되도록
  const bookmarkedIds = useBookmarkedIds();

  useEffect(() => {
    const getBookmarkedActivities = async () => {
      // Promise.all 전체 실패 방지를 위해 개별 catch로 처리 및 삭제된 404는 null 리턴
      const results = await Promise.all(
        bookmarkedIds.map((id) =>
          api
            .get<CardItem>(`/activities/${id}`)
            .then((res) => res.data)
            .catch(() => null),
        ),
      );

      // 삭제/로딩 실패로 인한 null 데이터 제거 및 타입추론 보장
      const validActivities = results.filter(
        (item): item is CardItem => item !== null,
      );

      setActivities(validActivities);
    };

    getBookmarkedActivities();
  }, [bookmarkedIds]);

  const ITEMS_PER_PAGE = 9;
  const totalPages = Math.ceil(activities.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = activities.slice(startIndex, endIndex);

  return (
    <div className="max-sm:px-5">
      <header className="flex flex-col">
        <Title
          title="관심 체험"
          description="내가 찜한 체험리스트를 볼 수 있습니다"
        />
      </header>

      {activities.length === 0 ? (
        <p className="mt-10 text-center text-gray-400">
          북마크한 체험이 없습니다.
        </p>
      ) : (
        <div className="flex flex-wrap gap-4 md:gap-6">
          {paginatedItems.map((item) => (
            <div
              key={item.id}
              className="w-[calc((100%-16px)/2)] md:w-[calc((100%-72px)/3)]"
            >
              <ActivitiesCard {...item} />
            </div>
          ))}
        </div>
      )}

      {activities.length > 0 && totalPages > 1 && (
        <div className="mt-7.5 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};
