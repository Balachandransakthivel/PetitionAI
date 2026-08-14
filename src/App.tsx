import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "sonner";
import { AuthProvider } from "@/hooks/useAuthProvider";
import { useAuth } from "@/lib/auth";

import Navbar from "@/components/layout/Navbar";
import AIChatbot from "@/components/features/AIChatbot";

import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import NotFound from "@/pages/NotFound";

// Citizen
import CitizenDashboard from "@/pages/citizen/CitizenDashboard";
import SubmitPetition from "@/pages/citizen/SubmitPetition";
import MyPetitions from "@/pages/citizen/MyPetitions";
import PetitionDetail from "@/pages/citizen/PetitionDetail";
import CitizenProfile from "@/pages/citizen/CitizenProfile";

// Officer
import OfficerDashboard from "@/pages/officer/OfficerDashboard";
import OfficerPetitionDetail from "@/pages/officer/OfficerPetitionDetail";

// Admin
import AdminDashboard from "@/pages/admin/AdminDashboard";
import AdminComplaints from "@/pages/admin/AdminComplaints";
import AdminUsers from "@/pages/admin/AdminUsers";
import AdminAnalytics from "@/pages/admin/AdminAnalytics";
import AdminComplaintDetail from "@/pages/admin/AdminComplaintDetail";

function ProtectedRoute({ children, roles }: { children: React.ReactNode; roles: string[] }) {
  const { user, isLoading } = useAuth();
  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-navy-700 border-t-transparent rounded-full animate-spin" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return <Navigate to={`/${user.role}/dashboard`} replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { user } = useAuth();

  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={user ? <Navigate to={`/${user.role}/dashboard`} replace /> : <LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Citizen Routes */}
        <Route path="/citizen/dashboard" element={<ProtectedRoute roles={["citizen"]}><CitizenDashboard /></ProtectedRoute>} />
        <Route path="/citizen/submit" element={<ProtectedRoute roles={["citizen"]}><SubmitPetition /></ProtectedRoute>} />
        <Route path="/citizen/petitions" element={<ProtectedRoute roles={["citizen"]}><MyPetitions /></ProtectedRoute>} />
        <Route path="/citizen/petition/:id" element={<ProtectedRoute roles={["citizen"]}><PetitionDetail /></ProtectedRoute>} />
        <Route path="/citizen/profile" element={<ProtectedRoute roles={["citizen"]}><CitizenProfile /></ProtectedRoute>} />

        {/* Officer Routes */}
        <Route path="/officer/dashboard" element={<ProtectedRoute roles={["officer"]}><OfficerDashboard /></ProtectedRoute>} />
        <Route path="/officer/petition/:id" element={<ProtectedRoute roles={["officer"]}><OfficerPetitionDetail /></ProtectedRoute>} />
        <Route path="/officer/profile" element={<ProtectedRoute roles={["officer"]}><CitizenProfile /></ProtectedRoute>} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<ProtectedRoute roles={["admin"]}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/complaints" element={<ProtectedRoute roles={["admin"]}><AdminComplaints /></ProtectedRoute>} />
        <Route path="/admin/complaint/:id" element={<ProtectedRoute roles={["admin"]}><AdminComplaintDetail /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute roles={["admin"]}><AdminUsers /></ProtectedRoute>} />
        <Route path="/admin/analytics" element={<ProtectedRoute roles={["admin"]}><AdminAnalytics /></ProtectedRoute>} />
        <Route path="/admin/profile" element={<ProtectedRoute roles={["admin"]}><CitizenProfile /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
      <AIChatbot />
      <Toaster position="top-right" richColors />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}
