/*
  Warnings:

  - You are about to drop the column `provider` on the `account` table. All the data in the column will be lost.
  - The `accessTokenExpiresAt` column on the `account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `refreshTokenExpiresAt` column on the `account` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `browser` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `device` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `os` on the `session` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedTerms` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `acceptedUpdates` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `deletedAt` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `firstname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isBlocked` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isSuspended` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `isVerified` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `lastname` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `phoneVerified` on the `user` table. All the data in the column will be lost.
  - The `role` column on the `user` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - A unique constraint covering the columns `[phoneNumber]` on the table `user` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accountId` to the `account` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "public"."account_provider_providerId_key";

-- DropIndex
DROP INDEX "public"."user_businessEmail_key";

-- DropIndex
DROP INDEX "public"."user_phone_email_businessEmail_idx";

-- DropIndex
DROP INDEX "public"."user_phone_key";

-- AlterTable
ALTER TABLE "public"."account" DROP COLUMN "provider",
ADD COLUMN     "accountId" TEXT NOT NULL,
ADD COLUMN     "idToken" TEXT,
ADD COLUMN     "password" TEXT,
DROP COLUMN "accessTokenExpiresAt",
ADD COLUMN     "accessTokenExpiresAt" TIMESTAMP(3),
DROP COLUMN "refreshTokenExpiresAt",
ADD COLUMN     "refreshTokenExpiresAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "public"."session" DROP COLUMN "browser",
DROP COLUMN "device",
DROP COLUMN "isActive",
DROP COLUMN "os",
ADD COLUMN     "impersonatedBy" TEXT;

-- AlterTable
ALTER TABLE "public"."user" DROP COLUMN "acceptedTerms",
DROP COLUMN "acceptedUpdates",
DROP COLUMN "deletedAt",
DROP COLUMN "firstname",
DROP COLUMN "isBlocked",
DROP COLUMN "isDeleted",
DROP COLUMN "isSuspended",
DROP COLUMN "isVerified",
DROP COLUMN "lastname",
DROP COLUMN "phone",
DROP COLUMN "phoneVerified",
ADD COLUMN     "banExpires" TIMESTAMP(3),
ADD COLUMN     "banReason" TEXT,
ADD COLUMN     "banned" BOOLEAN DEFAULT false,
ADD COLUMN     "firstName" TEXT,
ADD COLUMN     "lastName" TEXT,
ADD COLUMN     "phoneNumber" TEXT,
ADD COLUMN     "phoneNumberVerified" BOOLEAN DEFAULT false,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT,
ALTER COLUMN "businessEmailVerified" DROP NOT NULL,
ALTER COLUMN "isOAuth" DROP NOT NULL,
ALTER COLUMN "isOnboarded" DROP NOT NULL,
ALTER COLUMN "updatedAt" SET DEFAULT CURRENT_TIMESTAMP;

-- DropEnum
DROP TYPE "public"."Role";

-- CreateTable
CREATE TABLE "public"."verification" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_phoneNumber_key" ON "public"."user"("phoneNumber");

-- CreateIndex
CREATE INDEX "user_email_businessEmail_phoneNumber_role_name_idx" ON "public"."user"("email", "businessEmail", "phoneNumber", "role", "name");
