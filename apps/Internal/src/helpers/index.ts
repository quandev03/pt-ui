export const cleanUpString = (input: string) => {
  // Trim khoảng trắng đầu và cuối chuỗi
  const trimmedString = input.trim();

  // Thay thế nhiều khoảng trắng liên tiếp thành 1 khoảng trắng
  const cleanedString = trimmedString.replace(/\s\s+/g, ' ');

  return cleanedString;
};
