import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/layout/Layout";

import Home from "./pages/user/home/Home";
import Jobs from "./pages/user/Jobs";
import JobDetails from "./pages/user/JobDetails";
import Profile from "./pages/user/Profile";
import EditProfile from "./pages/user/EditProfile";
import AppliedJobs from "./pages/user/AppliedJobs";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Dashboard from "./pages/recruiter/Dashboard";
import Companies from "./pages/recruiter/Companies";
import CreateCompany from "./pages/recruiter/CreateCompany";
import EditCompany from "./pages/recruiter/EditCompany";
import RecruiterJobs from "./pages/recruiter/Jobs";
import CreateJob from "./pages/recruiter/CreateJob";
import EditJob from "./pages/recruiter/EditJob";
import Applicants from "./pages/recruiter/Applicants";
import NotFound from "./pages/user/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import RecruiterRoute from "./components/auth/RecruiterRoute";
import useGetCurrentUser from "./hooks/useGetCurrentUser";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import MyApplications from "./pages/user/MyApplications";
import Dashboard1 from "./pages/user/Dashboard";
import "./App.css";

function App() {
  useGetCurrentUser();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* public */}
          <Route path="/" element={<Home />} />
          <Route path="/jobs" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          {/* user */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route path="/dashboard" element={ <ProtectedRoute allowedRoles={["jobseeker"]}> <Dashboard /> </ProtectedRoute> } />
          <Route
            path="/profile/edit"
            element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/my-applications" element={<MyApplications />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/applications" element={<AppliedJobs />} />
          {/* Recruiter */}
          <Route path="/admin/dashboard" element={ <ProtectedRoute allowedRoles={["recruiter", "admin"]}> <Dashboard /> </ProtectedRoute> } />
          <Route
            path="/admin/companies"
            element={
              <RecruiterRoute>
                <Companies />
              </RecruiterRoute>
            }
          />
          <Route
            path="/admin/company/create"
            element={
              <RecruiterRoute>
                <CreateCompany />
              </RecruiterRoute>
            }
          />
          <Route
            path="/admin/company/:id"
            element={
              <RecruiterRoute>
                <EditCompany />
              </RecruiterRoute>
            }
          />
          <Route path="/admin/company/:id/edit" element={<EditCompany />} />
          <Route path="/admin/jobs" element={<RecruiterJobs />} />
          <Route path="/admin/job/create" element={<CreateJob />} />
          <Route path="/admin/job/:id/edit" element={<EditJob />} />
          <Route path="/admin/job/:id/applicants" element={<Applicants />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
