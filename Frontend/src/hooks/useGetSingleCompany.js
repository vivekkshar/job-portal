import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import API from "../services/axios";
import { setLoading, setSingleCompany } from "../redux/slices/companySlice";
import toast from "react-hot-toast";

const useGetSingleCompany = (id) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchSingleCompany = async () => {
      try {
        dispatch(setLoading(true));

        const res = await API.get(`/company/${id}`);

        if (res.data.success) {
          dispatch(setSingleCompany(res.data.company || null));
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch company"
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (id) {
      fetchSingleCompany();
    }
  }, [id, dispatch]);
};

export default useGetSingleCompany;