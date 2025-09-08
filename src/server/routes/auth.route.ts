import { ORPCError } from "@orpc/server";
import { deleteCookie } from "@orpc/server/helpers";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { ResponseSchema } from "@/schemas";
import {
  LoginSchema,
  OnBoardOAuthUserSchema,
  OnBoardUserSchema,
  VerifyEmailOTPSchema,
  VerifyPhoneOTPSchema,
} from "@/schemas/auth";

import { base } from "@/server";
import { requireAuth } from "@/server/middlewares/auth.middleware";
import { getSession } from "@/server/utils";

const authRouter = base
  .route({ path: "/auth", tags: ["Authentication"] })
  .errors({
    NOT_FOUND: { message: "User not found" },
    CONFLICT: { message: "Resource already exists" },
    NOT_ACCEPTABLE: { message: "Invalid OTP" },
  });

export const login = authRouter
  .route({ method: "POST", path: "/login", summary: "Login" })
  .input(LoginSchema)
  .output(ResponseSchema)
  .handler(async ({ input, context, errors }) => {
    const response = await auth.api.sendPhoneNumberOTP({
      body: { phoneNumber: input.phoneNumber },
      headers: context.reqHeaders,
      asResponse: true,
    });
    if (!response.ok)
      throw errors.INTERNAL_SERVER_ERROR({
        message: "Failed to send OTP",
      });
    const data = await response.json();
    return { message: data?.message || "OTP sent successfully" };
  });

export const verifyLoginPhoneOTP = authRouter
  .route({
    method: "POST",
    path: "/verify-login",
    summary: "Verify Login",
  })
  .input(VerifyPhoneOTPSchema)
  .output(ResponseSchema)
  .handler(async ({ input, context, errors }) => {
    try {
      const { status } = await auth.api.verifyPhoneNumber({
        body: {
          code: input.code,
          phoneNumber: input.phoneNumber,
          disableSession: false, // create a session
        },
        headers: context.reqHeaders,
      });

      if (!status) throw errors.NOT_ACCEPTABLE();

      const savedUser = await db.user.findUnique({
        where: { phoneNumber: input.phoneNumber },
      });

      if (!savedUser) throw errors.NOT_FOUND();

      // If the user is not onboarded, revoke the session immediately
      if (!savedUser.isOnboarded) {
        return { message: "OTP verified successfully" };
      } else {
        return { message: `Welcome ${savedUser.name}`, data: savedUser };
      }
    } catch (error: any) {
      if (error instanceof ORPCError) throw error;
      throw errors.INTERNAL_SERVER_ERROR({
        message: error?.message ?? "Failed to verify OTP",
        cause: error,
      });
    }
  });

export const onBoardUser = authRouter
  .route({
    method: "POST",
    path: "/onboard",
    summary: "Onboard User",
  })
  .input(OnBoardUserSchema)
  .output(ResponseSchema)
  .handler(async ({ context, input, errors }) => {
    try {
      const session = await getSession(context.reqHeaders!);

      await checkEmailExists(input.businessEmail, session.user.id);

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
      if (error instanceof ORPCError) throw error;
      throw errors.INTERNAL_SERVER_ERROR({
        message: error?.message || "Failed to onboard user",
        cause: error,
      });
    }
  });

export const verifyOnboardEmailOTP = authRouter
  .route({
    method: "POST",
    path: "/onboard-verify",
    summary: "Verify Email & Onboard",
  })
  .input(VerifyEmailOTPSchema)
  .use(requireAuth())
  .handler(async ({ input, context, errors }) => {
    try {
      const user = context.user!;
      const { status } = await auth.api.verifyEmailOTP({
        body: {
          email: input.businessEmail,
          otp: input.code,
        },
        headers: context.reqHeaders,
      });

      if (!status) throw errors.NOT_ACCEPTABLE();

      await db.user.update({
        where: { id: user.id },
        data: { isOnboarded: true, businessEmailVerified: true },
      });
      return {
        message: `Welcome ${user.name}`,
        data: user,
      };
    } catch (error: any) {
      if (error instanceof ORPCError) throw error;
      throw errors.INTERNAL_SERVER_ERROR({
        message: error?.message || "Failed to verify email OTP",
        cause: error,
      });
    }
  });

