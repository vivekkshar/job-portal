
import { useEffect, useState } from "react";
import API from "../services/axios";
import toast from "react-hot-toast";

const useGetExternalJobs = (filters = {}) => {
  const [externalJobs, setExternalJobs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchExternalJobs = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (filters.keyword) {
          params.append("keyword", filters.keyword);
        }

        if (filters.location) {
          params.append("location", filters.location);
        }

        const res = await API.get(
          `/jobs/external?${params.toString()}`
        );

        if (res.data.success) {
          setExternalJobs(res.data.jobs || []);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch external jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchExternalJobs();
  }, [filters.keyword, filters.location]);

  return {
    externalJobs,
    loading,
  };
};

export default useGetExternalJobs;