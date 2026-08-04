import { useState } from "react";
import { Search, MapPin, BriefcaseBusiness, X } from "lucide-react";

const JobSearch = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const [jobType, setJobType] = useState("");

  const submitHandler = (e) => {
    e.preventDefault();

    onSearch({
      keyword,
      location,
      jobType,
    });
  };

  const clearHandler = () => {
    setKeyword("");
    setLocation("");
    setJobType("");

    onSearch({
      keyword: "",
      location: "",
      jobType: "",
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border p-5 mb-8">

      <form
        onSubmit={submitHandler}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
      >

        {/* Keyword */}
        <div className="relative">
          <Search
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Job title or keyword"
            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Location */}
        <div className="relative">
          <MapPin
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location"
            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Job Type */}
        <div className="relative">
          <BriefcaseBusiness
            size={20}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          />

          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full border rounded-lg pl-10 pr-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>
        </div>

        {/* Buttons */}
        <div className="flex gap-2">

          <button
            type="submit"
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition"
          >
            Search
          </button>

          <button
            type="button"
            onClick={clearHandler}
            className="px-4 border rounded-lg hover:bg-gray-100 transition"
            title="Clear filters"
          >
            <X size={20} />
          </button>

        </div>

      </form>
    </div>
  );
};

export default JobSearch;