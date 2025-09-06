import { ORPCError } from "@orpc/server";

import { auth } from "@/lib/auth";
import {
  LoginSchema,
  OnBoardOAuthUserSchema,
  OnBoardUserSchema,
  VerifyEmailOTPSchema,
  VerifyPhoneOTPSchema,
} from "@/schemas/auth";
import { router } from "@/server/router";
import { db } from "@/lib/db";
import { User as DBUser } from "@prisma/client";

const tags = ["Authentication"];

const getSession = async (headers: Headers) => {
  const session = await auth.api.getSession({
    headers,
  });
  if (!session)
    throw new ORPCError("UNAUTHORIZED", { message: "Session Expired!" });
  return session;
};

const displayUser = (user: Partial<DBUser>) => ({
  id: user?.id || "",
  name: user?.name || "",
  email: user?.email || "",
  image: user?.image || "",
  phoneNumber: user?.phoneNumber || "",
  businessEmail: user?.businessEmail || "",
  role: user?.role || "",
  isOnboarded: user?.isOnboarded || false,
  isOAuth: user?.isOAuth || false,
});

export const hello = router
  .route({
    method: "GET",
    tags,
    path: "/auth/hello",
    summary: "Hello Route",
  })
  .handler(async () => {
    return { message: "Hello world", data: null };
  });

export const login = router
  .route({ method: "POST", tags, summary: "Login", path: "/auth/login" })
  .input(LoginSchema)
  .handler(async ({ input, context }) => {
    const response = await auth.api.sendPhoneNumberOTP({
      body: { phoneNumber: input.phoneNumber },
      headers: context.reqHeaders,
      asResponse: true,
    });
    if (!response.ok)
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: "Failed to send OTP",
      });
    const data = await response.json();
    return { message: data?.message || "OTP sent successfully" };
  });

export const verifyLoginPhoneOTP = router
  .route({
    method: "POST",
    tags,
    summary: "Verify Login",
  })
  .input(VerifyPhoneOTPSchema)
  .handler(async ({ input, context }) => {
    try {
      const { status } = await auth.api.verifyPhoneNumber({
        body: {
          code: input.code,
          phoneNumber: input.phoneNumber,
          disableSession: false, // create a session
        },
        headers: context.reqHeaders,
      });

      if (!status)
        throw new ORPCError("NOT_ACCEPTABLE", { message: "Invalid OTP" });

      const savedUser = await db.user.findUnique({
        where: { phoneNumber: input.phoneNumber },
      });

      if (!savedUser)
        throw new ORPCError("NOT_FOUND", { message: "User not found" });

      // If the user is not onboarded, revoke the session immediately
      if (!savedUser.isOnboarded) {
        return { message: "OTP verified successfully" };
      } else {
        return { message: `Welcome ${savedUser.name}`, data: savedUser };
      }
    } catch (error: any) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: error?.message ?? "Failed to verify OTP",
        cause: error,
      });
    }
  });

export const onBoardUser = router
  .route({
    method: "POST",
    tags,
    path: "/auth/onboard",
    summary: "Onboard User",
  })
  .input(OnBoardUserSchema)
  .handler(async ({ context, input }) => {
    try {
      const session = await getSession(context.reqHeaders!);

      const emailAlreadyExists = await db.user.findFirst({
        where: {
          NOT: {
            id: session.user.id,
          },
          OR: [
            { email: input.businessEmail },
            { businessEmail: input.businessEmail },
          ],
        },
      });

      if (emailAlreadyExists) {
        throw new ORPCError("CONFLICT", { message: "Email already exists" });
      }

      //save the details of the user to db
      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: {
          ...input,
          name: `${input.firstName} ${input.lastName}`,
          email: input.businessEmail,
        },
      });

      // send verification OTP to business email
      const otpCode = await auth.api.createVerificationOTP({
        body: {
          type: "email-verification",
          email: input.businessEmail,
        },
        headers: context.reqHeaders,
      });

      console.log("Response from createVerificationOTP", otpCode);

      if (!otpCode) {
        throw new Error("Failed to send verification OTP");
      }

      return { message: "OTP sent to business email" };
    } catch (error: any) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: error?.message || "Failed to onboard user",
        cause: error,
      });
    }
  });

