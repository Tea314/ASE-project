import { Route, Routes } from "react-router-dom";
import { HeroPage } from "../components/HeroPage";
import { LoginPage } from "../components/LoginPage";
import { ForgotPassword } from "../components/ForgotPassword";
import { SignUpPage } from "../components/SignUpPage";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export function AuthRoutes() {
  const { handleLogin } = useAppContext();
  const navigate = useNavigate();

  return (
    <Routes>
      <Route
        path="/"
        element={<HeroPage onGetStarted={() => navigate("/login")} />}
      />
      <Route
        path="/login"
        element={
          <LoginPage
            onLogin={(email, password) => {
              handleLogin(email, password);
              navigate(email.toLowerCase().includes("admin") ? "/admin/overview" : "/overview");
            }}
            onForgotPassword={() => navigate("/forgot-password")}
            onSignUp={() => navigate("/signup")}
          />
        }
      />
      <Route
        path="/forgot-password"
        element={<ForgotPassword onBack={() => navigate("/login")} />}
      />
      <Route
        path="/signup"
        element={
          <SignUpPage
            onSignUp={(data) => {
              // Logic sign up từ file gốc
              const newUser = {
                id: `user-${Date.now()}`,
                name: data.fullName,
                email: data.email,
                department: data.department,
                role: "employee",
                status: "active",
                createdAt: new Date().toISOString(),
              };
              // setUsers và setUser ở đây nếu cần, nhưng vì mock, assume backend handle
              navigate("/overview");
            }}
            onBackToLogin={() => navigate("/login")}
          />
        }
      />
    </Routes>
  );
}
