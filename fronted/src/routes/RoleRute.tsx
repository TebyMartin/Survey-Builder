import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface Props {
  roles: string[];
  children: React.ReactNode;
}

export default function RoleRoute({ roles, children }: Props) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!roles.includes(user.role)) {
    switch (user.role) {
      case "ADMIN":
        return <Navigate to="/dashboard" replace />;

      case "INTERVIEWER":
        return <Navigate to="/interviewer" replace />;

      case "EDITOR":
        return <Navigate to="/dashboard" replace />;

      case "VIEWER":
        return <Navigate to="/dashboard" replace />;

      case "SUPERVISOR":
        return <Navigate to="/dashboard/reviews" replace />;

      default:
        return <Navigate to="/login" replace />;
    }
  }

  return <>{children}</>;
}
