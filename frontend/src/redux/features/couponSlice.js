import { createSlice } from '@reduxjs/toolkit';

const couponSlice = createSlice({
  name: 'coupon',
  initialState: {
    selectedCoupons: {
      PRODUCT: null,
      FREESHIPPING: null,
      ORDER: null
    },
  },
  reducers: {
    setCoupons: (state, action) => {
      state.selectedCoupons = action.payload;
    },
    addCoupon: (state, action) => {
      const { type, coupon } = action.payload;
      const validTypes = ['PRODUCT', 'FREESHIPPING', 'ORDER'];
      if (validTypes.includes(type)) {
        state.selectedCoupons[type] = coupon;
      }
    },
    removeCoupon: (state, action) => {
      const type = action.payload;
      const validTypes = ['PRODUCT', 'FREESHIPPING', 'ORDER'];
      if (validTypes.includes(type)) {
        state.selectedCoupons[type] = null;
      }
    },
    clearAllCoupons: (state) => {
      state.selectedCoupons = {
        PRODUCT: null,
        FREESHIPPING: null,
        ORDER: null
      };
    }
  },
});

export const { 
  setCoupons,
  addCoupon, 
  removeCoupon, 
  clearAllCoupons 
} = couponSlice.actions;

export default couponSlice.reducer;

export const selectCoupons = (state) => state.coupon.selectedCoupons;