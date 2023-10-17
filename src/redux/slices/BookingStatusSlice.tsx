import { createSlice } from "@reduxjs/toolkit";

const BookingStatusSlice = createSlice({
  name: "booking_status",
  initialState: {
    booking_status: false,
    booking_loader_status: false,
    booking_invoice_id: null,
  },
  reducers: {
    setBookingStatus: (state, action) => {
      state.booking_status = action.payload;
    },
    setBookingLoaderStatus: (state, action) => {
      state.booking_loader_status = action.payload;
    },
    setBookingInvoiceId: (state, action) => {
      state.booking_invoice_id = action.payload;
    },
  },
});

export const { setBookingStatus, setBookingLoaderStatus, setBookingInvoiceId } =
  BookingStatusSlice.actions;
export default BookingStatusSlice.reducer;
