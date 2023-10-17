import { createSlice } from "@reduxjs/toolkit";

const GstSlice = createSlice({
  name: "gst",
  initialState: {
    gstSlab: {},
  },
  reducers: {
    setGSTSlab: (state, action) => {
      state.gstSlab = action.payload;
    },
  },
});

export const { setGSTSlab } = GstSlice.actions;
export default GstSlice.reducer;
