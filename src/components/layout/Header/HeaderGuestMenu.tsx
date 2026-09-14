import Link from "next/link";
import type { AuthLink } from "./type";

const AUTH_LINKS: AuthLink[] = [
  {
    href: "/login",
    text: "로그인",
  },
  {
    href: "/signup",
    text: "회원가입",
  },
];

const HeaderGuestMenu = () => {
  return (
    <ul className="flex items-center justify-center gap-1 md:gap-3">
      {AUTH_LINKS.map(({ href, text }) => (
        <li
          key={href}
          className="text-14-medium hover:text-primary-500 rounded px-3 py-2 text-gray-950 transition active:scale-95 active:opacity-70 md:px-4 md:py-3"
        >
          <Link href={href} prefetch={false}>
            {text}
          </Link>
        </li>
      ))}
    </ul>
  );
};

export default HeaderGuestMenu;
