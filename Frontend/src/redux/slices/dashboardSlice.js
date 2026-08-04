import { createSlice } from "@reduxjs/toolkit";

const dashboardSlice = createSlice({
  name: "dashboard",

  initialState: {
    stats: null,
    loading: false,
  },

  reducers: {
    setDashboardStats: (state, action) => {
      state.stats = action.payload;
    },

    setDashboardLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  setDashboardStats,
  setDashboardLoading,
} = dashboardSlice.actions;

export default dashboardSlice.reducer;