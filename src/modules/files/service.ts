import * as fileRepo from "./repository";
import { deleteFile as deleteFromBlob } from "@/lib/upload";
import type { CreateFileInput, UpdateFileInput } from "./types";

export async function listFiles(userId?: string) {
  return fileRepo.findFiles(userId);
}

export async function getFileById(id: string) {
  const file = await fileRepo.findFileById(id);
  if (!file) throw new Error("File not found");
  return file;
}

export async function createFile(input: CreateFileInput) {
  return fileRepo.createFile(input);
}

export async function updateFile(id: string, input: UpdateFileInput) {
  if (!(await fileRepo.fileExists(id))) {
    throw new Error("File not found");
  }
  return fileRepo.updateFile(id, input);
}

export async function deleteFile(id: string) {
  const result = await fileRepo.deleteFileRecord(id);
  if (!result) throw new Error("File not found");

  // Also delete from Vercel Blob (fire-and-forget)
  await deleteFromBlob(result.pathname).catch((err) =>
    console.error("Failed to delete from Blob:", err),
  );

  return { message: "File deleted successfully" };
}
