import { useAuthStore } from "@/store/auth-store";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: ("admin" | "client")[]; // Roles permitidas
}

export function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  // 1. Verifica se existe um token (usuário logado)
  if (!token) {
    return <Navigate to="/auth/login" replace />;
  }

  // 2. Se roles específicas forem exigidas, verifica se o usuário as possui
  if (allowedRoles && user) {
    /*eslint-disable-next-line */
    const hasPermission = allowedRoles.includes(user.role as any);

    if (!hasPermission) {
      // Redireciona para a home ou página de "não autorizado" se não tiver permissão
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
