import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import API from "../../services/axios";
import useGetCompanies from "../../hooks/useGetCompanies";

const CreateJob = () => {
  const navigate = useNavigate();

  useGetCompanies();

  const { companies } = useSelector((store) => store.company);

  const [loading, setLoading] = useState(false);

  const [input, setInput] = useState({
    title: "",
    description: "",
    requirements: "",
    salary: "",
    location: "",
    experience: "",
    jobType: "",
    position: "",
    vacancies: "",
    company: "",
  });

  const changeEventHandler = (e) => {
    setInput({
      ...input,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...input,
        requirements: input.requirements
          .split(",")
          .map((item) => item.trim()),
      };

      const res = await API.post("/jobs/create", payload);

      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/admin/jobs");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to create job"
      );
    } finally {
      setLoading(false);
    }
  };
    return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-xl p-8">

        <h1 className="text-3xl font-bold mb-8">
          Create Job
        </h1>

        <form
          onSubmit={submitHandler}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >

          <div>
            <label className="block mb-2 font-medium">
              Job Title
            </label>

            <input
              type="text"
              name="title"
              value={input.title}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="MERN Stack Developer"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Salary (LPA)
            </label>

            <input
              type="number"
              name="salary"
              value={input.salary}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="12"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Experience (Years)
            </label>

            <input
              type="number"
              name="experience"
              value={input.experience}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="2"
              required
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
              placeholder="Delhi"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Job Type
            </label>

            <select
              name="jobType"
              value={input.jobType}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              required
            >
              <option value="">Select Job Type</option>
              <option value="Full-Time">Full-Time</option>
              <option value="Part-Time">Part-Time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
            </select>
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Position
            </label>

            <input
              type="number"
              name="position"
              value={input.position}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="2"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Vacancies
            </label>

            <input
              type="number"
              name="vacancies"
              value={input.vacancies}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="5"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Company
            </label>

            <select
              name="company"
              value={input.company}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              required
            >
              <option value="">Select Company</option>

              {companies.map((company) => (
                <option
                  key={company._id}
                  value={company._id}
                >
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">
              Requirements
            </label>

            <input
              type="text"
              name="requirements"
              value={input.requirements}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="React, Node.js, Express, MongoDB"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block mb-2 font-medium">
              Description
            </label>

            <textarea
              rows={6}
              name="description"
              value={input.description}
              onChange={changeEventHandler}
              className="w-full border rounded-lg px-4 py-3"
              placeholder="Write complete job description..."
              required
            />
          </div>

          <div className="md:col-span-2 flex gap-4">

            <button
              type="button"
              onClick={() => navigate("/admin/jobs")}
              className="px-6 py-3 border rounded-lg"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg disabled:bg-gray-400"
            >
              {loading ? "Creating..." : "Create Job"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
};

export default CreateJob;