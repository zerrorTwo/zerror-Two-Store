export const convertImageToBase64 = async (imageUrl) => {
  try {
    // Kiểm tra URL có hợp lệ hay không
    if (!imageUrl || !imageUrl.startsWith("http")) {
      throw new Error("Invalid URL provided.");
    }

    // Fetch metadata của hình ảnh để kiểm tra loại ảnh
    const response = await fetch(imageUrl);

    // Lấy Content-Type của phản hồi
    const contentType = response.headers.get("Content-Type");

    // Kiểm tra xem có phải là hình ảnh không
    if (!contentType || !contentType.startsWith("image/")) {
      throw new Error("Provided URL does not point to an image.");
    }

    // Chuyển đổi hình ảnh thành base64
    const buffer = await response.buffer(); // Lấy buffer của hình ảnh
    const base64Image = buffer.toString("base64"); // Chuyển đổi buffer thành base64

    // Trả về Base64 theo định dạng image/jpeg (hoặc PNG, tùy vào loại ảnh)
    return `data:${contentType};base64,${base64Image}`;
  } catch (error) {
    console.error("Error converting image to base64:", error.message);
    return null; // Trả về null nếu có lỗi
  }
};
