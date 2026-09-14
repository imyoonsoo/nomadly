"use client";

import dynamic from "next/dynamic";

export const ProfileEditForm = dynamic(
  () => import("./ProfileEditForm").then((data) => data.ProfileEditForm),
  { ssr: false },
);
