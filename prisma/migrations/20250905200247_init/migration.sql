-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('CUSTOMER', 'ADMIN');

-- CreateEnum
CREATE TYPE "public"."OTPType" AS ENUM ('EMAIL', 'PHONE');

-- CreateEnum
CREATE TYPE "public"."ImageType" AS ENUM ('BRAND', 'COMPANY', 'ISP_PROVIDER', 'WHATSAPP_BUSINESS_PLATFORM', 'OMNICHANNEL_BUSINESS_PLATFORM', 'SHARE_LINK', 'POPULAR_SEARCH', 'BANNER_1', 'BANNER_2', 'AD_1', 'AD_2', 'AD_3', 'BROADBAND_POSTER', 'IMAGE_SLIDER');

-- CreateEnum
CREATE TYPE "public"."SectionType" AS ENUM ('AI_LIKE', 'BUSINESS_PLATFORM', 'SOFTWARE', 'NETWORK_HARDWARE', 'DATA_CENTER', 'CLOUD', 'SHOWCASE', 'EVENT_WEBINAR');

-- CreateEnum
CREATE TYPE "public"."DatacenterCloudType" AS ENUM ('DATA_CENTER', 'CLOUD');

-- CreateEnum
CREATE TYPE "public"."ShowcaseMediaType" AS ENUM ('IMAGE', 'VIDEO', 'YOUTUBE');

-- CreateEnum
CREATE TYPE "public"."EventWebinarType" AS ENUM ('EVENT', 'WEBINAR');

-- CreateEnum
CREATE TYPE "public"."EngagementEmbedType" AS ENUM ('LINK', 'EMBEDDABLE', 'FILE');

-- CreateEnum
CREATE TYPE "public"."Currency" AS ENUM ('INR', 'USD', 'EUR');

