import { useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../services/axios";
import { setLoading, setSingleJob } from "../redux/slices/jobSlice";
import toast from "react-hot-toast";

const useGetSingleJob = (jobId) => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (!jobId) return;

    const fetchSingleJob = async () => {
      try {
        dispatch(setLoading(true));

        const res = await API.get(`/jobs/${jobId}`);

        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch job"
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchSingleJob();
  }, [jobId, dispatch]);
};

export default useGetSingleJob;