import { db } from "@/lib/db";
import { APP_TITLE } from "@/utils/constants";
import { APIError, betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import {
  admin,
  customSession,
  emailOTP,
  phoneNumber,
} from "better-auth/plugins";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),

  // Base URL and app name
  appName: APP_TITLE,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  secret: process.env.BETTER_AUTH_SECRET!,
  logger: { level: process.env.NODE_ENV === "development" ? "debug" : "error" },

  // Disable email/password authentication
  emailAndPassword: {
    enabled: false,
  },

  // Phone number plugin for OTP authentication
  plugins: [
    nextCookies(),

    //role
    admin({
      defaultRole: "user",
      defaultBanReason: "You are banned",
      defaultBanExpiresIn: 7 * 24 * 60 * 60, // 7 days in seconds
    }),

    phoneNumber({
      expiresIn: 300,
      allowedAttempts: 3,
      otpLength: 6,
      requireVerification: true,
      sendOTP: async ({ phoneNumber, code }) => {
        // Log OTP for development
        console.log(`📱 Sending OTP ${code} to ${phoneNumber}`);
      },
      signUpOnVerification: {
        getTempEmail(phoneNumber) {
          return `${phoneNumber}@temp.com`;
        },
        getTempName(phoneNumber) {
          return `User_${phoneNumber}`;
        },
      },
    }),
    emailOTP({
      allowedAttempts: 2,
      overrideDefaultEmailVerification: true, // to use only OTP for email verification, insted of magic links
      expiresIn: 300,
      otpLength: 6,
      disableSignUp: true,
      storeOTP: "encrypted",
      async sendVerificationOTP(data, request) {
        if (data.type !== "email-verification") return;
        console.log(`📧 Sending OTP ${data.otp} to ${data.email}`);
      },
    }),

    customSession(async ({ user, session }) => {
      const userWithSession = await db.user.findUnique({
        where: { id: user.id },
        select: {
          id: true,
          name: true,
          image: true,
          email: true,
          phoneNumber: true,
          role: true,
          isOnboarded: true,
          isOAuth: true,
          banned: true,
          businessEmail : true,
          businessEmailVerified: true,
          sessions: {
            select: { id: true, token: true },
            take: 1,
            orderBy: { createdAt: "desc" },
          },
        },
      });
      if (!userWithSession) {
        console.error(
          "Error in custom Session Plugin: User not found",
          user.id
        );
        throw new APIError("NOT_FOUND", { message: "User not found" });
      }
      const { sessions, ...userData } = userWithSession;
      return {
        user: userData,
        session: sessions?.[0] || session,
      };
    }),
  ],

  // Social providers configuration
  socialProviders: {
    google: {
      clientId: process.env.AUTH_GOOGLE_CLIENT_ID!,
      clientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET!,
      prompt: "select_account consent",
      scope: ["profile", "email"],
      async mapProfileToUser(profile) {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          isOAuth: true,
          emailVerified: profile.email_verified,
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    },
    linkedin: {
      clientId: process.env.AUTH_LINKEDIN_CLIENT_ID!,
      clientSecret: process.env.AUTH_LINKEDIN_CLIENT_SECRET!,
      prompt: "select_account consent",
      scope: ["email", "profile", "openid"],
      async mapProfileToUser(profile) {
        return {
          email: profile.email,
          name: profile.name,
          image: profile.picture,
          isOAuth: true,
          emailVerified: profile.email_verified,
          firstName: profile.given_name,
          lastName: profile.family_name,
        };
      },
    },
  },

  // Session configuration
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // Update every day
  },

  // Security and performance options
  advanced: {
    useSecureCookies: process.env.NODE_ENV === "production",
    crossSubDomainCookies: {
      enabled: false,
    },
    cookiePrefix: "t_",
  },

  onAPIError: {
    errorURL: "/login",
    onError(error, ctx) {
      console.error("Auth API Error:", error, ctx);
    },
  },

  // User configuration with additional fields
  user: {
    additionalFields: {
      phoneNumber: {
        type: "string",
        required: false,
        isUnique: true,
      },
      countryCode: {
        type: "string",
        required: false,
      },
      firstName: {
        type: "string",
        required: false,
      },
      lastName: {
        type: "string",
        required: false,
      },
      companyName: {
        type: "string",
        required: false,
      },
      businessEmail: {
        type: "string",
        required: false,
        isUnique: true,
      },
      businessEmailVerified: {
        type: "boolean",
        defaultValue: false,
      },
      isOnboarded: {
        type: "boolean",
        defaultValue: false,
      },
      isOAuth: {
        type: "boolean",
        defaultValue: false,
      },
      role: {
        type: "string",
        defaultValue: "CUSTOMER",
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session.session;
export type User = typeof auth.$Infer.Session.user;
