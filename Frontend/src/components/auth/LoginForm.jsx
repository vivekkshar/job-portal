import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/axios";

import { setLoading, setUser } from "../../redux/slices/authSlice";

const LoginForm = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
    role: "jobseeker",
  });

  const { loading } = useSelector((store) => store.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      dispatch(setLoading(true));

      const res = await API.post("/auth/login", input);

      if (res.data.success) {
        dispatch(setUser(res.data.user));

        toast.success(res.data.message);

        if (res.data.user.role === "recruiter") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="w-full max-w-md bg-white shadow-lg rounded-xl p-8">
      <h1 className="text-3xl font-bold text-center">Welcome Back</h1>

      <p className="text-center text-gray-500 mt-2">Login to your account</p>

      <form onSubmit={submitHandler} className="mt-8">
        {/* Email */}

        <div className="mb-5">
          <label className="font-medium">Email</label>

          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            placeholder="Enter your email"
            className="w-full mt-2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Password */}

        <div className="mb-5">
          <label className="font-medium">Password</label>

          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            placeholder="Enter password"
            className="w-full mt-2 border rounded-lg p-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Role */}

        <div className="mb-6">
          <label className="font-medium block mb-2">Select Role</label>

          <div className="flex gap-5">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="jobseeker"
                checked={input.role === "jobseeker"}
                onChange={changeEventHandler}
              />
              Job Seeker
            </label>

            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="role"
                value="recruiter"
                checked={input.role === "recruiter"}
                onChange={changeEventHandler}
              />
              Recruiter
            </label>
          </div>
        </div>

        {/* Button */}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>

      <p className="text-center mt-6 ">
        Don't have an account?
        <Link to="/signup" className="text-blue-600 ml-2 font-medium">
          Signup
        </Link>
        
      </p>
      <Link
          to="/forgot-password"
          className="text-blue-600 hover:underline text-sm"
        >
          Forgot Password?
        </Link>
    </div>
  );
};

export default LoginForm;
