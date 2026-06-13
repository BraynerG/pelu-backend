-- CreateTable
CREATE TABLE "GoogleCalendarConfig" (
    "id" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "expiryDate" TIMESTAMP(3),
    "calendarId" TEXT NOT NULL DEFAULT 'primary',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GoogleCalendarConfig_pkey" PRIMARY KEY ("id")
);
