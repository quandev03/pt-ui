export const base64ToFile = (dataUrl: string, fileName: string): File => {
  const arr = dataUrl.split(',');
  const mimeMatch = arr[0].match(/:(.*?);/);
  const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';

  const bstr = atob(arr[1]); // decode base64
  const n = bstr.length;
  const u8arr = new Uint8Array(n);

  for (let i = 0; i < n; i++) {
    u8arr[i] = bstr.charCodeAt(i);
  }

  return new File([u8arr], fileName, { type: mime });
};
