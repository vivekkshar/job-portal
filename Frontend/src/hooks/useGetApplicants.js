import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import API from "../services/axios";
import { setApplicants, setLoading } from "../redux/slices/jobSlice";

const useGetApplicants = () => {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        dispatch(setLoading(true));

        const res = await API.get(`/applications/job/${id}`);

        if (res.data.success) {
          dispatch(setApplicants(res.data.applications));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setLoading(false));
      }
    };

    if (id) {
      fetchApplicants();
    }
  }, [id, dispatch]);
};

export default useGetApplicants;