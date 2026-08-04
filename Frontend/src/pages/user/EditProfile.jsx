import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";

import API from "../../services/axios";
import { setUser } from "../../redux/slices/authSlice";

const EditProfile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user } = useSelector((store) => store.auth);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    fullName: user?.fullName || "",
    phoneNumber: user?.profile?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
  });

  const [profilePhoto, setProfilePhoto] = useState(null);
  const [resume, setResume] = useState(null);

  const changeHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("fullName", input.fullName);
      formData.append("phoneNumber", input.phoneNumber);
      formData.append("bio", input.bio);
      formData.append("skills", input.skills);

      if (profilePhoto) {
        formData.append("profilePhoto", profilePhoto);
      }

      if (resume) {
        formData.append("resume", resume);
      }

      const res = await API.put(
        "/auth/profile/update",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
        navigate("/profile");
      }

    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Profile update failed"
      );
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Profile
        </h1>

        <form
          onSubmit={submitHandler}
          className="space-y-6"
        >

          <div>
            <label className="block mb-2 font-medium">
              Full Name
            </label>

            <input
              type="text"
              name="fullName"
              value={input.fullName}
              onChange={changeHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Phone Number
            </label>

            <input
              type="text"
              name="phoneNumber"
              value={input.phoneNumber}
              onChange={changeHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Bio
            </label>

            <textarea
              rows={4}
              name="bio"
              value={input.bio}
              onChange={changeHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Tell recruiters about yourself"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Skills
            </label>

            <input
              type="text"
              name="skills"
              value={input.skills}
              onChange={changeHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Profile Photo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                setProfilePhoto(e.target.files[0])
              }
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Resume (PDF)
            </label>

            <input
              type="file"
              accept=".pdf"
              onChange={(e) =>
                setResume(e.target.files[0])
              }
            />
          </div>

          <div className="flex gap-4 pt-4">

            <button
              type="button"
              onClick={() => navigate("/profile")}
              className="px-6 py-3 border rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-lg"
            >
              {loading ? "Updating..." : "Update Profile"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditProfile;