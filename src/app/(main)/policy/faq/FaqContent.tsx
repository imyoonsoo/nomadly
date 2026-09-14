"use client";

import { FAQ_CONTENT } from "@/constants/policy";
import { useState } from "react";
import { LogoMobile } from "@/constants/images";

export const FaqContent = () => {
  const { title, description, userItems, hostItems } = FAQ_CONTENT;
  const [activeTab, setActiveTab] = useState<"user" | "host">("user");

  const faqItems = activeTab === "user" ? userItems : hostItems;

  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto mt-12 mb-14 w-full max-w-300 flex-1 gap-12 p-7.5 md:mt-20">
        <div className="mb-10 flex flex-col items-center justify-center gap-1.5">
          <span className="text-16-bold text-primary-500 mb-3">FAQ</span>
          <h1 className="text-32-bold">{title}</h1>
          <p className="text-14-medium text-gray-500">{description}</p>
        </div>

        <div className="flex w-full flex-col items-center justify-center">
          <div className="-mb-14 flex h-16 w-16 items-center justify-center overflow-hidden rounded-full">
            <LogoMobile className="h-14 w-14 md:h-16 md:w-16" />
          </div>
          <div className="mx-auto mt-8 flex w-fit rounded-full bg-gray-100 p-1">
            <button
              type="button"
              onClick={() => setActiveTab("user")}
              className={`text-14-bold md:text-16-bold rounded-full px-6 py-2 transition-all duration-300 ${
                activeTab === "user"
                  ? "bg-white text-gray-950 shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              이용자
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("host")}
              className={`text-14-bold md:text-16-bold rounded-full px-6 py-2 transition-all duration-300 ${
                activeTab === "host"
                  ? "text-primary-600 bg-white shadow-sm"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              호스트
            </button>
          </div>

          <div className="mt-10 w-full space-y-4">
            {faqItems.map((item) => (
              <details
                key={item.id}
                className="group open:border-primary-500 rounded-2xl border border-gray-200 bg-white px-5 shadow-sm transition-all duration-300 open:shadow-md md:px-7"
              >
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 md:py-6 [&::-webkit-details-marker]:hidden">
                  <div className="flex min-w-0 items-center gap-4">
                    <span className="bg-primary-50 text-14 group-open:bg-primary-500 flex h-9 w-9 shrink-0 items-center justify-center rounded-full font-semibold text-gray-600 group-open:text-white">
                      {String(item.id).padStart(2, "0")}
                    </span>

                    <span className="text-16-medium group-open:text-primary-500 md:text-18-medium break-keep text-gray-800 transition-colors">
                      {item.question}
                    </span>
                  </div>

                  <span className="group-open:bg-primary-100 relative h-8 w-8 shrink-0 rounded-full bg-gray-100 transition-all duration-300">
                    <span className="group-open:bg-primary-500 absolute top-1/2 left-1/2 h-0.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500 transition-colors" />
                    <span className="group-open:bg-primary-500 absolute top-1/2 left-1/2 h-3.5 w-0.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gray-500 transition-all duration-300 group-open:rotate-90 group-open:opacity-0" />
                  </span>
                </summary>

                <div className="border-t border-gray-100 pt-4 pb-6 md:pb-7">
                  <p className="text-14-medium md:text-16-medium pl-13 leading-7.5 break-keep whitespace-pre-wrap text-gray-600 md:pl-13">
                    {item.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
