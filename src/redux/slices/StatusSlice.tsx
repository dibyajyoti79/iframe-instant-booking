import { createSlice } from "@reduxjs/toolkit";

const statusSlice = createSlice({
  name: "status",
  initialState: { status: 2 },
  reducers: {
    //actions
    nextToPage2: (state) => {
      state.status = 2;
    },
    nextToPage3: (state) => {
      state.status = 3;
    },
    nextToPage4: (state) => {
      state.status = 4;
    },
    prevToPage1: (state) => {
      state.status = 1;
    },
    prevToPage2: (state) => {
      state.status = 2;
    },
  },
});

//export for actions
export const {
  nextToPage2,
  nextToPage3,
  nextToPage4,
  prevToPage1,
  prevToPage2,
} = statusSlice.actions;

//export for reducer
export default statusSlice.reducer;
