import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReviewSection from "@/features/activities/components/ReviewSection/ReviewSection";
import BannerImageSection from "@/features/activities/components/BannerImageSection/BannerImageSection";
import TitleSection from "@/features/activities/components/TitleSection/TitleSection";
import ReservationSection from "@/features/activities/components/ReservationSection/ReservationSection";
import { DescriptionSection } from "@/features/activities/components/DescriptionSection/DescriptionSection";
import MapSection from "@/features/activities/components/MapSection/MapSection";
import MobileReservationFooter from "@/features/activities/components/MobileReservationFooter/MobileReservationFooter";
import TabletReservationFooter from "@/features/activities/components/TabletReservationFooter/TabletReservationFooter";
import { getActivityDetail } from "@/features/activities/api/api";
import type { ActivityDetailResponse } from "@/features/activities/type";
import { SITE_NAME } from "@/constants/site";

const getBannerImages = (data: ActivityDetailResponse) => {
  return [
    data.bannerImageUrl,
    ...data.subImages.map((image) => image.imageUrl),
  ];
};

const truncate = (text: string, max: number) =>
  text.length > max ? `${text.slice(0, max)}…` : text;

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> => {
  try {
    const { id } = await params;
    const activityId = Number(id);

    if (Number.isNaN(activityId)) {
      return {};
    }

    const activity = await getActivityDetail({ activityId });
    const description = truncate(activity.description, 100);

    return {
      title: activity.title,
      description,
      openGraph: {
        type: "website",
        siteName: SITE_NAME,
        locale: "ko_KR",
        title: activity.title,
        description,
        images: [activity.bannerImageUrl],
      },
      twitter: {
        card: "summary_large_image",
        title: activity.title,
        description,
        images: [activity.bannerImageUrl],
      },
    };
  } catch (error) {
    console.error("[ActivityDetail] 메타데이터를 생성하지 못했습니다.", error);
    return {};
  }
};

const ActivitiesPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const activityId = Number(id);

  if (Number.isNaN(activityId)) {
    notFound();
  }

  let activityData: ActivityDetailResponse;

  try {
    activityData = await getActivityDetail({ activityId });
  } catch {
    notFound();
  }

  const bannerImages = getBannerImages(activityData);
  const titleSectionProps = {
    id: activityData.id,
    userId: activityData.userId,
    title: activityData.title,
    category: activityData.category,
    address: activityData.address,
    reviewCount: activityData.reviewCount,
    rating: activityData.rating,
  };

  return (
    <div className="flex w-full flex-col gap-5 px-6 pb-5 md:px-7.5 lg:px-10">
      <div className="flex flex-col gap-5 pb-36 lg:grid lg:grid-cols-[670px_410px] lg:items-start lg:gap-x-12 lg:pb-0">
        <div className="flex flex-col gap-5">
          <BannerImageSection images={bannerImages} />
          <div className="lg:hidden">
            <TitleSection {...titleSectionProps} />
          </div>
          <DescriptionSection description={activityData.description} />
          <MapSection address={activityData.address} />
          <ReviewSection
            activityId={activityId}
            reviewCount={activityData.reviewCount}
            rating={activityData.rating}
          />
        </div>

        <div className="hidden w-102.5 flex-col gap-5 lg:flex">
          <TitleSection {...titleSectionProps} />
          <ReservationSection
            activityId={activityId}
            price={activityData.price}
          />
        </div>
      </div>

      <MobileReservationFooter
        activityId={activityId}
        price={activityData.price}
      />
      <TabletReservationFooter
        activityId={activityId}
        price={activityData.price}
      />
    </div>
  );
};

export default ActivitiesPage;
