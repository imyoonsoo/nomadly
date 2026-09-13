"use client";

import { Suspense, useState } from "react";
import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { useInfiniteScroll } from "@/hooks/useInfiniteScroll";
import { myActivitiesInfiniteQuery } from "@/features/myActivities/queries";
import { getSortedActivities } from "../utils";

import SortDropdown from "./SortDropdown";
import ActivityBanner from "./ActivityBanner";
import ActivitiesList from "./ActivitiesList";
import EmptyCardList from "./EmptyCardList";
import CardListSkeleton from "./CardListSkeleton";
import Skeleton from "@/components/Skeleton/Skeleton";
import { ErrorBoundary } from "@/components/ErrorBoundary/ErrorBoundary";
import NotFoundImage from "@/assets/images/empty-notFound.svg";

const ActivitiesSkeleton = () => (
  <>
    <Skeleton className="mr-auto mb-5 h-13.5 w-30 rounded-2xl md:w-36" />
    <ActivityBanner count={0} isLoading />
    <CardListSkeleton />
  </>
);

const ActivitiesSectionContent = () => {
  const [currentSort, setCurrentSort] = useState<string | number>("latest");

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery(
      myActivitiesInfiniteQuery({
        size: 10,
      }),
    );

  const { targetRef } = useInfiniteScroll({
    onIntersect: fetchNextPage,
    hasNextPage: !!hasNextPage,
    isLoading: isFetchingNextPage,
  });

  const cards = data.pages.flatMap((page) => page.activities);
  const sortedActivities = getSortedActivities(cards, currentSort);
  const totalCount = data.pages[0]?.totalCount ?? 0;

  if (totalCount === 0) {
    return <EmptyCardList />;
  }

  return (
    <>
      <SortDropdown currentSort={currentSort} onChange={setCurrentSort} />

      <ActivityBanner count={totalCount} />

      <ActivitiesList
        sortedActivities={sortedActivities}
        targetRef={targetRef}
        isFetchingNextPage={isFetchingNextPage}
      />
    </>
  );
};

export const ActivitiesSection = () => {
  return (
    <ErrorBoundary
      fallback={
        <EmptyCardList
          message="체험 목록을 불러오지 못했어요"
          image={<NotFoundImage className="h-45.5 w-45.5" />}
        />
      }
    >
      <Suspense fallback={<ActivitiesSkeleton />}>
        <ActivitiesSectionContent />
      </Suspense>
    </ErrorBoundary>
  );
};
