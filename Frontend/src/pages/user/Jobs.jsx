
import { useState } from "react";
import { useSelector } from "react-redux";
import JobCard from "../../components/job/JobCard";
import useGetAllJobs from "../../hooks/useGetAllJobs";

const Jobs = () => {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
    page: 1,
    limit: 10,
  });

  useGetAllJobs(filters);

  const {
    jobs = [],
    loading,
    totalPages = 1,
    currentPage = 1,
  } = useSelector((store) => store.job);

  // Filter change
  const changeHandler = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
      page: 1,
    });
  };

  
  const clearFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      jobType: "",
      page: 1,
      limit: 10,
    });
  };

  
  const previousPage = () => {
    if (currentPage > 1) {
      setFilters({
        ...filters,
        page: currentPage - 1,
      });
    }
  };

  // Next page
  const nextPage = () => {
    if (currentPage < totalPages) {
      setFilters({
        ...filters,
        page: currentPage + 1,
      });
    }
  };

  return (
    <section className="max-w-7xl mx-auto py-16 px-4">

      {/* Heading */}
      <h2 className="text-3xl font-bold text-center mb-10">
        Find Your Dream Job
      </h2>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-md border p-5 mb-10">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          {/* Keyword */}
          <input
            type="text"
            name="keyword"
            value={filters.keyword}
            onChange={changeHandler}
            placeholder="Search job title..."
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Location */}
          <input
            type="text"
            name="location"
            value={filters.location}
            onChange={changeHandler}
            placeholder="Search location..."
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500"
          />

          {/* Job Type */}
          <select
            name="jobType"
            value={filters.jobType}
            onChange={changeHandler}
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          >
            <option value="">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

        </div>

        {/* Clear Filters */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={clearFilters}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>

      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            Loading jobs...
          </p>
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-center text-gray-500">
          No Jobs Available
        </p>
      ) : (
        <>
          {/* Jobs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
              />
            ))}

          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-5 mt-12">

              {/* Previous */}
              <button
                onClick={previousPage}
                disabled={currentPage === 1}
                className="px-5 py-2 border rounded-lg hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Page Number */}
              <span className="font-medium">
                Page {currentPage} of {totalPages}
              </span>

              {/* Next */}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next
              </button>

            </div>
          )}

        </>
      )}

    </section>
  );
};

export default Jobs;