export const verifyOnboardEmailOTP = router
  .route({
    method: "POST",
    tags,
    path: "/auth/onboard-verify",
    summary: "Verify Email & Onboard",
  })
  .input(VerifyEmailOTPSchema)
  .handler(async ({ input, context }) => {
    try {
      const session = await getSession(context.reqHeaders!);
      const { status } = await auth.api.verifyEmailOTP({
        body: {
          email: input.businessEmail,
          otp: input.code,
        },
        headers: context.reqHeaders,
      });

      if (!status)
        throw new ORPCError("NOT_ACCEPTABLE", { message: "Invalid OTP" });

      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: { isOnboarded: true, businessEmailVerified: true },
      });
      return {
        message: `Welcome ${session.user.name}`,
        data: displayUser(updatedUser),
      };
    } catch (error: any) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: error?.message || "Failed to verify email OTP",
        cause: error,
      });
    }
  });

export const onBoardOAuthUser = router
  .route({
    method: "POST",
    tags,
    path: "/auth/onboard-oauth",
    summary: "Onboard OAuth User",
  })
  .input(OnBoardOAuthUserSchema)
  .handler(async ({ context, input }) => {
    try {
      const session = await getSession(context.reqHeaders!);

      const phoneAlreadyExists = await db.user.findUnique({
        where: { NOT: { id: session.user.id }, phoneNumber: input.phoneNumber },
      });

      if (phoneAlreadyExists)
        throw new ORPCError("CONFLICT", {
          message: "Phone number already exists",
        });

      //send OTP to phone number and update the user details in db
      await Promise.all([
        auth.api.sendPhoneNumberOTP({
          body: { phoneNumber: input.phoneNumber },
          headers: context.reqHeaders,
        }),
        db.user.update({
          where: { id: session.user.id },
          data: {
            phoneNumber: input.phoneNumber,
            companyName: input.companyName,
          },
        }),
      ]);

      return { message: "OTP has been sent to your phone number" };
    } catch (error: any) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: error?.message || "Failed to onboard user",
        cause: error,
      });
    }
  });

export const verifyOnboardPhoneOTP = router
  .route({
    method: "POST",
    tags,
    path: "/auth/onboard-oauth-verify",
    summary: "Verify Phone & Onboard",
  })
  .input(VerifyPhoneOTPSchema)
  .handler(async ({ input, context }) => {
    try {
      const session = await getSession(context.reqHeaders!);
      const { status: success } = await auth.api.verifyPhoneNumber({
        body: {
          phoneNumber: input.phoneNumber,
          code: input.code,
          disableSession: true, // do not create session on onboarding
        },
        headers: context.reqHeaders,
      });

      if (!success)
        throw new ORPCError("NOT_ACCEPTABLE", { message: "Invalid OTP" });

      const updatedUser = await db.user.update({
        where: { id: session.user.id },
        data: { isOnboarded: true },
      });

      return {
        message: `Welcome ${updatedUser.name}`,
        data: updatedUser ? displayUser(updatedUser) : undefined,
      };
    } catch (error: any) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: error?.message || "Failed to verify phone OTP",
        cause: error,
      });
    }
  });

export const me = router
  .route({
    method: "GET",
    tags,
    path: "/auth/me",
    summary: "Get Current/Me User",
  })
  .handler(async ({ context }) => {
    try {
      const session = await getSession(context.reqHeaders!);
      return {
        message: "session fetched successfully",
        data: displayUser(session.user),
      };
    } catch (error: any) {
      throw new ORPCError("INTERNAL_SERVER_ERROR", {
        message: error?.message || "Failed to get current user",
        cause: error,
      });
    }
  });
