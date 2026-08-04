import { useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../services/axios";
import { setCompanies, setLoading } from "../redux/slices/companySlice";
import toast from "react-hot-toast";

const useGetCompanies = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        dispatch(setLoading(true));

        const res = await API.get("/company/my");

        if (res.data.success) {
          dispatch(setCompanies(res.data.companies));
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "Failed to fetch companies"
        );
      } finally {
        dispatch(setLoading(false));
      }
    };

    fetchCompanies();
  }, [dispatch]);
};

export default useGetCompanies;