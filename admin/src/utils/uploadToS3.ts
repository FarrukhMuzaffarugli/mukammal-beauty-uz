export const uploadToS3 = async (uploadUrl: string, file: File, onProgress?: (percent: number) => void) => {
  await fetch(uploadUrl, {
    method: 'PUT',
    headers: {
      'Content-Type': file.type,
      'Content-Length': String(file.size),
      'x-amz-acl': 'public-read'
    },
    body: file
  });
  onProgress?.(100);
};
