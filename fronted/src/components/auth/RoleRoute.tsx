import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  allowedRoles: string[];
  children: React.ReactNode;
}

export default function RoleRoute({ allowedRoles, children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    if (user.role === "INTERVIEWER") {
      return <Navigate to="/dashboard/my-assignments" replace />;
    }

    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}
