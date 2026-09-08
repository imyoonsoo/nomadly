import type { Metadata } from "next";
import ValidationLoginForm from "@/features/login/components/ValidationLoginForm";

export const metadata: Metadata = {
  title: "로그인",
};

const LoginPage = () => <ValidationLoginForm />;

export default LoginPage;
