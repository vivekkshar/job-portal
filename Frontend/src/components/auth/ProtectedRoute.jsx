
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, authLoading, isAuthenticated } = useSelector(
    (store) => store.auth
  );

  // Auth check chal raha hai
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">
          Checking authentication...
        </p>
      </div>
    );
  }

  // User login nahi hai
  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role check
  if (
    allowedRoles.length > 0 &&
    !allowedRoles.includes(user.role)
  ) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
