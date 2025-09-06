import { getMeServer } from "@/middleware";

import OAuthOnboardingForm from "./oauth-onboarding-form";
import OnboardingForm, { AnimatedBG } from "./onboarding-form";

export const metadata = {
  title: "Onboarding",
  description:
    "Welcome to the onboarding process where you can set up your profile. Complete your profile setup to personalize your experience and unlock all features.",
};

export default async function OnboardingPage() {
  const user = await getMeServer();

  if (!user) return null;
  return (
    <section className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900 p-4 relative grid place-items-center">
      <AnimatedBG />
      {user.isOAuth ? <OAuthOnboardingForm /> : <OnboardingForm />}
    </section>
  );
}
