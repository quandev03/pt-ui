export const handleConvertIsdn = (value: string) => {
  if (value) {
    if (value.startsWith('0') || value.startsWith('84')) {
      return value.replace(/^(0|84)/, '');
    }
  }
  return value;
};

const contentTypeJsonRegex = /application\/[^+]*[+]?(json);?.*/;

export const blobToJson = async <T>(blob: Blob): Promise<T> => {
  if (contentTypeJsonRegex.test(blob.type)) {
    const text = await blob.text();
    return JSON.parse(text) as T;
  } else {
    throw new Error('Response blob type is not JSON');
  }
};
