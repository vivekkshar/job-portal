
import { useState } from "react";
import { useSelector } from "react-redux";
import JobCard from "../../components/job/JobCard";
import useGetAllJobs from "../../hooks/useGetAllJobs";
import useGetExternalJobs from "../../hooks/useGetExternalJobs";

const Jobs = () => {
  const [filters, setFilters] = useState({
    keyword: "",
    location: "",
    jobType: "",
    page: 1,
    limit: 10,
  });

  // Your MongoDB Jobs
  useGetAllJobs(filters);

  // External API Jobs
  const {
    externalJobs = [],
    loading: externalLoading,
  } = useGetExternalJobs(filters);

  const {
    jobs = [],
    loading,
    totalPages = 1,
    currentPage = 1,
  } = useSelector((store) => store.job);

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
      setFilters((prev) => ({
        ...prev,
        page: prev.page - 1,
      }));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const nextPage = () => {
    if (currentPage < totalPages) {
      setFilters((prev) => ({
        ...prev,
        page: prev.page + 1,
      }));

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  const goToPage = (pageNumber) => {
    setFilters((prev) => ({
      ...prev,
      page: pageNumber,
    }));

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <section className="max-w-7xl mx-auto py-10 sm:py-16 px-3 sm:px-4">

      {/* Heading */}
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-10">
        Find Your Dream Job
      </h2>

      {/* Search & Filters */}
      <div className="bg-white rounded-xl shadow-md border p-4 sm:p-5 mb-8 sm:mb-10">

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">

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
            className="border rounded-lg px-4 py-3 outline-none focus:ring-2 focus:ring-blue-500 bg-white w-full"
          >
            <option value="">All Job Types</option>
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Internship">Internship</option>
            <option value="Contract">Contract</option>
          </select>

        </div>

        {/* Clear */}
        <div className="mt-4 flex justify-start sm:justify-end">
          <button
            onClick={clearFilters}
            className="px-5 py-2 border rounded-lg hover:bg-gray-100"
          >
            Clear Filters
          </button>
        </div>

      </div>

      {/* ================= YOUR JOBS ================= */}

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">
            Jobs on Our Platform
          </h2>

          <span className="text-sm text-gray-500">
            {jobs.length} jobs
          </span>
        </div>

        {/* Loading */}
        {loading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              Loading jobs...
            </p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-gray-500">
              No Jobs Available
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
              />
            ))}

          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <>
            <div className="flex justify-center items-center gap-2 mt-12">

              {/* Previous */}
              <button
                onClick={previousPage}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                ← Previous
              </button>

              {/* Page Numbers */}
              <div className="flex gap-2">

                {Array.from(
                  { length: totalPages },
                  (_, index) => index + 1
                ).map((pageNumber) => (
                  <button
                    key={pageNumber}
                    onClick={() => goToPage(pageNumber)}
                    className={`w-10 h-10 rounded-lg border ${
                      currentPage === pageNumber
                        ? "bg-blue-600 text-white border-blue-600"
                        : "bg-white hover:bg-gray-100"
                    }`}
                  >
                    {pageNumber}
                  </button>
                ))}

              </div>

              {/* Next */}
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
              >
                Next →
              </button>

            </div>

            <p className="text-center text-sm text-gray-500 mt-4">
              Page {currentPage} of {totalPages}
            </p>
          </>
        )}
      </div>

      {/* ================= EXTERNAL JOBS ================= */}

      <div className="mt-20">

        <div className="mb-6">
          <h2 className="text-2xl font-bold">
            🌐 Jobs From External Sources
          </h2>

          <p className="text-gray-500 mt-1">
            Explore additional opportunities from external job boards.
          </p>
        </div>

        {externalLoading ? (
          <div className="text-center py-10">
            <p className="text-gray-500">
              Loading external jobs...
            </p>
          </div>
        ) : externalJobs.length === 0 ? (
          <div className="bg-white rounded-xl border p-8 text-center">
            <p className="text-gray-500">
              No external jobs found.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

            {externalJobs.map((job, index) => (
              <div
                key={job.slug || job.url || index}
                className="bg-white rounded-xl shadow-md border p-4 sm:p-6 hover:shadow-lg transition flex flex-col"
              >

                {/* External Badge */}
                <div className="flex justify-between items-start gap-3">

                  <span className="text-xs font-semibold bg-purple-100 text-purple-700 px-3 py-1 rounded-full">
                    External Job
                  </span>

                  {job.remote && (
                    <span className="text-xs font-semibold bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      Remote
                    </span>
                  )}

                </div>

                {/* Title */}
                <h3 className="text-xl font-bold text-gray-900 mt-4">
                  {job.title || "Job Title"}
                </h3>

                {/* Company */}
                <p className="text-gray-600 mt-2 font-medium">
                  {job.company_name || "Company"}
                </p>

                {/* Location */}
                <p className="text-sm text-gray-500 mt-4">
                  📍 {job.location || "Location not specified"}
                </p>

                {/* Job Type */}
                {job.job_types?.length > 0 && (
                  <p className="text-sm text-gray-500 mt-2">
                    💼 {job.job_types.join(", ")}
                  </p>
                )}

                {/* Description */}
                <div
                  className="text-sm text-gray-600 mt-4 line-clamp-3"
                  dangerouslySetInnerHTML={{
                    __html:
                      job.description ||
                      "No description available.",
                  }}
                />

                {/* Bottom */}
                <div className="mt-auto pt-6">

                  <div className="border-t pt-4 flex justify-between items-center">

                    <span className="text-xs text-gray-400">
                      Source: Arbeitnow
                    </span>

                    <a
                      href={job.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold w-full sm:w-auto text-center"
                    >
                      Apply Now →
                    </a>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </section>
  );
};

export default Jobs;
