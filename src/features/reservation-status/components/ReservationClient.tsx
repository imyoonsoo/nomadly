"use client";

import dynamic from "next/dynamic";

export const ReservationPage = dynamic(
  () => import("./ReservationPage").then((data) => data.ReservationPage),
  { ssr: false },
);
