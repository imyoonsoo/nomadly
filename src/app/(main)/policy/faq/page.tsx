import type { Metadata } from "next";
import { FaqContent } from "./FaqContent";

export const metadata: Metadata = {
  title: "FAQ",
};

const FaqPage = () => {
  return <FaqContent />;
};

export default FaqPage;