-- CreateTable
CREATE TABLE "public"."user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "firstname" TEXT,
    "lastname" TEXT,
    "image" TEXT,
    "phone" TEXT,
    "countryCode" TEXT,
    "email" TEXT,
    "businessEmail" TEXT,
    "companyName" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'CUSTOMER',
    "phoneVerified" BOOLEAN NOT NULL DEFAULT false,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "businessEmailVerified" BOOLEAN NOT NULL DEFAULT false,
    "acceptedTerms" BOOLEAN NOT NULL DEFAULT false,
    "acceptedUpdates" BOOLEAN NOT NULL DEFAULT false,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isOAuth" BOOLEAN NOT NULL DEFAULT false,
    "isOnboarded" BOOLEAN NOT NULL DEFAULT false,
    "isSuspended" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "accessTokenExpiresAt" INTEGER,
    "refreshTokenExpiresAt" INTEGER,
    "scope" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "device" TEXT,
    "os" TEXT,
    "browser" TEXT,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."otp" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."OTPType" NOT NULL,
    "code" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "otp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."vendor" (
    "id" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "brandName" TEXT NOT NULL,
    "companyAddress" TEXT NOT NULL,
    "companyLogo" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "countryCode" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "pan" TEXT,
    "gstin" TEXT,
    "msme" TEXT,
    "msmeAttachment" TEXT,
    "panAttachment" TEXT,
    "gstinAttachment" TEXT,
    "coiAttachment" TEXT,
    "shareLinks" JSONB,
    "createdByAdmin" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "userId" TEXT,

    CONSTRAINT "vendor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."images" (
    "id" TEXT NOT NULL,
    "type" "public"."ImageType" NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "link" TEXT DEFAULT '',
    "isFormLink" BOOLEAN NOT NULL DEFAULT false,
    "priority" INTEGER DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."section" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "type" "public"."SectionType" NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "imageUrl" TEXT,
    "priority" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "level" INTEGER NOT NULL DEFAULT 0,
    "parentId" TEXT,
    "sectionId" TEXT,

    CONSTRAINT "category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "brandName" TEXT,
    "industry" TEXT,
    "description" TEXT,
    "imageUrl" TEXT,
    "link" TEXT,
    "priority" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hasPricing" BOOLEAN NOT NULL DEFAULT false,
    "sectionId" TEXT,
    "categoryId" TEXT,
    "showVendor" BOOLEAN NOT NULL DEFAULT false,
    "vendorId" TEXT,

    CONSTRAINT "product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."product_options" (
    "id" TEXT NOT NULL,
    "includeDetails" BOOLEAN NOT NULL DEFAULT false,
    "solidDotColor" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 0,
    "reviewCount" INTEGER DEFAULT 0,
    "tagline1" TEXT,
    "tagline2" TEXT,
    "isClaimable" BOOLEAN NOT NULL DEFAULT false,
    "claim" JSONB,
    "showStartupOffer" BOOLEAN NOT NULL DEFAULT false,
    "startupOffer" JSONB,
    "showSpecialOffer" BOOLEAN NOT NULL DEFAULT false,
    "specialOffer" JSONB,
    "showStartTrial" BOOLEAN NOT NULL DEFAULT false,
    "startTrial" JSONB,
    "showBookDemo" BOOLEAN NOT NULL DEFAULT false,
    "bookDemo" JSONB,
    "showQuote" BOOLEAN NOT NULL DEFAULT false,
    "quote" JSONB,
    "showCallBack" BOOLEAN NOT NULL DEFAULT false,
    "callBack" JSONB,
    "showChat" BOOLEAN NOT NULL DEFAULT false,
    "chat" JSONB,
    "showDiscount" BOOLEAN NOT NULL DEFAULT false,
    "discount" JSONB,
    "showWebinar" BOOLEAN NOT NULL DEFAULT false,
    "webinar" JSONB,
    "productId" TEXT NOT NULL,

    CONSTRAINT "product_options_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."datacenter_cloud_details" (
    "id" TEXT NOT NULL,
    "type" "public"."DatacenterCloudType" NOT NULL DEFAULT 'DATA_CENTER',
    "isAiCertified" BOOLEAN NOT NULL DEFAULT false,
    "isGreenCompatible" BOOLEAN NOT NULL DEFAULT false,
    "aiCertifiedLink" TEXT,
    "greenCompatibleLink" TEXT,
    "features" TEXT[],
    "certifications" JSONB,
    "locations" JSONB,
    "services" JSONB,
    "expertise" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "datacenter_cloud_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."software_details" (
    "id" TEXT NOT NULL,
    "viewLink" TEXT,
    "productId" TEXT NOT NULL,

    CONSTRAINT "software_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."software_plan" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT -1,
    "features" TEXT[],
    "hasPricing" BOOLEAN NOT NULL DEFAULT false,
    "softwareDetailsId" TEXT NOT NULL,

    CONSTRAINT "software_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."network_hardware_details" (
    "id" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "features" TEXT[],
    "productId" TEXT NOT NULL,

    CONSTRAINT "network_hardware_details_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."showcase" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "mediaType" "public"."ShowcaseMediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "priority" INTEGER NOT NULL DEFAULT -1,
    "sectionId" TEXT,
    "categoryId" TEXT,
    "vendorId" TEXT,

    CONSTRAINT "showcase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."event_webinar" (
    "id" TEXT NOT NULL,
    "type" "public"."EventWebinarType" NOT NULL DEFAULT 'EVENT',
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "link" TEXT,
    "priority" INTEGER NOT NULL DEFAULT -1,
    "date" TIMESTAMP(3) NOT NULL,
    "city" TEXT,
    "address" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hasPricing" BOOLEAN NOT NULL DEFAULT false,
    "sectionId" TEXT,
    "categoryId" TEXT,

    CONSTRAINT "event_webinar_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."engagement_block" (
    "id" TEXT NOT NULL,
    "showInfo" BOOLEAN NOT NULL DEFAULT false,
    "infoDetails" JSONB,
    "showBrochure" BOOLEAN NOT NULL DEFAULT false,
    "brochureDetails" JSONB,
    "showForm" BOOLEAN NOT NULL DEFAULT false,
    "formDetails" JSONB,
    "showTrendingBrands" BOOLEAN NOT NULL DEFAULT false,
    "trendingBrandsDetails" JSONB,
    "showCalendar" BOOLEAN NOT NULL DEFAULT false,
    "calendarDetails" JSONB,
    "showShareLinks" BOOLEAN NOT NULL DEFAULT false,
    "shareLinks" JSONB,
    "showBadge" BOOLEAN NOT NULL DEFAULT false,
    "badgeDetails" JSONB,
    "productId" TEXT,
    "showcaseId" TEXT,
    "eventWebinarId" TEXT,

    CONSTRAINT "engagement_block_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."price_block" (
    "id" TEXT NOT NULL,
    "isStartingPrice" BOOLEAN NOT NULL DEFAULT false,
    "price" DOUBLE PRECISION,
    "priceText" TEXT,
    "currency" "public"."Currency" NOT NULL DEFAULT 'INR',
    "hasFreeDemo" BOOLEAN NOT NULL DEFAULT false,
    "freeDemoLink" TEXT,
    "showBtn" BOOLEAN NOT NULL DEFAULT false,
    "btnText" TEXT DEFAULT 'Buy Now',
    "btnLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "productId" TEXT,
    "softwarePlanId" TEXT,
    "eventWebinarId" TEXT,

    CONSTRAINT "price_block_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_phone_key" ON "public"."user"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "public"."user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "user_businessEmail_key" ON "public"."user"("businessEmail");

