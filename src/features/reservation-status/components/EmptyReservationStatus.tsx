import { Empty } from "@/constants/images";

interface EmptyReservationStatusProps {
  message: string;
  image?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyReservationStatus = ({
  message,
  image = <Empty className="h-45.5 w-45.5" />,
  action,
}: EmptyReservationStatusProps) => {
  return (
    <div className="flex min-h-90 flex-col items-center justify-center">
      {image}

      <p className="text-18-medium mt-6 text-gray-600">{message}</p>
      {action}
    </div>
  );
};

export default EmptyReservationStatus;
