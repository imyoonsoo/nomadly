"use client";

import clientFetch from "@/lib/http/clientFetch";
import { MyProfileResponse } from "./type";

export const getMyProfile = async (): Promise<MyProfileResponse> => {
  const { data } = await clientFetch.get<MyProfileResponse>("/users/me");

  return data;
};
