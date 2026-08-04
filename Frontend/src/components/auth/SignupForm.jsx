import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/axios";
import { useSelector } from "react-redux";
import { setLoading } from "../../redux/slices/authSlice";
import { useState } from "react";
import { Link } from "react-router-dom";

const SignupForm = () => {
  const [input, setInput] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    role: "jobseeker",
    profilePhoto: null,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((store) => store.auth);

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const fileChangeHandler = (e) => {
    setInput({
      ...input,
      profilePhoto: e.target.files[0],
    });
  };

  const submitHandler = async (e) => {
  e.preventDefault();

  const formData = new FormData();

  formData.append("fullName", input.fullName);
  formData.append("email", input.email);
  formData.append("phoneNumber", input.phoneNumber);
  formData.append("password", input.password);
  formData.append("role", input.role);

  if (input.profilePhoto) {
    formData.append("file", input.profilePhoto);
  }

  try {
    dispatch(setLoading(true));

    const res = await API.post("/auth/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (res.data.success) {
      toast.success(res.data.message);
      navigate("/login");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Registration failed"
    );
  } finally {
    dispatch(setLoading(false));
  }
};

  return (
    <div className="w-full max-w-lg bg-white shadow-lg rounded-xl p-8">

      <h1 className="text-3xl font-bold text-center">
        Create Account
      </h1>

      <p className="text-center text-gray-500 mt-2">
        Register to find your dream job
      </p>

      <form onSubmit={submitHandler} className="mt-8">

        {/* Full Name */}

        <div className="mb-4">
          <label className="font-medium">Full Name</label>

          <input
            type="text"
            name="fullName"
            value={input.fullName}
            onChange={changeEventHandler}
            className="w-full border rounded-lg p-3 mt-2"
            placeholder="Enter full name"
          />
        </div>

        {/* Email */}

        <div className="mb-4">
          <label className="font-medium">Email</label>

          <input
            type="email"
            name="email"
            value={input.email}
            onChange={changeEventHandler}
            className="w-full border rounded-lg p-3 mt-2"
            placeholder="Enter email"
          />
        </div>

        {/* Phone */}

        <div className="mb-4">
          <label className="font-medium">Phone Number</label>

          <input
            type="text"
            name="phoneNumber"
            value={input.phoneNumber}
            onChange={changeEventHandler}
            className="w-full border rounded-lg p-3 mt-2"
            placeholder="Enter phone number"
          />
        </div>

        {/* Password */}

        <div className="mb-4">
          <label className="font-medium">Password</label>

          <input
            type="password"
            name="password"
            value={input.password}
            onChange={changeEventHandler}
            className="w-full border rounded-lg p-3 mt-2"
            placeholder="Enter password"
          />
        </div>

        {/* Role */}

        <div className="mb-4">
          <label className="font-medium block mb-2">
            Select Role
          </label>

          <div className="flex gap-6">

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

        {/* Profile Photo */}

        <div className="mb-6">
          <label className="font-medium">
            Profile Photo
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={fileChangeHandler}
            className="w-full mt-2"
          />
        </div>

        {/* Button */}

        <button
             type="submit"
             disabled={loading}
             className="w-full bg-blue-600 text-white py-3 rounded-lg disabled:opacity-50"
           >
             {loading ? "Creating Account..." : "Signup"}
           </button>

      </form>

      <p className="text-center mt-6">

        Already have an account?

        <Link
          to="/login"
          className="text-blue-600 ml-2 font-semibold"
        >
          Login
        </Link>

      </p>

    </div>
  );
};

export default SignupForm;