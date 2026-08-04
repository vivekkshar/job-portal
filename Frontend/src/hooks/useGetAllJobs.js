
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import API from "../services/axios";
import {
  setJobs,
  setLoading,
} from "../redux/slices/jobSlice";

const useGetAllJobs = (filters = {}) => {
  const dispatch = useDispatch();

  const {
    keyword = "",
    location = "",
    jobType = "",
    page = 1,
    limit = 10,
  } = filters;

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        dispatch(setLoading(true));

        const params = new URLSearchParams();

        if (keyword) {
          params.append("keyword", keyword);
        }

        if (location) {
          params.append("location", location);
        }

        if (jobType) {
          params.append("jobType", jobType);
        }

        params.append("page", page);
        params.append("limit", limit);

        const res = await API.get(
          `/jobs/getjobs?${params.toString()}`
        );

        if (res.data.success) {
          dispatch(setJobs(res.data.jobs));

          return {
            totalJobs: res.data.totalJobs,
            totalPages: res.data.totalPages,
            currentPage: res.data.page,
          };
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch jobs"
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchJobs();
  }, [
    dispatch,
    keyword,
    location,
    jobType,
    page,
    limit,
  ]);
};

export default useGetAllJobs;

