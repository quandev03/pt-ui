export const handleConvertIsdn = (value: string) => {
  if (value) {
    if (value.startsWith('0') || value.startsWith('84')) {
      return value.replace(/^(0|84)/, '');
    }
  }
  return value;
};
