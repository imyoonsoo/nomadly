"use client";
import Image from "next/image";
import Link from "next/link";
import { CardListProps } from "./type";
import { ArrowRight } from "@/constants/icons";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import type { Swiper as SwiperType } from "swiper";
import "swiper/css";
import { NoImg } from "@/constants/images";

const MainBanner = ({ items }: CardListProps) => {
  const swiperRef = useRef<SwiperType | null>(null);
  if (items.length === 0) {
    return null;
  }

  const bestItems = [...items]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5);

  return (
    <div className="relative">
      <Swiper
        key={items.length}
        modules={[Autoplay]}
        slidesPerView={1}
        autoplay={{ delay: 5000 }}
        loop
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        className="overflow-hidden rounded-3xl"
      >
        {/* index로 첫 배너 판별 ➝ priority 우선 로딩해 LCP 개선 */}
        {bestItems.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="relative aspect-[1/0.6] w-full md:aspect-[1/0.5]">
              <Link href={`/activities/${item.id}`}>
                <div className="relative h-full w-full">
                  <Image
                    src={item.bannerImageUrl || NoImg}
                    alt={item.title}
                    className="object-cover"
                    fill
                    priority={index === 0}
                    sizes="(max-width: 1200px) 100vw, 1200px"
                  />
                  <div className="absolute top-0 left-0 h-full w-full bg-linear-to-t from-black to-transparent opacity-80"></div>
                </div>

                <div className="absolute top-1/2 w-full px-10 text-center text-white md:top-[60%]">
                  <p className="text-18-medium md:text-32-bold mb-2 truncate">
                    {item.title}
                  </p>
                  <p className="text-14-medium md:text-18-medium">
                    {new Date().getMonth() + 1}월의 인기 체험 BEST 🔥
                  </p>
                </div>
              </Link>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <button
        type="button"
        className="hover:bg-primary-500 absolute top-1/2 -right-5 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] [&_svg]:size-5 [&_svg]:text-gray-900 hover:[&_svg]:text-white"
        onClick={() => swiperRef.current?.slideNext()}
        aria-label="다음 배너"
      >
        <ArrowRight />
      </button>

      <button
        type="button"
        className="hover:bg-primary-500 absolute top-1/2 -left-5 z-20 flex size-11 -translate-y-1/2 items-center justify-center rounded-full bg-white shadow-[0_2px_8px_rgba(0,0,0,0.15)] [&_svg]:size-5 [&_svg]:text-gray-900 hover:[&_svg]:text-white"
        onClick={() => swiperRef.current?.slidePrev()}
        aria-label="이전 배너"
      >
        <ArrowRight className="rotate-180" />
      </button>
    </div>
  );
};

export default MainBanner;
