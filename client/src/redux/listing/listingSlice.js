import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  listing: {},
  listings: [],
  error: null,
  loading: false,
};

const listingSlice = createSlice({
  name: "Listing",
  initialState,
  reducers: {
    createListingStart: (state) => {
      state.loading = true;
    },
    createListingSuccess: (state, action) => {
      state.listing = action.payload;
      state.loading = false;
      state.error = null;
    },
    createListingFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  createListingStart,
  createListingSuccess,
  createListingFailure,
} = listingSlice.actions;

export default listingSlice.reducer;
