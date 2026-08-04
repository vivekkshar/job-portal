import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  companies: [],
  singleCompany: null,
};

const companySlice = createSlice({
  name: "company",

  initialState,

  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setCompanies: (state, action) => {
      state.companies = action.payload;
    },

    setSingleCompany: (state, action) => {
      state.singleCompany = action.payload;
    },
  },
});

export const {
  setLoading,
  setCompanies,
  setSingleCompany,
} = companySlice.actions;

export default companySlice.reducer;