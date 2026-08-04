import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import API from "../../services/axios";
import useGetSingleCompany from "../../hooks/useGetSingleCompany";

const EditCompany = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const { singleCompany, loading } = useSelector(
    (store) => store.company
  );

  useGetSingleCompany(id);

  const [input, setInput] = useState({
    name: "",
    website: "",
    location: "",
    description: "",
    logo: null,
  });

  useEffect(() => {
    if (singleCompany) {
      setInput({
        name: singleCompany.name || "",
        website: singleCompany.website || "",
        location: singleCompany.location || "",
        description: singleCompany.description || "",
        logo: null,
      });
    }
  }, [singleCompany]);

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
      const formData = new FormData();

      formData.append("name", input.name);
      formData.append("website", input.website);
      formData.append("location", input.location);
      formData.append("description", input.description);

      if (input.logo) {
        formData.append("logo", input.logo);
      }

      const res = await API.put(`/company/${id}`, formData, {
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
        error.response?.data?.message || "Failed to update company"
      );
    }
  };

  if (loading || !singleCompany) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-2xl font-semibold">Loading company details...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Edit Company
        </h1>

        <form onSubmit={submitHandler} className="space-y-6">

          <div>
            <label className="block mb-2 font-medium">
              Company Name
            </label>

            <input
              type="text"
              name="name"
              value={input.name}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
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
              className="w-full border rounded-lg px-4 py-3"
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
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={5}
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {singleCompany?.logo?.url && (
            <div>
              <label className="block mb-2 font-medium">
                Current Logo
              </label>

              <img
                src={singleCompany.logo.url}
                alt="Company Logo"
                className="h-24 w-24 object-cover rounded-lg border"
              />
            </div>
          )}

          <div>
            <label className="block mb-2 font-medium">
              Update Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={fileChangeHandler}
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
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg"
            >
              Update Company
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default EditCompany;