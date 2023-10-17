import { createSlice } from "@reduxjs/toolkit";

type Room = {
  id: number;
  roomNo: number;
  adults: number;
  childs: number;
};

type Rooms = {
  id: number;
  roomType: string;
  mealPlan: string;
  price: number;
  rooms: Room[];
};

const initialvalue: any = [];

const initialState = {
  roomDetails: initialvalue,
  apiData: [],
  currency: "",
  totalnoOfRooms: 0,
  totalPrice: 0,
  totalnoOfPersons: 0,
};

const RoomSlice = createSlice({
  name: "room",
  initialState: initialState,
  reducers: {
    setRoomPayload: (state, action) => {
      state.roomDetails = action.payload;
    },
    setApiData: (state, action) => {
      state.apiData = action.payload;
    },
    setTotalnoOfRooms: (state, action) => {
      state.totalnoOfRooms = action.payload;
    },
    setTotalRoomPrice: (state, action) => {
      state.totalPrice = action.payload;
    },
    setTotalnoOfPersons: (state, action) => {
      state.totalnoOfPersons = action.payload;
    },
    setCurreny: (state, action) => {
      state.currency = action.payload;
    },
    resetRoomPayload: (state) => {
      state.roomDetails = initialvalue;
      state.apiData = [];
      state.totalnoOfRooms = 0;
      state.totalPrice = 0;
      state.totalnoOfPersons = 0;
    },
  },
});

export const {
  setRoomPayload,
  resetRoomPayload,
  setApiData,
  setTotalnoOfRooms,
  setTotalRoomPrice,
  setTotalnoOfPersons,
  setCurreny,
} = RoomSlice.actions;
export default RoomSlice.reducer;
