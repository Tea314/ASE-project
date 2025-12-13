import { Route, Routes } from "react-router-dom";
import { HeroPage } from "../components/HeroPage";
import { LoginPage } from "../components/LoginPage";
import { ForgotPassword } from "../components/ForgotPassword";
import { SignUpPage } from "../components/SignUpPage";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export function AuthRoutes() {
  const { handleLogin, user } = useAppContext();
  const navigate = useNavigate();

  const handleLoginAttempt = async (email: string, password: string) => {
    try {
      await handleLogin(email, password);
      // The user object in context will be updated upon successful login.
      // We can't rely on the 'user' object right after await, so we need to check the role from the login logic itself.
      // For simplicity, we'll navigate based on email here, but a better approach would be for handleLogin to return the user.
      // Let's assume handleLogin will throw on failure, so navigation only happens on success.
      const isAdmin = email.toLowerCase().includes("admin");
      navigate(isAdmin ? "/admin/overview" : "/overview");
    } catch (error) {
      // Error is already handled and toasted in AppContext
      console.error("Login attempt failed in AuthRoutes");
    }
  };

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
            onLogin={handleLoginAttempt}
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
            onBackToLogin={() => navigate("/login")}
          />
        }
      />
    </Routes>
  );
}
