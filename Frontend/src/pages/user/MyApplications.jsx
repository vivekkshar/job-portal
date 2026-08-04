
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import API from "../../services/axios";

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchApplications = async () => {
    try {
      setLoading(true);

      const res = await API.get("/applications/my-applications");

      if (res.data.success) {
        setApplications(res.data.applications || []);
      } else {
        setApplications([]);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch applications"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadApplications = async () => {
      await fetchApplications();
    };

    loadApplications();
  }, []);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Shortlisted":
        return "bg-green-100 text-green-700";

      case "Rejected":
        return "bg-red-100 text-red-700";

      case "Reviewed":
        return "bg-blue-100 text-blue-700";

      default:
        return "bg-yellow-100 text-yellow-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500 text-lg">
          Loading applications...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            My Applications
          </h1>

          <p className="text-gray-500 mt-2">
            Track all your job applications and their status.
          </p>
        </div>

        {/* Empty State */}
        {applications.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">

            <h2 className="text-xl font-semibold">
              No Applications Yet
            </h2>

            <p className="text-gray-500 mt-2">
              You haven't applied for any jobs yet.
            </p>

          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">

            {applications.map((application) => {

              const job = application.job;
              const company = job?.company;

              return (
                <div
                  key={application._id}
                  className="bg-white rounded-xl shadow-md border p-6 hover:shadow-lg transition"
                >

                  {/* Job Header */}
                  <div className="flex items-start justify-between gap-4">

                    <div>
                      <h2 className="text-xl font-bold">
                        {job?.title || "Job Title"}
                      </h2>

                      <p className="text-gray-600 mt-1">
                        {company?.name || "Company"}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold whitespace-nowrap ${getStatusStyle(
                        application.status
                      )}`}
                    >
                      {application.status}
                    </span>

                  </div>

                  {/* Job Details */}
                  <div className="mt-5 space-y-2 text-sm text-gray-600">

                    <p>
                      📍{" "}
                      <span className="font-medium">
                        Location:
                      </span>{" "}
                      {job?.location || "N/A"}
                    </p>

                    <p>
                      💼{" "}
                      <span className="font-medium">
                        Job Type:
                      </span>{" "}
                      {job?.jobType || "N/A"}
                    </p>

                    <p>
                      💰{" "}
                      <span className="font-medium">
                        Salary:
                      </span>{" "}
                      ₹{job?.salary || "N/A"}
                    </p>

                    <p>
                      📅{" "}
                      <span className="font-medium">
                        Applied:
                      </span>{" "}
                      {application.createdAt
                        ? new Date(
                            application.createdAt
                          ).toLocaleDateString()
                        : "N/A"}
                    </p>

                  </div>

                  {/* Company */}
                  <div className="mt-5 pt-5 border-t flex items-center gap-3">

                    {company?.logo?.url ? (
                      <img
                        src={company.logo.url}
                        alt={company.name}
                        className="w-12 h-12 rounded-lg object-cover border"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-gray-200 flex items-center justify-center">
                        🏢
                      </div>
                    )}

                    <div>
                      <p className="font-semibold">
                        {company?.name || "Company"}
                      </p>

                      <p className="text-sm text-gray-500">
                        {company?.location || "Location unavailable"}
                      </p>
                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default MyApplications;