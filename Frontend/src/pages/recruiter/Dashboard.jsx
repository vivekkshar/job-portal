
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";

import Sidebar from "../../components/recruiter/Sidebar";
import API from "../../services/axios";
import useGetAdminJobs from "../../hooks/useGetAdminJobs";

const Dashboard = () => {
  useGetAdminJobs();

  const { adminJobs = [], loading } = useSelector(
    (store) => store.job
  );

  const [applicantsCount, setApplicantsCount] = useState(0);
  const [shortlistedCount, setShortlistedCount] = useState(0);

  useEffect(() => {
    const fetchApplicants = async () => {
      if (!adminJobs.length) {
        setApplicantsCount(0);
        setShortlistedCount(0);
        return;
      }

      try {
        const results = await Promise.all(
          adminJobs.map((job) =>
            API.get(`/applications/job/${job._id}`)
          )
        );

        let totalApplicants = 0;
        let totalShortlisted = 0;

        results.forEach((res) => {
          if (res.data.success) {
            const applications = res.data.applications || [];

            totalApplicants += applications.length;

            totalShortlisted += applications.filter(
              (application) =>
                application.status === "Shortlisted"
            ).length;
          }
        });

        setApplicantsCount(totalApplicants);
        setShortlistedCount(totalShortlisted);
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to fetch applicants"
        );
      }
    };

    fetchApplicants();
  }, [adminJobs]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-6 md:p-10">
        <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Recruiter Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your jobs and track applicants.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Total Jobs
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {adminJobs.length}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Total Applicants
            </p>

            <h2 className="text-3xl font-bold mt-2 text-blue-600">
              {applicantsCount}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Shortlisted
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {shortlistedCount}
            </h2>
          </div>

        </div>

        {/* Recent Jobs */}
        <div className="bg-white rounded-xl shadow mt-8">

          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">
              Recent Jobs
            </h2>
          </div>

          {adminJobs.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No jobs created yet.
            </div>
          ) : (
            <div className="divide-y">

              {adminJobs.slice(0, 5).map((job) => (
                <div
                  key={job._id}
                  className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                >
                  <div>
                    <h3 className="font-semibold text-lg">
                      {job.title}
                    </h3>

                    <p className="text-gray-500">
                      {job.company?.name || "Company"}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      {job.location} • {job.jobType}
                    </p>
                  </div>

                  <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold">
                    {job.vacancies} Vacancies
                  </span>
                </div>
              ))}

            </div>
          )}

        </div>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;
