import EmptyImage from "@/assets/images/empty.svg";

interface EmptyCardListProps {
  message?: string;
  image?: React.ReactNode;
  action?: React.ReactNode;
}

const EmptyCardList = ({
  message = "아직 등록한 체험이 없어요",
  image = <EmptyImage className="h-45.5 w-45.5" />,
  action,
}: EmptyCardListProps) => {
  return (
    <div className="mt-20 flex flex-col items-center justify-center">
      {image}
      <p className="text-18-medium text-center text-gray-600">{message}</p>
      {action}
    </div>
  );
};

export default EmptyCardList;
