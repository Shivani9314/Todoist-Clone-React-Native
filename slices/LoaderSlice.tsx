import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from '../store/store'; 

interface LoaderState {
  loading: boolean;
}

const loaderSlice = createSlice({
  name: "loader",
  initialState: {
    loading: false,
  } as LoaderState,
  reducers: {
    showLoader: (state) => {
      state.loading = true;
    },
    hideLoader: (state) => {
      state.loading = false;
    },
  },
});

export const { showLoader, hideLoader } = loaderSlice.actions;
export const selectLoader = (state: RootState) => state.loader.loading;

export default loaderSlice.reducer;
