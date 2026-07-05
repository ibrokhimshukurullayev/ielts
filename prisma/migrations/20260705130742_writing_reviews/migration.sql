-- CreateTable
CREATE TABLE "WritingReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "studentId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "testId" TEXT,
    "taskTitle" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "essay" TEXT NOT NULL,
    "wordCount" INTEGER NOT NULL,
    "taskNumber" INTEGER NOT NULL DEFAULT 1,
    "aiBand" REAL,
    "teacherFeedback" TEXT,
    "teacherBand" REAL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WritingReview_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "WritingReview_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "WritingReview_studentId_idx" ON "WritingReview"("studentId");

-- CreateIndex
CREATE INDEX "WritingReview_teacherId_idx" ON "WritingReview"("teacherId");
