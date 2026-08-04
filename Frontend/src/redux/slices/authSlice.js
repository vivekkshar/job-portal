import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  authLoading: true,
  user: null,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",

  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthLoading: (state, action) => {
      state.authLoading = action.payload;
    },

    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
    },

    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
    },
  },
});

export const {
  setLoading,
  setAuthLoading,
  setUser,
  logoutUser,
} = authSlice.actions;

export default authSlice.reducer;