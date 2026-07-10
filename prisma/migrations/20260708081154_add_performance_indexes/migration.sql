-- CreateIndex
CREATE INDEX "Attempt_userId_idx" ON "Attempt"("userId");

-- CreateIndex
CREATE INDEX "Attempt_testId_idx" ON "Attempt"("testId");

-- CreateIndex
CREATE INDEX "Test_skill_idx" ON "Test"("skill");

-- CreateIndex
CREATE INDEX "User_teacherId_idx" ON "User"("teacherId");
