import MobileReservationStatusModal from "@/features/reservation-status/components/modal/MobileReservationStatusModal";
import PcReservationStatusModal from "@/features/reservation-status/components/modal/PcReservationStatusModal";

interface ReservationModalProps {
  open: boolean;
  activityId: number;
  selectedDate: string | null;
  onClose: () => void;
}

export const ReservationModal = ({
  open,
  activityId,
  selectedDate,
  onClose,
}: ReservationModalProps) => {
  if (!open || !selectedDate) {
    return null;
  }

  return (
    <>
      <PcReservationStatusModal
        activityId={activityId}
        selectedDate={selectedDate}
        onClose={onClose}
      />

      <MobileReservationStatusModal
        activityId={activityId}
        selectedDate={selectedDate}
        onClose={onClose}
      />
    </>
  );
};
