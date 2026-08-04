import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-white shadow-lg min-h-screen p-6">
      <h1 className="text-2xl font-bold mb-10">Recruiter</h1>

      <nav className="flex flex-col gap-4">
        <NavLink to="/admin/dashboard">Dashboard</NavLink>

        <NavLink to="/admin/companies">Companies</NavLink>

        <NavLink to="/admin/jobs">Jobs</NavLink>

        {/* <NavLink to="/admin/applicants">Applicants</NavLink> */}
      </nav>
    </div>
  );
};

export default Sidebar;
