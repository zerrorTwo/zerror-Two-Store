import { createSlice } from "@reduxjs/toolkit";

// Hàm lấy dữ liệu từ localStorage
const getFavoriteProductsFromStorage = () => {
  try {
    const storedItems = localStorage.getItem("favoriteProducts");
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error("Error loading favorite products from localStorage:", error);
    return [];
  }
};

// Hàm lưu dữ liệu vào localStorage
const saveFavoriteProductsToStorage = (products) => {
  try {
    localStorage.setItem("favoriteProducts", JSON.stringify(products));
  } catch (error) {
    console.error("Error saving favorite products to localStorage:", error);
  }
};

// Trạng thái ban đầu
const initialState = {
  items: getFavoriteProductsFromStorage(), // Danh sách sản phẩm yêu thích
};

// Tạo slice
const favoriteProductSlice = createSlice({
  name: "favoriteProducts",
  initialState,
  reducers: {
    // Thêm sản phẩm vào danh sách yêu thích
    addFavoriteProduct: (state, action) => {
      const product = action.payload;
      // Kiểm tra xem sản phẩm đã tồn tại chưa dựa trên id
      const exists = state.items.some((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product);
        saveFavoriteProductsToStorage(state.items); // Lưu vào localStorage
      }
    },
    // Xóa sản phẩm khỏi danh sách yêu thích
    removeFavoriteProduct: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveFavoriteProductsToStorage(state.items); // Lưu vào localStorage
    },
    // Xóa toàn bộ sản phẩm yêu thích
    clearFavoriteProducts: (state) => {
      state.items = [];
      saveFavoriteProductsToStorage(state.items); // Lưu vào localStorage
    },
  },
});

// Export actions
export const {
  addFavoriteProduct,
  removeFavoriteProduct,
  clearFavoriteProducts,
} = favoriteProductSlice.actions;

// Export reducer
export default favoriteProductSlice.reducer;

// Selectors
export const selectFavoriteProducts = (state) => state.favoriteProducts.items;
export const selectFavoriteCount = (state) =>
  state.favoriteProducts.items.length;
export const selectIsFavorite = (state, productId) =>
  state.favoriteProducts.items.some((item) => item.id === productId);
