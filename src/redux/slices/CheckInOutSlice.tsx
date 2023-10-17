import { createSlice } from "@reduxjs/toolkit";
import moment from "moment";
const checkInDate = moment().format("DD-MMM-YYYY");
const checkOutDate = moment().add(1, "days").format("DD-MMM-YYYY");
const initialSate = {
  checkIndate: checkInDate,
  checkOutdate: checkOutDate,
  selectedDates: [],
};

const CheckInOutSlice = createSlice({
  name: "checkIn",
  initialState: initialSate,
  reducers: {
    setCheckIn: (state, action) => {
      state.checkIndate = action.payload;
    },
    setCheckOut: (state, action) => {
      state.checkOutdate = action.payload;
    },
    setSelectdDates: (state, action) => {
      state.selectedDates = action.payload;
    },
    resetCheckInOut: (state) => {
      state.checkIndate = "";
      state.checkOutdate = "";
      state.selectedDates = [];
    },
  },
});

export const { setCheckIn, setCheckOut, setSelectdDates, resetCheckInOut } =
  CheckInOutSlice.actions;
export default CheckInOutSlice.reducer;