export const onBoardOAuthUser = authRouter
  .route({
    method: "POST",
    path: "/onboard-oauth",
    summary: "Onboard OAuth User",
  })
  .input(OnBoardOAuthUserSchema)
  .output(ResponseSchema)
  .handler(async ({ context, input, errors }) => {
    try {
      const session = await getSession(context.reqHeaders!);

      await checkPhoneExists(input.phoneNumber, session.user.id);

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
      if (error instanceof ORPCError) throw error;
      throw errors.INTERNAL_SERVER_ERROR({
        message: error?.message || "Failed to onboard user",
        cause: error,
      });
    }
  });

export const verifyOnboardPhoneOTP = authRouter
  .route({
    method: "POST",
    path: "/onboard-oauth-verify",
    summary: "Verify Phone & Onboard",
  })
  .input(VerifyPhoneOTPSchema)
  .use(requireAuth())
  .handler(async ({ input, context, errors }) => {
    try {
      const user = context.user!;
      const { status: success } = await auth.api.verifyPhoneNumber({
        body: {
          phoneNumber: input.phoneNumber,
          code: input.code,
          disableSession: true, // do not create session on onboarding
        },
        headers: context.reqHeaders,
      });

      if (!success) throw errors.NOT_ACCEPTABLE();

      const updatedUser = await db.user.update({
        where: { id: user.id },
        data: { isOnboarded: true },
      });

      return {
        message: `Welcome ${updatedUser.name}`,
        data: updatedUser ? user : undefined,
      };
    } catch (error: any) {
      if (error instanceof ORPCError) throw error;
      throw errors.INTERNAL_SERVER_ERROR({
        message: error?.message || "Failed to verify phone OTP",
        cause: error,
      });
    }
  });

export const me = authRouter
  .route({
    method: "GET",
    path: "/me",
    summary: "Get Current/Me User",
  })
  .use(requireAuth())
  .handler(async ({ context, errors }) => {
    try {
      const user = context.user!;
      return {
        message: "session fetched successfully",
        data: user,
      };
    } catch (error: any) {
      throw errors.INTERNAL_SERVER_ERROR({
        message: error?.message || "Failed to get current user",
        cause: error,
      });
    }
  });

export const logout = authRouter
  .route({ method: "POST", path: "/logout", summary: "Logout" })
  .handler(async ({ context }) => {
    try {
      const { session } = await getSession(context.reqHeaders!);
      if (session) {
        await auth.api.revokeSession({
          body: { token: session.token! },
          headers: context.reqHeaders!,
        });
        context.user = undefined;
      }
      return { message: "Logged out successfully" };
    } catch (error: any) {
      // make sure to delete the cookie even if revoke session fails
      deleteCookie(context.reqHeaders!, "t_.session_token", {
        expires: new Date(0),
      });
    }
  });
/**
 * Checks if an email already exists for a different user.
 * Throws a conflict error if email exists for another user.
 */
const checkEmailExists = async (businessEmail: string, userId: string) => {
  const emailAlreadyExists = await db.user.findFirst({
    where: {
      NOT: {
        id: userId,
      },
      OR: [{ email: businessEmail }, { businessEmail: businessEmail }],
    },
  });

  if (emailAlreadyExists) {
    throw new ORPCError("CONFLICT", { message: "Email already exists" });
  }
};

/**
 * Checks if a phone number already exists for a different user.
 * Throws a conflict error if phone number exists for another user.
 */
const checkPhoneExists = async (phoneNumber: string, userId: string) => {
  const phoneAlreadyExists = await db.user.findUnique({
    where: { NOT: { id: userId }, phoneNumber },
  });

  if (phoneAlreadyExists) {
    throw new ORPCError("CONFLICT", {
      message: "Phone number already exists",
    });
  }
};

export const authRoute = base.prefix("/auth").router({
  login,
  verifyLoginPhoneOTP,
  onBoardUser,
  verifyOnboardEmailOTP,
  onBoardOAuthUser,
  verifyOnboardPhoneOTP,
  me,
  logout,
});
export type AuthRoute = typeof authRoute;
