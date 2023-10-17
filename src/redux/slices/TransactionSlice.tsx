import { createSlice } from "@reduxjs/toolkit";

const TransactionSlice = createSlice({
  name: "transaction",
  initialState: {
    transaction: {},
  },
  reducers: {
    setTransaction: (state, action) => {
      state.transaction = action.payload;
    },
  },
});

export const { setTransaction } = TransactionSlice.actions;
export default TransactionSlice.reducer;
