-- Add username field and make email optional (username-based auth, no OTP)
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_User" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL DEFAULT '',
    "name" TEXT NOT NULL,
    "email" TEXT,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'STUDENT',
    "teacherId" TEXT,
    "targetBand" REAL,
    "examDate" DATETIME,
    "currentBand" REAL,
    "weeklyHours" INTEGER,
    "focusSkill" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "User_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

INSERT INTO "new_User" ("id","username","name","email","passwordHash","role","teacherId","targetBand","examDate","currentBand","weeklyHours","focusSkill","createdAt")
SELECT "id","name","name","email","passwordHash","role","teacherId","targetBand","examDate","currentBand","weeklyHours","focusSkill","createdAt"
FROM "User";

DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";

CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

PRAGMA foreign_keys=ON;
