import { useEffect } from "react";
import { useDispatch } from "react-redux";
import API from "../services/axios";
import { setUser, setAuthLoading } from "../redux/slices/authSlice";

const useGetCurrentUser = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchUser = async () => {
      dispatch(setAuthLoading(true));

      try {
        const res = await API.get("/auth/me");

        if (res.data.success) {
          dispatch(setUser(res.data.user));
        }
      } catch (error) {
        console.log(error);
      } finally {
        dispatch(setAuthLoading(false));
      }
    };

    fetchUser();
  }, [dispatch]);
};

export default useGetCurrentUser;