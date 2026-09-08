// 사이트 정보
export const SITE_NAME = "Nomadly";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SITE_DESCRIPTION =
  "Nomadly는 문화, 예술, 식음료, 스포츠, 투어, 관광, 웰빙 체험을 찾아 예약하는 플랫폼입니다. 체험을 이용하는 게스트와 운영하는 호스트를 모두 지원합니다.";

export const OG_IMAGE = {
  url: "/og-image.png",
  width: 1208,
  height: 638,
  alt: "Nomadly 서비스 이미지",
} as const;
