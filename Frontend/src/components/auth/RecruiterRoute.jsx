import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const RecruiterRoute = ({ children }) => {
  const { user, authLoading } = useSelector((store) => store.auth);

  if (authLoading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "recruiter") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default RecruiterRoute;