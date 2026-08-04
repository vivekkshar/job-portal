import { useEffect, useCallback } from "react";
import { useDispatch } from "react-redux";
import API from "../services/axios";
import { setAdminJobs, setLoading } from "../redux/slices/jobSlice";

const useGetAdminJobs = () => {
  const dispatch = useDispatch();

  const fetchAdminJobs = useCallback(async () => {
    try {
      dispatch(setLoading(true));

      const res = await API.get("/jobs/myjobs");

      if (res.data.success) {
        dispatch(setAdminJobs(res.data.jobs));
      }
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  useEffect(() => {
    fetchAdminJobs();
  }, [fetchAdminJobs]);

  return { fetchAdminJobs };
};

export default useGetAdminJobs;