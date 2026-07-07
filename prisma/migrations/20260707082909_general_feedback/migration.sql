-- CreateTable
CREATE TABLE "general_feedbacks" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "feedbackType" TEXT NOT NULL,
    "experienceOverall" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "contactConsent" BOOLEAN NOT NULL DEFAULT false,
    "attachmentUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "general_feedbacks_pkey" PRIMARY KEY ("id")
);
