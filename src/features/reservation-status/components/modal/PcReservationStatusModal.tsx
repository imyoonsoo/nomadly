"use client";

import { useRef, useState } from "react";
import { ReservationModalContent } from "@/features/reservation-status/components/modal/ReservationModalContent";

interface PcReservationStatusModalProps {
  selectedDate: string;
  activityId: number;
  onClose: () => void;
}

const PcReservationStatusModal = ({
  selectedDate,
  activityId,
  onClose,
}: PcReservationStatusModalProps) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const dragStartRef = useRef({
    mouseX: 0,
    mouseY: 0,
    modalX: 0,
    modalY: 0,
  });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    dragStartRef.current = {
      mouseX: e.clientX,
      mouseY: e.clientY,
      modalX: position.x,
      modalY: position.y,
    };

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const diffX = moveEvent.clientX - dragStartRef.current.mouseX;
      const diffY = moveEvent.clientY - dragStartRef.current.mouseY;

      setPosition({
        x: dragStartRef.current.modalX + diffX,
        y: dragStartRef.current.modalY + diffY,
      });
    };

    const handleMouseUp = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="pointer-events-none fixed inset-0 z-50 hidden xl:block">
      <div
        className="pointer-events-auto fixed w-85 rounded-3xl bg-white p-6 shadow-[0_4px_20px_rgba(0,0,0,0.2)]"
        style={{
          left: "50%",
          top: "50%",
          transform: `translate(calc(-50% + ${position.x}px), calc(-50% + ${position.y}px))`,
        }}
      >
        <div onMouseDown={handleMouseDown} className="cursor-move">
          <ReservationModalContent
            selectedDate={selectedDate}
            activityId={activityId}
            onClose={onClose}
          />
        </div>
      </div>
    </div>
  );
};

export default PcReservationStatusModal;
