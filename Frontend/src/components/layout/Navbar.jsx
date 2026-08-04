import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import API from "../../services/axios";
import { logoutUser } from "../../redux/slices/authSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logoutHandler = async () => {
  try {
    const res = await API.get("/auth/logout");

    if (res.data.success) {
      dispatch(logoutUser());

      toast.success(res.data.message);

      navigate("/login");
    }
  } catch (error) {
    toast.error(
      error.response?.data?.message || "Logout Failed"
    );
  }
};

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">

        {/* Logo */}
        <Link to="/" className="text-2xl font-bold">
          Job<span className="text-blue-600">Portal</span>
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex items-center gap-8">

          <Link to="/">Home</Link>

          <Link to="/jobs">Jobs</Link>

          {/* <Link to="/browse">Browse</Link> */}

          {!user ? (
            <>
              <Link
                to="/login"
                className="border px-4 py-2 rounded-md"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="bg-blue-600 text-white px-4 py-2 rounded-md"
              >
                Signup
              </Link>
            </>
          ) : (
            <>
              <Link to="/profile">Profile</Link>

              <button onClick={logoutHandler} className="bg-red-500 text-white px-4 py-2 rounded-md">
                Logout
              </button>
            </>
          )}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="md:hidden bg-white shadow-md">

          <div className="flex flex-col gap-4 p-5">

            <Link to="/">Home</Link>

            <Link to="/jobs">Jobs</Link>

            <Link to="/browse">Browse</Link>

            {!user ? (
              <>
                <Link
                  to="/login"
                  className="border p-2 rounded-md text-center"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  className="bg-blue-600 text-white p-2 rounded-md text-center"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link to="/profile">Profile</Link>

                <button
                    onClick={logoutHandler}
                    className="bg-red-500 text-white px-4 py-2 rounded-md"
                  >
                    Logout
                  </button>
              </>
            )}

          </div>

        </div>
      )}
    </nav>
  );
};

export default Navbar;