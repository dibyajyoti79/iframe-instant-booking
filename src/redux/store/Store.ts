import { configureStore } from "@reduxjs/toolkit";
import StatusReducer from "../slices/StatusSlice";
import CheckInOutReducer from "../slices/CheckInOutSlice";
import RoomSlice from "../slices/RoomSlice";
import CurrencySlice from "../slices/CurrencySlice";
import FilterSlice from "../slices/FilterSlice";
import GstSlice from "../slices/GstSlice";
import TransactionSlice from "../slices/TransactionSlice";
import BookingStatusSlice from "../slices/BookingStatusSlice";
import HotelInfoSlice from "../slices/HotelInfoSlice";

export default configureStore({
  reducer: {
    status: StatusReducer,
    checkInOut: CheckInOutReducer,
    roomDetails: RoomSlice,
    currency: CurrencySlice,
    filter: FilterSlice,
    gstSlab: GstSlice,
    transaction: TransactionSlice,
    bookingStatus: BookingStatusSlice,
    hotelInfo: HotelInfoSlice,
  },
});
