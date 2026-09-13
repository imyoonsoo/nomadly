"use client";

import dynamic from "next/dynamic";

export const ReservationStatusPage = dynamic(
  () =>
    import("./ReservationStatusPage").then((data) => data.ReservationStatusPage),
  { ssr: false },
);
