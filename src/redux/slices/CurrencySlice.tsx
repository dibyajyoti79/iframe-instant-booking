import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  currency_code: "INR",
  currency_symbol: "20B9",
};

const currency = createSlice({
  name: "currency",
  initialState: initialState,
  reducers: {
    setCurrency: (state, action) => {
      state.currency_code = action.payload.currency_code;
      state.currency_symbol = action.payload.currency_symbol;
    },
  },
});

export const { setCurrency } = currency.actions;
export default currency.reducer;
