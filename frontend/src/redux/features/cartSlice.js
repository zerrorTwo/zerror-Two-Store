import { createSlice, createSelector } from "@reduxjs/toolkit";

// Lấy giỏ hàng từ localStorage nếu có
const loadCartFromLocalStorage = () => {
  const savedCart = localStorage.getItem("cart");
  return savedCart
    ? JSON.parse(savedCart)
    : { cartItems: [], totalItems: 0, totalPrice: 0 };
};

// Hàm lưu vào localStorage
const saveCartToLocalStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

const initialState = loadCartFromLocalStorage();

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const product = action.payload;
      const itemToAdd = state.cartItems.find(
        (item) =>
          item.productId === product.productId &&
          JSON.stringify(item.variation.type) ===
            JSON.stringify(product.variation.type)
      );

      if (!itemToAdd) {
        state.cartItems.push(product);
        state.totalItems += product.variation.quantity;
        state.totalPrice +=
          product.variation.price * product.variation.quantity;
      }

      saveCartToLocalStorage(state);
    },

    removeFromCart: (state, action) => {
      const product = action.payload;
      const itemToRemove = state.cartItems.find(
        (item) =>
          item.productId === product.productId &&
          JSON.stringify(item.variation.type) ===
            JSON.stringify(product.variation.type)
      );

      if (itemToRemove) {
        state.totalItems -= itemToRemove.variation.quantity || 1;
        state.totalPrice -=
          itemToRemove.variation.price * (itemToRemove.variation.quantity || 1);
        state.cartItems = state.cartItems.filter(
          (item) =>
            !(
              item.productId === product.productId &&
              JSON.stringify(item.variation.type) ===
                JSON.stringify(product.variation.type)
            )
        );
      }

      saveCartToLocalStorage(state);
    },

    increaseQuantity: (state, action) => {
      const { product } = action.payload;
      const itemToIncrease = state.cartItems.find(
        (item) =>
          item.productId === product.productId &&
          JSON.stringify(item.variation.type) ===
            JSON.stringify(product.variation.type)
      );
      if (itemToIncrease) {
        itemToIncrease.variation.quantity++;
        state.totalItems++;
        state.totalPrice += itemToIncrease.variation.price;
      }

      saveCartToLocalStorage(state);
    },

    decreaseQuantity: (state, action) => {
      const { product } = action.payload;
      const itemToDecrease = state.cartItems.find(
        (item) =>
          item.productId === product.productId &&
          JSON.stringify(item.variation.type) ===
            JSON.stringify(product.variation.type)
      );
      if (itemToDecrease && itemToDecrease.variation.quantity > 1) {
        itemToDecrease.variation.quantity--;
        state.totalItems--;
        state.totalPrice -= itemToDecrease.variation.price;
      }

      saveCartToLocalStorage(state);
    },

    clearCart: (state) => {
      state.cartItems = [];
      state.totalItems = 0;
      state.totalPrice = 0;
      localStorage.removeItem("cart");
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseQuantity,
  increaseQuantity,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;

// Selectors
export const selectCartState = (state) => state.cart;

export const selectCurrentCart = createSelector([selectCartState], (cart) => ({
  cartItems: cart.cartItems,
  totalItems: cart.totalItems,
  totalPrice: cart.totalPrice,
}));
