"use client";

import { useEffect, useRef, useState } from "react";
import { ReservationModalContent } from "@/features/reservation-status/components/modal/ReservationModalContent";

interface MobileReservationStatusModalProps {
  selectedDate: string;
  activityId: number;
  onClose: () => void;
}

const DEFAULT_SHEET_Y = 120;
const FULL_PAGE_Y = 0;
const CLOSE_THRESHOLD = 180;
const FULL_PAGE_THRESHOLD = -80;

const MobileReservationStatusModal = ({
  selectedDate,
  activityId,
  onClose,
}: MobileReservationStatusModalProps) => {
  const startYRef = useRef(0);
  const startSheetYRef = useRef(DEFAULT_SHEET_Y);

  const [sheetY, setSheetY] = useState(DEFAULT_SHEET_Y);
  const [isFullPage, setIsFullPage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  useEffect(() => {
    setSheetY(DEFAULT_SHEET_Y);
    setIsFullPage(false);
  }, [selectedDate]);

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    startYRef.current = e.touches[0].clientY;
    startSheetYRef.current = sheetY;
    setIsDragging(true);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const currentY = e.touches[0].clientY;
    const diffY = currentY - startYRef.current;
    const nextY = startSheetYRef.current + diffY;

    setSheetY(Math.max(FULL_PAGE_Y, nextY));
  };

  const handleTouchEnd = () => {
    setIsDragging(false);

    if (sheetY >= CLOSE_THRESHOLD) {
      onClose();
      return;
    }

    if (sheetY <= DEFAULT_SHEET_Y + FULL_PAGE_THRESHOLD) {
      setSheetY(FULL_PAGE_Y);
      setIsFullPage(true);
      return;
    }

    setSheetY(DEFAULT_SHEET_Y);
    setIsFullPage(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 xl:hidden">
      <div
        className={`fixed inset-x-0 top-0 h-screen bg-white shadow-xl ${
          isFullPage ? "rounded-none" : "rounded-t-[24px]"
        } ${isDragging ? "" : "transition-transform duration-300 ease-out"}`}
        style={{
          transform: `translateY(${sheetY}px)`,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className="flex h-8 items-center justify-center"
        >
          <div className="h-1 w-10 rounded-full bg-gray-300" />
        </div>

        <div className="h-[calc(100vh-32px)] overflow-hidden px-5 pb-8">
          <ReservationModalContent
            selectedDate={selectedDate}
            activityId={activityId}
            onClose={onClose}
            isFullPage={isFullPage}
          />
        </div>
      </div>
    </div>
  );
};

export default MobileReservationStatusModal;
