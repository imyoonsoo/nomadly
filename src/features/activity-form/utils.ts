import { ActivityDetailResponse } from "@/features/activities/type";
import { ActivityFormValues } from "./types";
import { uploadActivityImage } from "./api";
import { showToast } from "@/lib/utils/toast";

export const SLOT_MINUTES = 30;

export const TIME_OPTIONS = Array.from(
  { length: (24 * 60) / SLOT_MINUTES },
  (_, index) => {
    const totalMinutes = index * SLOT_MINUTES;
    const hour = String(Math.floor(totalMinutes / 60)).padStart(2, "0");
    const minute = String(totalMinutes % 60).padStart(2, "0");
    const time = `${hour}:${minute}`;

    return { value: time, label: time };
  },
);

export const isTimeOverlap = (
  aStart: string,
  aEnd: string,
  bStart: string,
  bEnd: string,
) => aStart < bEnd && aEnd > bStart;

// 수정 시 기존 체험 상세 데이터를 폼 초기값으로 매핑
export const defaultActivityFormValues = (
  activity: ActivityDetailResponse,
): ActivityFormValues => {
  return {
    title: activity.title,
    category: activity.category,
    description: activity.description,
    address: activity.address,
    price: activity.price,
    schedules: activity.schedules.map((schedule) => ({
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })),
    bannerImageUrl: activity.bannerImageUrl,
    subImageUrls: activity.subImages.map((subImage) => subImage.imageUrl),
  };
};

// File 객체는 업로드 후 URL 반환, 기존 URL string은 그대로 사용
export const getImageUrl = async (image: string | File) => {
  if (typeof image === "string") {
    return image;
  }

  try {
    const response = await uploadActivityImage(image);
    return response.activityImageUrl;
  } catch {
    showToast.error("이미지 업로드에 실패했어요. 잠시 후 다시 시도해 주세요.");
    throw new Error("IMAGE_UPLOAD_ERROR");
  }
};
