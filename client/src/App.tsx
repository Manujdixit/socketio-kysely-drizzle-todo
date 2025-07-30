import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { SignIn } from "./pages/SignIn";
import { SignUp } from "./pages/SignUp";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./hooks/useAuth";
import RequireAuth from "./context/RequireAuth";
import { Toaster } from "./components/ui/sonner";
import { Dashboard } from "./pages/Dashboard";
import { SocketProvider } from "./context/SocketProvider";
import GroupPage from "./pages/GroupPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  return (
    <Routes>
      <Route
        path="/signin"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignIn />
        }
      />
      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/dashboard" replace /> : <SignUp />
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        }
      />
      <Route
        path="/group/:roomId"
        element={
          <RequireAuth>
            <GroupPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/signin" replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster position="top-center" />
        </BrowserRouter>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
