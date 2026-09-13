"use client";
import FilterButton from "@/components/FilterButton/FilterButton";
import { ActivitiesCard } from "./ActivitiesCard";
import { CardListProps } from "./type";
import { AltDown } from "@/constants/icons";
import { useEffect, useState, useRef } from "react";
import { Pagination } from "@/components/Pagination/Pagination";

const CATEGORIES = [
  {
    id: 1,
    name: "전체",
  },
  {
    id: 2,
    name: "문화 · 예술",
    icon: "🎨",
  },
  {
    id: 3,
    name: "식음료",
    icon: "🍰",
  },
  {
    id: 4,
    name: "스포츠",
    icon: "🏓",
  },
  {
    id: 5,
    name: "투어",
    icon: "🚩",
  },
  {
    id: 6,
    name: "관광",
    icon: "🚆",
  },
  {
    id: 7,
    name: "웰빙",
    icon: "🍀",
  },
];

export const ActivitiesList = ({ items, keyword }: CardListProps) => {
  const [page, setPage] = useState(1);
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [selectedText, setSelectedText] = useState("최신순");
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const OPTIONS = ["최신순", "인기순", "가격순"];

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const sortDropdownRef = useRef<HTMLDivElement>(null);
  const handleSortOptionClick = (option: string) => {
    setSelectedText(option);
    setIsOpen(false);
  };
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node;

      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(target)
      ) {
        setIsOpenCategory(false);
      }

      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // 체험리스트 필터링
  const selectedCategoryItem = CATEGORIES.find(
    (item) => item.name === selectedCategory,
  );
  const filteredItems =
    selectedCategory === "전체"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (selectedText === "최신순") {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (selectedText === "인기순") {
      return b.reviewCount - a.reviewCount;
    }
    if (selectedText === "가격순") {
      return a.price - b.price;
    }
    return 0;
  });
  const isSearchMode = !!keyword?.trim();
  const ITEMS_PER_PAGE = 8;
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedItems = sortedItems.slice(startIndex, endIndex);

  return (
    <div className="relative w-full">
      {keyword === "" && (
        <div className="mb-4 flex items-end justify-between md:mb-6.25">
          <div>
            <div
              ref={categoryDropdownRef}
              className="relative block w-37.5 md:hidden"
            >
              <button
                type="button"
                className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-5 py-2.5"
                onClick={() => setIsOpenCategory((prev) => !prev)}
              >
                {selectedCategoryItem?.icon}
                {selectedCategory}
                <span>
                  <AltDown
                    className={`${isOpenCategory ? "rotate-180" : ""} transition`}
                  />
                </span>
              </button>

              {isOpenCategory && (
                <div className="absolute top-12.5 right-0 z-10 flex w-full flex-col gap-3 rounded-[15px] bg-white p-3 text-center shadow-[0_4px_16px_rgb(187_187_187/50%)]">
                  {CATEGORIES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(item.name);
                        setIsOpenCategory(false);
                        setPage(1);
                      }}
                      className="flex items-center gap-2"
                    >
                      {item.icon}
                      <span>{item.name}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="hidden gap-1 md:flex">
              {CATEGORIES.map((item) => (
                <FilterButton
                  key={item.id}
                  onClick={() => {
                    setSelectedCategory(item.name);
                    setPage(1);
                  }}
                  className={`flex gap-4 ${
                    selectedCategory === item.name
                      ? "bg-primary-500! border-primary-500 text-white!"
                      : ""
                  }`}
                >
                  {item.icon}
                  <span>{item.name}</span>
                </FilterButton>
              ))}
            </div>
          </div>

          {/* 가격순 인기순 정렬 */}
          <div ref={sortDropdownRef} className="relative">
            <button
              type="button"
              className="flex h-9 items-center px-3"
              onClick={() => setIsOpen((prev) => !prev)}
            >
              {selectedText}
              <span>
                <AltDown
                  className={`${isOpen ? "rotate-180" : ""} transition`}
                />
              </span>
            </button>

            {isOpen && (
              <ul className="absolute top-10 right-0 z-10 flex w-full flex-col gap-3 rounded-[15px] bg-white p-3 text-center shadow-[0_4px_16px_rgb(187_187_187/50%)]">
                {OPTIONS.map((option) => (
                  <li key={option}>
                    <button
                      type="button"
                      onClick={() => {
                        handleSortOptionClick(option);
                      }}
                    >
                      {option}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
      <div>
        {!isSearchMode && sortedItems.length === 0 ? (
          <div className="flex flex-col items-center pt-30">
            <p className="text-center text-gray-400">
              {selectedCategory}에 등록된 체험이 없습니다.
            </p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 md:gap-6">
            {paginatedItems.map((item) => (
              <div
                key={item.id}
                className="w-[calc((100%-16px)/2)] md:w-[calc((100%-72px)/4)]"
              >
                <ActivitiesCard {...item} />
              </div>
            ))}
          </div>
        )}
      </div>
      {sortedItems.length > 0 && totalPages > 1 && (
        <div className="mt-7.5 flex justify-center">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </div>
  );
};
