"use client";

import dynamic from "next/dynamic";

export const ReservedCardList = dynamic(
  () => import("./ReservedCardList").then((data) => data.ReservedCardList),
  { ssr: false },
);
