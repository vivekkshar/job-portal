import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import API from "../../services/axios";

const CreateCompany = () => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    name: "",
    website: "",
    location: "",
    description: "",
    logo: null,
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const fileChangeHandler = (e) => {
    setInput({
      ...input,
      logo: e.target.files[0],
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();

      formData.append("name", input.name);
      formData.append("website", input.website);
      formData.append("location", input.location);
      formData.append("description", input.description);

      if (input.logo) {
        formData.append("logo", input.logo);
      }
            const res = await API.post("/company", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/companies");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to create company"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg p-8">

        <h1 className="text-3xl font-bold mb-8">
          Create Company
        </h1>

        <form
          onSubmit={submitHandler}
          className="space-y-6"
        >

          <div>
            <label className="block mb-2 font-medium">
              Company Name
            </label>

            <input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter company name"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Website
            </label>

            <input
              type="text"
              name="website"
              value={input.website}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://example.com"
              
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Location
            </label>

            <input
              type="text"
              name="location"
              value={input.location}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Delhi"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              name="description"
              rows="5"
              value={input.description}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="About company..."
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Company Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
              className="w-full"
            />
          </div>

          <div className="flex gap-4">

            <button
              type="button"
              onClick={() => navigate("/admin/companies")}
              className="px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Company"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateCompany;