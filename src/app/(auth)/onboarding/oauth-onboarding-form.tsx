"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Building,
  Phone,
  Sparkles,
  Smartphone,
  Zap,
} from "lucide-react";
import * as libphonenumber from "libphonenumber-js";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { orpcQC } from "@/lib/orpc";
import {
  OnBoardOAuthUserSchema,
  OTPCodeSchema,
  VerifyPhoneOTPSchema,
} from "@/schemas/auth";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { PhoneInput } from "@/components/ui/phone-input";
import { authClient } from "@/lib/auth-client";

// Logo Component
const LogoIcon = () => (
  <motion.div
    whileHover={{ scale: 1.05, rotate: [0, -5, 5, 0] }}
    transition={{ duration: 0.3 }}
    className="w-10 h-10 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-center shadow-lg"
  >
    <Smartphone className="w-6 h-6 text-white" />
  </motion.div>
);

export default function OAuthOnboardingForm() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "otp">("details");

  // OAuth user details form
  const detailsForm = useForm<OnBoardOAuthUserSchema>({
    resolver: zodResolver(OnBoardOAuthUserSchema),
    defaultValues: {
      phoneNumber: "",
      companyName: "",
    },
    mode: "onChange",
  });

  // Phone OTP verification form
  const otpForm = useForm<Pick<VerifyPhoneOTPSchema, "code">>({
    resolver: zodResolver(OTPCodeSchema),
    defaultValues: {
      code: "",
    },
  });

  const onboardOAuthMutation = useMutation(
    orpcQC.auth.onBoardOAuthUser.mutationOptions({
      onSuccess: (data) => {
        setStep("otp");
        toast.success(data.message || "Verification code sent to your phone");
      },
      onError: (err) => {
        if (err.message.includes("Phone number already exists")) {
          detailsForm.setError("phoneNumber", {
            message: "Phone number already exists",
          });

          toast(err.message, {
            description:
              "Enter a new number or login with existing phone number!!",
            duration: 1000 * 30, // 30 seconds
            position: "top-center",
            richColors: true,
            action: {
              label: "Yes, Login",
              onClick: async () => {
                detailsForm.reset();
                await authClient.signOut();
                router.replace("/login");
              },
            },
          });
        } else {
          toast.error(err.message);
        }
      },
    })
  );

  const otpVerifyMutation = useMutation(
    orpcQC.auth.verifyOnboardPhoneOTP.mutationOptions({
      onSuccess: (data) => {
        toast.success("Phone verified successfully! Completing onboarding...");
        router.replace("/");
      },
      onError: (err) => toast.error(err.message),
    })
  );

  const onDetailsSubmit = async (data: OnBoardOAuthUserSchema) => {
    const isValid = libphonenumber.isValidPhoneNumber(data.phoneNumber);
    if (!isValid) {
      detailsForm.setError("phoneNumber", {
        message: "Please enter a valid phone number",
      });
      return;
    }
    onboardOAuthMutation.mutate(data);
  };

  const onOTPSubmit = async (data: Pick<VerifyPhoneOTPSchema, "code">) =>
    otpVerifyMutation.mutate({
      code: data.code,
      phoneNumber: detailsForm.getValues("phoneNumber"),
    });

  const handleBackToDetails = () => {
    setStep("details");
    otpForm.reset();
  };

  const isLoading =
    onboardOAuthMutation.isPending || otpVerifyMutation.isPending;

  return (
    <div className="relative max-w-100 mx-auto bg-white rounded-xl p-7 shadow-lg w-full z-10 space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <Link href="/" aria-label="go home">
          <LogoIcon />
        </Link>
        <motion.h1
          className="mb-1 mt-4 text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          Complete Your Setup
        </motion.h1>
        <motion.p
          className="text-sm text-slate-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {step === "details"
            ? "Add your phone number and company details"
            : "Verify your phone number to continue"}
        </motion.p>
      </motion.div>

      <motion.hr
        className="my-4 border-dashed border-slate-300"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: 0.6, duration: 0.4 }}
      />

      <AnimatePresence mode="wait">
        {step === "details" ? (
          <motion.div
            key="details-form"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Form {...detailsForm}>
              <form
                onSubmit={detailsForm.handleSubmit(onDetailsSubmit)}
                className="space-y-6"
              >
                {/* Phone Number */}
                <FormField
                  control={detailsForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <motion.div
                      className="space-y-2"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium"
                      >
                        Phone Number
                      </Label>
                      <FormControl>
                        <PhoneInput
                          {...field}
                          placeholder="Enter your phone number"
                          defaultCountry="IN"
                          className="transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/10"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600" />
                    </motion.div>
                  )}
                />

                {/* Company Name */}
                <FormField
                  control={detailsForm.control}
                  name="companyName"
                  render={({ field }) => (
                    <motion.div
                      className="space-y-2"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Label
                        htmlFor="companyName"
                        className="block text-sm font-medium"
                      >
                        Company Name
                      </Label>
                      <FormControl>
                        <div className="relative">
                          <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                          <Input
                            {...field}
                            placeholder="Enter company name"
                            className="pl-10 transition-all duration-200 focus:shadow-lg focus:shadow-blue-500/10"
                          />
                        </div>
                      </FormControl>
                      <FormMessage className="text-sm text-red-600" />
                    </motion.div>
                  )}
                />

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant={"gradient"}
                    disabled={isLoading}
                    className="w-full disabled:opacity-90"
                  >
                    {isLoading ? (
                      <Loader>Sending OTP...</Loader>
                    ) : (
                      <>
                        Continue
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </motion.div>
              </form>
            </Form>
          </motion.div>
        ) : (
          <motion.div
            key="otp-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Form {...otpForm}>
              <form
                onSubmit={otpForm.handleSubmit(onOTPSubmit)}
                className="space-y-6"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 }}
                  className="text-center text-sm text-slate-600 mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg"
                >
                  Verification code sent to{" "}
                  <span className="font-medium text-blue-700">
                    {detailsForm.getValues("phoneNumber")}
                  </span>
                </motion.div>

                <FormField
                  control={otpForm.control}
                  name="code"
                  render={({ field }) => (
                    <motion.div
                      className="space-y-2"
                      whileFocus={{ scale: 1.01 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Label
                        htmlFor="code"
                        className="block text-sm font-medium"
                      >
                        Verification Code
                      </Label>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Enter 6-digit code"
                          className="text-center text-lg font-mono tracking-wider border-slate-200 focus:border-blue-400 focus:shadow-lg focus:shadow-blue-500/10 transition-all duration-200"
                          maxLength={6}
                          autoComplete="one-time-code"
                        />
                      </FormControl>
                      <FormMessage className="text-sm text-red-600" />
                    </motion.div>
                  )}
                />

                <div className="space-y-3">
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      type="submit"
                      disabled={isLoading}
                      variant={"gradient"}
                      className="w-full disabled:opacity-90"
                    >
                      {isLoading ? (
                        <Loader>Verifying...</Loader>
                      ) : (
                        <>
                          Complete Setup
                          <ArrowRight className="ml-1 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </motion.div>

                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBackToDetails}
                      className="w-full text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back to Details
                    </Button>
                  </motion.div>
                </div>
              </form>
            </Form>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

{
  /* Footer section */
}
const Footer = () => {
  return (
    <motion.div
      className="bg-slate-50/80 backdrop-blur-sm rounded-xl border border-slate-100 p-1"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
    >
      <p className="text-center text-sm text-slate-600">
        By continuing, you agree to our{" "}
        <Button
          asChild
          variant="link"
          className="px-1 h-auto text-sm text-blue-600 hover:text-blue-700"
        >
          <span>Terms of Service</span>
        </Button>{" "}
        and{" "}
        <Button
          asChild
          variant="link"
          className="px-1 h-auto text-sm text-blue-600 hover:text-blue-700"
        >
          <span>Privacy Policy</span>
        </Button>
      </p>
    </motion.div>
  );
};

{
  /* Subtle animated background elements */
}
export const AnimatedBG = () => {
  return (
    <div className="absolute inset-0">
      <motion.div
        className="absolute inset-0 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.15), transparent 50%)",
            "radial-gradient(circle at 70% 60%, rgba(147, 51, 234, 0.15), transparent 50%)",
            "radial-gradient(circle at 30% 40%, rgba(59, 130, 246, 0.15), transparent 50%)",
          ],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />

      {/* Floating icons - minimal count */}
      <motion.div
        className="absolute top-20 right-20 text-blue-300/30"
        animate={{ y: [-10, -20, -10], rotate: [0, 180, 360, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      >
        <Sparkles size={20} />
      </motion.div>

      <motion.div
        className="absolute bottom-20 left-20 text-purple-300/30"
        animate={{ y: [-15, -25, -15], rotate: [0, -180, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 3,
        }}
      >
        <Zap size={18} />
      </motion.div>
    </div>
  );
};
