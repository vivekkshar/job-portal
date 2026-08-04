import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  loading: false,
  jobs: [],
  adminJobs: [],
  singleJob: null,
  searchJob: "",
  applicants: [],
  totalJobs: 0,
  totalPages: 1,
  currentPage: 1,  
};

const jobSlice = createSlice({
  name: "job",
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload;
    },

    setJobs: (state, action) => {
      state.jobs = action.payload;
    },

    setAdminJobs: (state, action) => {
      state.adminJobs = action.payload;
    },

    setSingleJob: (state, action) => {
      state.singleJob = action.payload;
    },

    setSearchQuery: (state, action) => {
      state.searchJob = action.payload;
    },
    setApplicants: (state, action) => {
      state.applicants = action.payload;
    },
    setPagination: (state, action) => {
      state.totalJobs = action.payload.totalJobs;
      state.totalPages = action.payload.totalPages;
      state.currentPage = action.payload.currentPage;
    },
  },
});

export const {
  setLoading,
  setJobs,
  setAdminJobs,
  setSingleJob,
  setSearchQuery,
  setApplicants,
  setPagination,
} = jobSlice.actions;

export default jobSlice.reducer;
