"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import type { HeaderProps } from "./type";
import Link from "next/link";

import { BackButton } from "@/components/BackButton/BackButton";

import HeaderUserMenu from "./HeaderUserMenu";
import HeaderGuestMenu from "./HeaderGuestMenu";

import LogoVertical from "@/assets/images/logo-vertical.svg";
import LogoSymbol from "@/assets/images/logo-symbol.svg";

import Recommendation from "@/assets/icons/recommendation.svg";
import Game from "@/assets/icons/game.svg";

const Header = ({ user }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const isHome = usePathname() === "/";

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 z-[110] flex h-12 w-full justify-center transition-colors duration-300 md:z-100 md:h-20 ${
        isScrolled
          ? "bg-white shadow-[0_4px_12px_rgba(0,0,0,0.08)]"
          : "bg-transparent shadow-none"
      }`}
    >
      <div className="mx-auto flex w-full max-w-380 items-center justify-between px-6 md:px-7.5">
        <div className="flex items-center gap-3 md:gap-4">
          {!isHome && <BackButton />}
          <Link href="/" className="flex cursor-pointer items-center py-2.5">
            <LogoVertical
              aria-label="로고"
              width={200}
              height={32}
              className="hidden md:block"
            />
            <LogoSymbol
              aria-label="로고"
              width={28}
              height={28}
              className="block md:hidden"
            />
          </Link>
        </div>
        <nav className="flex items-center gap-4 md:gap-6">
          <Link
            href="/recommendation"
            prefetch={false}
            className="flex items-center justify-center transition-transform hover:scale-115 active:scale-100"
            aria-label="추천 페이지"
          >
            <Recommendation className="h-5 w-5 text-cyan-500 hover:text-indigo-500 md:h-6 md:w-6" />
          </Link>

          <Link
            href="/game"
            prefetch={false}
            className="flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
            aria-label="게임 페이지"
          >
            <Game className="hover:text-primary-500 h-6 w-6 text-yellow-500 transition-all duration-200 hover:rotate-12 md:h-7 md:w-7" />
          </Link>

          {user ? (
            <HeaderUserMenu user={user} isScrolled={isScrolled} />
          ) : (
            <HeaderGuestMenu />
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
