-- AddForeignKey
ALTER TABLE "system_control_logs" ADD CONSTRAINT "system_control_logs_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
