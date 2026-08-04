
import { useState } from "react";
import { useSelector } from "react-redux";
import useGetApplicants from "../../hooks/useGetApplicants";
import API from "../../services/axios";
import toast from "react-hot-toast";

const Applicants = () => {
  useGetApplicants();

  const { applicants: reduxApplicants = [], loading } = useSelector(
    (store) => store.job
  );

  const [updatingId, setUpdatingId] = useState(null);
  const [localApplicants, setLocalApplicants] = useState(null);

  const applicants = localApplicants ?? reduxApplicants;

  const updateStatus = async (applicationId, status) => {
    try {
      setUpdatingId(applicationId);

      const res = await API.put(
        `/applications/${applicationId}/status`,
        {
          status,
        }
      );

      if (res.data.success) {
        toast.success(res.data.message);

        // Update UI instantly without page reload
        setLocalApplicants((prev) =>
          (prev ?? reduxApplicants).map((application) =>
            application._id === applicationId
              ? {
                  ...application,
                  status,
                }
              : application
          )
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong"
      );
    } finally {
      setUpdatingId(null);
    }
  };

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
      <div className="min-h-screen bg-gray-100 p-10">
        <div className="max-w-7xl mx-auto">
          <p className="text-gray-500">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold">
            Applicants
          </h1>

          <p className="text-gray-500 mt-2">
            Review applicants and manage their application status.
          </p>
        </div>

        {/* Empty State */}
        {applicants.length === 0 ? (
          <div className="bg-white rounded-xl shadow p-10 text-center">
            <h2 className="text-xl font-semibold">
              No Applicants Yet
            </h2>

            <p className="text-gray-500 mt-2">
              No one has applied for this job yet.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">

            <table className="min-w-full divide-y divide-gray-200">

              <thead className="bg-gray-50">
                <tr>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Name
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Phone
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Status
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Resume
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-200">

                {applicants.map((application) => {

                  const status = application.status;
                  const isUpdating =
                    updatingId === application._id;

                  return (
                    <tr
                      key={application._id}
                      className="hover:bg-gray-50"
                    >

                      {/* Name */}
                      <td className="px-6 py-5 whitespace-nowrap">
                        <p className="font-medium text-gray-900">
                          {application.applicant?.fullName ||
                            "N/A"}
                        </p>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                        {application.applicant?.email ||
                          "N/A"}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-5 whitespace-nowrap text-sm text-gray-500">
                        {application.applicant?.profile
                          ?.phoneNumber || "N/A"}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-5 whitespace-nowrap">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(
                            status
                          )}`}
                        >
                          {status}
                        </span>

                      </td>

                      {/* Resume */}
                      <td className="px-6 py-5 whitespace-nowrap">

                        {application.applicant?.profile
                          ?.resume?.url ? (
                          <a
                            href={
                              application.applicant
                                .profile.resume.url
                            }
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 font-medium"
                          >
                            View Resume
                          </a>
                        ) : (
                          <span className="text-gray-400">
                            No Resume
                          </span>
                        )}

                      </td>

                      {/* Action */}
                      <td className="px-6 py-5 whitespace-nowrap">

                        {status === "Pending" ? (
                          <div className="flex gap-2">

                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(
                                  application._id,
                                  "Shortlisted"
                                )
                              }
                              className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm"
                            >
                              {isUpdating
                                ? "Updating..."
                                : "Shortlist"}
                            </button>

                            <button
                              disabled={isUpdating}
                              onClick={() =>
                                updateStatus(
                                  application._id,
                                  "Rejected"
                                )
                              }
                              className="bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white px-3 py-2 rounded-md text-sm"
                            >
                              {isUpdating
                                ? "Updating..."
                                : "Reject"}
                            </button>

                          </div>
                        ) : status === "Shortlisted" ? (
                          <span className="text-green-600 font-medium">
                            Candidate Shortlisted
                          </span>
                        ) : status === "Rejected" ? (
                          <span className="text-red-600 font-medium">
                            Application Rejected
                          </span>
                        ) : (
                          <span className="text-gray-500">
                            {status}
                          </span>
                        )}

                      </td>

                    </tr>
                  );
                })}

              </tbody>
            </table>

          </div>
        )}

      </div>
    </div>
  );
};

export default Applicants;
