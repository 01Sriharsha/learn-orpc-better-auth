import { APP_TITLE } from "@/utils/constants";

import LoginForm, { AnimatedBG } from "./login-form";

export const metadata = {
  title: "Login",
  description: `Secure login to access ${APP_TITLE}. Connect with suppliers, manage your profile, and explore business deals.`,
};

export default async function LoginPage() {
  return (
    <section className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 px-4 relative grid place-items-center">
      <AnimatedBG />
      <LoginForm />
    </section>
  );
}
