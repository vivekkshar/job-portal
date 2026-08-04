
import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/axios";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email) {
      toast.error("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const res = await API.post("/auth/forgot-password", {
        email,
      });

      if (res.data.success) {
        toast.success(res.data.message);

        // Development testing only
        if (res.data.resetUrl) {
          console.log("Reset URL:", res.data.resetUrl);
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-gray-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 border border-gray-200">
        <h1 className="text-3xl font-bold text-center text-gray-800">Forgot Password</h1>
        <p className="text-gray-500 text-center mt-2 mb-8">
          Enter your registered email and we’ll send you a reset link.
        </p>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <label className="block font-medium mb-2 text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold disabled:opacity-50 transition-colors"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link to="/login" className="text-blue-600 hover:underline font-medium">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;

