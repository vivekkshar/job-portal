import { configureStore } from "@reduxjs/toolkit";

import authReducer from "./slices/authSlice";
import jobReducer from "./slices/jobSlice";
import companyReducer from "./slices/companySlice";
import applicationReducer from "./slices/applicationSlice";
import dashboardReducer from "./slices/dashboardSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    job: jobReducer,
    company: companyReducer,
    application: applicationReducer,
    dashboard: dashboardReducer,
  },
});

export default store;