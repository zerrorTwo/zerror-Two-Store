export const formatCurrency = (value) => {
  if (value === null || value === undefined) return "";
  return new Intl.NumberFormat("vi-VN").format(value);
};

export function parseCurrency(formattedCurrency) {
  // Loại bỏ dấu phân cách hàng nghìn và thay dấu phẩy bằng dấu chấm
  const normalized = formattedCurrency.replace(/\./g, "").replace(/,/g, ".");

  // Chuyển đổi chuỗi thành số
  const number = parseFloat(normalized);

  // if (isNaN(number)) {
  //   throw new Error("Chuỗi không thể chuyển đổi thành số!");
  // }

  return number;
}
