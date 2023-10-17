import { createSlice } from "@reduxjs/toolkit";

const HotelInfoSlice = createSlice({
  name: "hotelInfo",
  initialState: {
    hotelInfo: null,
  },
  reducers: {
    setHotelInfo: (state, action) => {
      state.hotelInfo = action.payload;
    },
  },
});

export const { setHotelInfo } = HotelInfoSlice.actions;
export default HotelInfoSlice.reducer;
