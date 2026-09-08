import type { Metadata } from "next";
import { PRIVACY_POLICY } from "@/constants/policy";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

const PrivacyPage = () => {
  const { version, title, description, updatedAt, sections } = PRIVACY_POLICY;
  return (
    <div className="flex min-h-screen flex-col">
      <div className="mx-auto mt-12 mb-14 w-full max-w-250 flex-1 gap-12 p-7.5 md:mt-20">
        <div className="mb-18 flex flex-col items-start justify-between gap-5 border-b border-gray-200 pb-15">
          <h1 className="text-32-bold mb-6 text-gray-950">{title}</h1>
          <p className="text-14-medium md:text-16-medium leading-8 break-keep text-gray-800">
            {description}
          </p>
          <div className="flex items-center gap-4">
            <span className="text-14-medium text-gray-400">
              version {version}
            </span>
            <span className="text-14-medium text-gray-400">|</span>
            <span className="text-14-medium text-gray-400">
              최종 수정일: {updatedAt}
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-16">
          {sections.map((section) => (
            <section key={section.id}>
              <h2 className="text-16-bold md:text-18-bold mb-3">
                {section.title}
              </h2>
              <p className="text-14-medium mb-6 leading-6 text-gray-800">
                {section.content}
              </p>
              <ul className="bg-gray-25 space-y-1 rounded-xl p-8">
                {section.subItems.map((subItem) => (
                  <li
                    key={subItem}
                    className="text-14-medium flex gap-3 text-gray-700"
                  >
                    <span className="bg-primary-500 mt-2 h-1 w-1 shrink-0 rounded-full" />
                    <span>{subItem}</span>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
