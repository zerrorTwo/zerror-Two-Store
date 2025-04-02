import { createSlice } from "@reduxjs/toolkit";

// Hàm lấy dữ liệu từ localStorage
const getRecentProductsFromStorage = () => {
  try {
    const storedItems = localStorage.getItem("recentProducts");
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error("Error loading recent products from localStorage:", error);
    return [];
  }
};

// Hàm lưu dữ liệu vào localStorage
const saveRecentProductsToStorage = (products) => {
  try {
    localStorage.setItem("recentProducts", JSON.stringify(products));
  } catch (error) {
    console.error("Error saving recent products to localStorage:", error);
  }
};

// Trạng thái ban đầu
const initialState = {
  items: getRecentProductsFromStorage(), // Danh sách sản phẩm đã xem gần đây
};

// Tạo slice
const recentProductSlice = createSlice({
  name: "recentProducts",
  initialState,
  reducers: {
    // Thêm sản phẩm vào danh sách xem gần đây (có giới hạn 30 sản phẩm)
    addRecentProduct: (state, action) => {
      const product = action.payload;

      // Kiểm tra xem sản phẩm đã tồn tại chưa
      state.items = state.items.filter((item) => item.id !== product.id);

      // Thêm sản phẩm vào đầu danh sách
      state.items.unshift(product);

      // Giữ tối đa 30 sản phẩm gần đây
      if (state.items.length > 30) {
        state.items.pop();
      }

      saveRecentProductsToStorage(state.items);
    },

    // Xóa toàn bộ sản phẩm đã xem gần đây
    clearRecentProducts: (state) => {
      state.items = [];
      saveRecentProductsToStorage(state.items);
    },
  },
});

// Export actions
export const { addRecentProduct, clearRecentProducts } =
  recentProductSlice.actions;

// Export reducer
export default recentProductSlice.reducer;

// Selectors
export const selectRecentProducts = (state) => state.recentProducts.items;
export const selectRecentCount = (state) => state.recentProducts.items.length;
export const selectIsRecent = (state, productId) =>
  state.recentProducts.items.some((item) => item.id === productId);
