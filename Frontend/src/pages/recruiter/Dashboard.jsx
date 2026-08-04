import { useSelector } from "react-redux";
import Sidebar from "../../components/recruiter/Sidebar";
import useGetDashboardStats from "../../hooks/useGetDashboardStats";

const Dashboard = () => {
  useGetDashboardStats();

  const { stats, loading } = useSelector((store) => store.dashboard);

  if (loading) {
    return <h1 className="p-10">Loading...</h1>;
  }

  return (
    <div className="min-h-screen flex bg-gray-100">
      <Sidebar />

      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Companies</h2>

            <p className="text-4xl font-bold mt-3">
              {stats?.totalCompanies || 0}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Jobs</h2>

            <p className="text-4xl font-bold mt-3">{stats?.totalJobs || 0}</p>
          </div>

          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-gray-500">Applications</h2>

            <p className="text-4xl font-bold mt-3">
              {stats?.totalApplications || 0}
            </p>
          </div>

          <div className="bg-green-50 rounded-xl shadow p-6">
            <h2 className="text-green-700">Accepted</h2>

            <p className="text-4xl font-bold mt-3">{stats?.accepted ?? 0}</p>
          </div>

          <div className="bg-red-50 rounded-xl shadow p-6">
            <h2 className="text-red-700">Rejected</h2>

            <p className="text-4xl font-bold mt-3">{stats?.rejected || 0}</p>
          </div>

          <div className="bg-yellow-50 rounded-xl shadow p-6">
            <h2 className="text-yellow-700">Pending</h2>

            <p className="text-4xl font-bold mt-3">{stats?.pending || 0}</p>
          </div>
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Jobs</h2>

            {!stats?.recentJobs || stats.recentJobs.length === 0 ? (
              <p>No Jobs</p>
            ) : (
              stats.recentJobs.map((job) => (
                <div
                  key={job._id}
                  className="flex justify-between border-b py-3"
                >
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>

                    <p className="text-sm text-gray-500">{job.company?.name}</p>
                  </div>

                  <span className="text-sm text-gray-400">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))
            )}
          </div>
          <div className="bg-white rounded-xl shadow p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Recent Applications</h2>

            {!stats?.recentApplications || stats.recentApplications.length === 0 ? (
              <p>No Applications</p>
            ) : (
              stats.recentApplications.map((app) => (
                <div
                  key={app._id}
                  className="flex justify-between border-b py-3"
                >
                  <div>
                    <h3 className="font-semibold">{app.applicant?.fullName}</h3>

                    <p className="text-sm text-gray-500">{app.job?.title}</p>
                  </div>

                  <span
                    className={`text-sm font-semibold ${
                      app.status === "Accepted"
                        ? "text-green-600"
                        : app.status === "Rejected"
                          ? "text-red-600"
                          : "text-yellow-600"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
