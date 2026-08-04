import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/axios";

const Dashboard = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const res = await API.get("/applications/my-applications");

        if (res.data.success) {
          setApplications(res.data.applications || []);
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            "Failed to load dashboard"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const total = applications.length;

  const pending = applications.filter(
    (app) => app.status === "Pending"
  ).length;

  const reviewed = applications.filter(
    (app) => app.status === "Reviewed"
  ).length;

  const shortlisted = applications.filter(
    (app) => app.status === "Shortlisted"
  ).length;

  const rejected = applications.filter(
    (app) => app.status === "Rejected"
  ).length;

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
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Track your job applications and their status.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Total Applications
            </p>

            <h2 className="text-3xl font-bold mt-2">
              {total}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Pending
            </p>

            <h2 className="text-3xl font-bold mt-2 text-yellow-600">
              {pending}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Shortlisted
            </p>

            <h2 className="text-3xl font-bold mt-2 text-green-600">
              {shortlisted}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <p className="text-gray-500">
              Rejected
            </p>

            <h2 className="text-3xl font-bold mt-2 text-red-600">
              {rejected}
            </h2>
          </div>

        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-xl shadow mt-8">

          <div className="p-6 border-b">
            <h2 className="text-xl font-bold">
              Recent Applications
            </h2>
          </div>

          {applications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              No applications yet.
            </div>
          ) : (
            <div className="divide-y">

              {applications.slice(0, 5).map((application) => {

                const job = application.job;
                const company = job?.company;

                return (
                  <div
                    key={application._id}
                    className="p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        {job?.title || "Job"}
                      </h3>

                      <p className="text-gray-500">
                        {company?.name || "Company"}
                      </p>

                      <p className="text-sm text-gray-400 mt-1">
                        Applied on{" "}
                        {new Date(
                          application.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    <span
                      className={`px-4 py-2 rounded-full text-sm font-semibold ${
                        application.status === "Shortlisted"
                          ? "bg-green-100 text-green-700"
                          : application.status === "Rejected"
                          ? "bg-red-100 text-red-700"
                          : application.status === "Reviewed"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {application.status}
                    </span>
                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Dashboard;