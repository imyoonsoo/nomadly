import { useSuspenseQuery } from "@tanstack/react-query";
import { getMyProfile } from "../api";

export const useGetProfile = () => {
  return useSuspenseQuery({
    queryKey: ["myProfile"],
    queryFn: getMyProfile,
  });
};
