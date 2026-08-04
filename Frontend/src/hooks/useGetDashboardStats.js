import { useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../services/axios";

import {
  setDashboardStats,
  setDashboardLoading,
} from "../redux/slices/dashboardSlice";

const useGetDashboardStats = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        dispatch(setDashboardLoading(true));

        const res = await API.get("/dashboard/recruiter");

        if (res.data.success) {
          dispatch(setDashboardStats(res.data.dashboard));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setDashboardLoading(false));
      }
    };

    fetchStats();
  }, [dispatch]);
};

export default useGetDashboardStats;