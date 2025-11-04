import { client } from './client';

export interface PresignPayload {
  fileName: string;
  fileType: string;
  folder?: string;
}

export interface PresignResponse {
  uploadUrl: string;
  fileUrl: string;
}

export const uploadApi = {
  async presign(payload: PresignPayload) {
    const { data } = await client.post<PresignResponse>('/upload/presign', payload);
    return data;
  }
};
