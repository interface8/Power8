import { prisma } from "@/lib/prisma";
import type { FileDto, CreateFileInput, UpdateFileInput } from "./types";

function toFileDto(file: {
  id: string;
  title: string;
  description: string | null;
  type: string;
  size: number;
  url: string;
  userId: string;
  createdAt: Date;
  createdById: string | null;
  updatedAt: Date;
  modifiedById: string | null;
}): FileDto {
  return {
    id: file.id,
    title: file.title,
    description: file.description,
    type: file.type,
    size: file.size,
    url: file.url,
    userId: file.userId,
    createdAt: file.createdAt,
    createdById: file.createdById,
    updatedAt: file.updatedAt,
    modifiedById: file.modifiedById,
  };
}

export async function findFiles(userId?: string): Promise<FileDto[]> {
  const files = await prisma.file.findMany({
    where: userId ? { userId } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return files.map(toFileDto);
}

export async function findFileById(id: string): Promise<FileDto | null> {
  const file = await prisma.file.findUnique({ where: { id } });
  return file ? toFileDto(file) : null;
}

export async function createFile(input: CreateFileInput): Promise<FileDto> {
  const file = await prisma.file.create({ data: input });
  return toFileDto(file);
}

export async function updateFile(id: string, input: UpdateFileInput): Promise<FileDto> {
  const file = await prisma.file.update({
    where: { id },
    data: input,
  });
  return toFileDto(file);
}

export async function deleteFileRecord(id: string): Promise<{ pathname: string } | null> {
  const file = await prisma.file.findUnique({ where: { id } });
  if (!file) return null;

  await prisma.file.delete({ where: { id } });
  return { pathname: file.pathname };
}

export async function fileExists(id: string): Promise<boolean> {
  const count = await prisma.file.count({ where: { id } });
  return count > 0;
}
