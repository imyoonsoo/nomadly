import type { Metadata } from "next";
import SignupForm from "@/features/signup/components/SignupForm";

export const metadata: Metadata = {
  title: "회원가입",
};

const SignupPage = () => <SignupForm />;

export default SignupPage;
