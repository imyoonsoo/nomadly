import { useMutation, useQueryClient } from "@tanstack/react-query";
import { reservationStatusKeys } from "@/features/reservation-status/queries/query";
import { updateReservationStatus } from "@/features/reservation-status/api/reservationStatus";

export const useUpdateReservationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateReservationStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: reservationStatusKeys.all,
      });
    },
  });
};