-- CreateIndex
CREATE INDEX "user_phone_email_businessEmail_idx" ON "public"."user"("phone", "email", "businessEmail");

-- CreateIndex
CREATE UNIQUE INDEX "account_provider_providerId_key" ON "public"."account"("provider", "providerId");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "public"."session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_brandName_key" ON "public"."vendor"("brandName");

-- CreateIndex
CREATE UNIQUE INDEX "vendor_userId_key" ON "public"."vendor"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "images_name_key" ON "public"."images"("name");

-- CreateIndex
CREATE UNIQUE INDEX "section_slug_key" ON "public"."section"("slug");

-- CreateIndex
CREATE INDEX "section_name_slug_idx" ON "public"."section"("name", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "category_slug_key" ON "public"."category"("slug");

-- CreateIndex
CREATE INDEX "category_name_slug_sectionId_parentId_level_idx" ON "public"."category"("name", "slug", "sectionId", "parentId", "level");

-- CreateIndex
CREATE UNIQUE INDEX "product_slug_key" ON "public"."product"("slug");

-- CreateIndex
CREATE INDEX "product_name_slug_vendorId_categoryId_idx" ON "public"."product"("name", "slug", "vendorId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "product_options_productId_key" ON "public"."product_options"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "datacenter_cloud_details_productId_key" ON "public"."datacenter_cloud_details"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "software_details_productId_key" ON "public"."software_details"("productId");

-- CreateIndex
CREATE INDEX "software_plan_name_idx" ON "public"."software_plan"("name");

-- CreateIndex
CREATE UNIQUE INDEX "network_hardware_details_productId_key" ON "public"."network_hardware_details"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "showcase_slug_key" ON "public"."showcase"("slug");

-- CreateIndex
CREATE INDEX "showcase_name_slug_idx" ON "public"."showcase"("name", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "event_webinar_slug_key" ON "public"."event_webinar"("slug");

-- CreateIndex
CREATE INDEX "event_webinar_name_slug_idx" ON "public"."event_webinar"("name", "slug");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_block_productId_key" ON "public"."engagement_block"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_block_showcaseId_key" ON "public"."engagement_block"("showcaseId");

-- CreateIndex
CREATE UNIQUE INDEX "engagement_block_eventWebinarId_key" ON "public"."engagement_block"("eventWebinarId");

-- CreateIndex
CREATE UNIQUE INDEX "price_block_productId_key" ON "public"."price_block"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "price_block_softwarePlanId_key" ON "public"."price_block"("softwarePlanId");

-- CreateIndex
CREATE UNIQUE INDEX "price_block_eventWebinarId_key" ON "public"."price_block"("eventWebinarId");

-- AddForeignKey
ALTER TABLE "public"."account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."otp" ADD CONSTRAINT "otp_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."vendor" ADD CONSTRAINT "vendor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."category" ADD CONSTRAINT "category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."category" ADD CONSTRAINT "category_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product" ADD CONSTRAINT "product_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."product_options" ADD CONSTRAINT "product_options_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."datacenter_cloud_details" ADD CONSTRAINT "datacenter_cloud_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."software_details" ADD CONSTRAINT "software_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."software_plan" ADD CONSTRAINT "software_plan_softwareDetailsId_fkey" FOREIGN KEY ("softwareDetailsId") REFERENCES "public"."software_details"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."network_hardware_details" ADD CONSTRAINT "network_hardware_details_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showcase" ADD CONSTRAINT "showcase_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showcase" ADD CONSTRAINT "showcase_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."showcase" ADD CONSTRAINT "showcase_vendorId_fkey" FOREIGN KEY ("vendorId") REFERENCES "public"."vendor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_webinar" ADD CONSTRAINT "event_webinar_sectionId_fkey" FOREIGN KEY ("sectionId") REFERENCES "public"."section"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."event_webinar" ADD CONSTRAINT "event_webinar_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."engagement_block" ADD CONSTRAINT "engagement_block_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."engagement_block" ADD CONSTRAINT "engagement_block_showcaseId_fkey" FOREIGN KEY ("showcaseId") REFERENCES "public"."showcase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."engagement_block" ADD CONSTRAINT "engagement_block_eventWebinarId_fkey" FOREIGN KEY ("eventWebinarId") REFERENCES "public"."event_webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_block" ADD CONSTRAINT "price_block_productId_fkey" FOREIGN KEY ("productId") REFERENCES "public"."product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_block" ADD CONSTRAINT "price_block_softwarePlanId_fkey" FOREIGN KEY ("softwarePlanId") REFERENCES "public"."software_plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."price_block" ADD CONSTRAINT "price_block_eventWebinarId_fkey" FOREIGN KEY ("eventWebinarId") REFERENCES "public"."event_webinar"("id") ON DELETE CASCADE ON UPDATE CASCADE;
