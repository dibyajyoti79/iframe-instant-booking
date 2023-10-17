import { createSlice } from "@reduxjs/toolkit";

const FilterSlice = createSlice({
  name: "filter",
  initialState: {
    filteritems: [],
    selectedFilter: 0,
  },
  reducers: {
    setFilter: (state, action) => {
      state.filteritems = action.payload;
    },
    setSelectedFilter: (state, action) => {
      state.selectedFilter = action.payload;
    },
  },
});

export const { setFilter, setSelectedFilter } = FilterSlice.actions;
export default FilterSlice.reducer;
