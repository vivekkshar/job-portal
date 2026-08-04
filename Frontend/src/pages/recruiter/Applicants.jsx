import { useSelector } from "react-redux";
import useGetApplicants from "../../hooks/useGetApplicants";
import API from "../../services/axios";
import toast from "react-hot-toast";

const Applicants = () => {
  useGetApplicants();

  const { applicants, loading } = useSelector((store) => store.job);
  const updateStatus = async (applicationId, status) => {
    try {
      const res = await API.put(`/applications/${applicationId}/status`, {
        status,
      });

      if (res.data.success) {
        toast.success(res.data.message);
        window.location.reload();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold mb-8">Applicants</h1>

      {applicants.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <h2 className="text-xl font-semibold">No Applicants Yet</h2>
          <p className="text-gray-500 mt-2">
            No one has applied for this job yet.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Resume
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {applicants.map((application) => (
                <tr key={application._id} className="even:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {application.applicant?.fullName || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.applicant?.email || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.applicant?.profile?.phoneNumber || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {application.status}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {application.applicant?.profile?.resume ? (
                      <a
                        href={application.applicant.profile.resume}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-600"
                      >
                        View Resume
                      </a>
                    ) : (
                      "No Resume"
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {application.status === "Pending" ? (
                      <div className="flex gap-2">
                        <button
                          onClick={() =>
                            updateStatus(application._id, "Shortlisted")
                          }
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Shortlist
                        </button>

                        <button
                          onClick={() =>
                            updateStatus(application._id, "Rejected")
                          }
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm"
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          application.status === "Accepted"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {application.status}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Applicants;
