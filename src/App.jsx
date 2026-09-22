import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { UserProvider } from "./context/UserContext";
import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import Dashboard from "./components/Dashboard";
import Login from "./pages/auth/Login";

import CreateJob from "./pages/jobs/CreateJob";
import ManageJobs from "./pages/jobs/ManageJobs";
import DraftJobs from "./pages/jobs/DraftJobs";
import ViewJob from "./pages/jobs/ViewJob";

import Test from "./components/Test";
import GetCandiates from "./pages/candiates/GetCandiates";
import CandiateLogin from "./pages/auth/CanidateLogin";
import CandiateProtectedRoute from "./components/CandiateProtectedRoute";
import CandiateDashboard from "./pages/candiates/CandiateDashboard";
import CandiateLayout from "./pages/candiates/CandiateLayout"
import CandiateProfile from "./pages/candiates/CandiateProfile";
import CandiateJobs from "./pages/candiates/CandiateJobs";
import CandiateApplications from "./pages/candiates/CandiateApplications";
import Profile from "./components/Profile";

import Settings from "./pages/settings/Settings";
import Help from "./pages/help/Help";


import NotFound from "./pages/404/NotFound";
import Development from "./pages/404/Development";

export default function App() {
  return (
    <UserProvider>
      <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Login */}
          <Route path="/" element={<Login />} />
          <Route path="/ezohr/candiate/login" element={<CandiateLogin />} />

          {/* Protected EZOHR Routes */}
          <Route
            path="/ezohr"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route path="profile" element={<Profile />} />

            {/* Default */}
            <Route
              index
              element={<Navigate to="/ezohr/home" replace />}
            />

            {/* Dashboard */}
            <Route path="home" element={<Dashboard />} />

            {/* Jobs */}
            <Route path="jobs/create" element={<CreateJob />} />
            <Route path="jobs/manage" element={<ManageJobs />} />
            <Route path="jobs/drafts" element={<DraftJobs />} />
            <Route path="jobs/:id" element={<ViewJob />} />

            {/* Candidates */}
            <Route
              path="candiates"
              element={<GetCandiates />}
            />

            {/* Test */}
            <Route path="test" element={<Test />} />

            {/* Settings */}
            <Route path="settings" element={<Settings />} />

            {/* Help */}
            <Route path="help" element={<Help />} />

            {/* EZOHR 404 */}
            <Route path="*" element={<Development />} />

          </Route>

          {/* Global 404 */}
          <Route path="*" element={<Development />} />

         

             {/* Candidate View Job after Google Login */}
            <Route
              path="/ezohr/candiate/jobs/:id"
              element={
                <CandiateProtectedRoute>
                  <ViewJob />
                </CandiateProtectedRoute>
              }
            />

            {/* Layout Route with Nested Child Routes */}
        <Route path="/ezohr/candiate" element={ <CandiateProtectedRoute><CandiateLayout /></CandiateProtectedRoute>}>
          <Route path="dashboard" element={<CandiateDashboard />} />
            <Route path="jobs" element={<CandiateJobs />} />
          <Route path="applications" element={<CandiateApplications />} />
          <Route path="profile" element={<CandiateProfile />} />
        </Route>

        </Routes>
      </BrowserRouter>
      </AuthProvider>
    </UserProvider>
  );
}