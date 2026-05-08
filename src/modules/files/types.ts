export interface FileDto {
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
}

export interface CreateFileInput {
  title: string;
  description?: string;
  type: string;
  size: number;
  url: string;
  pathname: string;
  userId: string;
  createdById: string;
}

export interface UpdateFileInput {
  title?: string;
  description?: string;
  modifiedById: string;
}
