"use client";

import dynamic from "next/dynamic";

export const ActivitiesSection = dynamic(
  () => import("./ActivitiesSection").then((data) => data.ActivitiesSection),
  { ssr: false },
);
