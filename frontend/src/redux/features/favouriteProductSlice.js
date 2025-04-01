import { createSlice } from "@reduxjs/toolkit";

// Hàm lấy dữ liệu từ localStorage
const getFavouriteProductsFromStorage = () => {
  try {
    const storedItems = localStorage.getItem("favouriteProducts");
    return storedItems ? JSON.parse(storedItems) : [];
  } catch (error) {
    console.error("Error loading favourite products from localStorage:", error);
    return [];
  }
};

// Hàm lưu dữ liệu vào localStorage
const saveFavouriteProductsToStorage = (products) => {
  try {
    localStorage.setItem("favouriteProducts", JSON.stringify(products));
  } catch (error) {
    console.error("Error saving favourite products to localStorage:", error);
  }
};

// Trạng thái ban đầu
const initialState = {
  items: getFavouriteProductsFromStorage(), // Danh sách sản phẩm yêu thích
};

// Tạo slice
const favouriteProductSlice = createSlice({
  name: "favouriteProducts",
  initialState,
  reducers: {
    // Thêm sản phẩm vào danh sách yêu thích
    addFavouriteProduct: (state, action) => {
      const product = action.payload;
      // Kiểm tra xem sản phẩm đã tồn tại chưa dựa trên id
      const exists = state.items.some((item) => item.id === product.id);
      if (!exists) {
        state.items.push(product);
        saveFavouriteProductsToStorage(state.items); // Lưu vào localStorage
      }
    },
    // Xóa sản phẩm khỏi danh sách yêu thích
    removeFavouriteProduct: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
      saveFavouriteProductsToStorage(state.items); // Lưu vào localStorage
    },
    // Xóa toàn bộ sản phẩm yêu thích
    clearFavouriteProducts: (state) => {
      state.items = [];
      saveFavouriteProductsToStorage(state.items); // Lưu vào localStorage
    },
  },
});

// Export actions
export const {
  addFavouriteProduct,
  removeFavouriteProduct,
  clearFavouriteProducts,
} = favouriteProductSlice.actions;

// Export reducer
export default favouriteProductSlice.reducer;

// Selectors
export const selectFavouriteProducts = (state) => state.favouriteProducts.items;
export const selectFavouriteCount = (state) =>
  state.favouriteProducts.items.length;
export const selectIsFavourite = (state, productId) =>
  state.favouriteProducts.items.some((item) => item.id === productId);
