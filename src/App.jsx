import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
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
import Settings from "./pages/settings/Settings"
import Help from "./pages/help/Help";

export default function App() {
  return (
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/ezohr"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/ezohr/home" replace />} />
            <Route path="home" element={<Dashboard />} />
            
              {/* Jobs */}
              <Route path="jobs/create" element={<CreateJob />} />

              <Route path="jobs/manage" element={<ManageJobs />} />

              <Route path="jobs/drafts" element={<DraftJobs />} />

              <Route path="/ezohr/jobs/:id" element={<ViewJob />} />

              <Route path="/ezohr/candiates" element={<GetCandiates />} />
              <Route path="/ezohr/test" element={<Test />} />
              {/* Settings */}
              <Route path="settings" element={<Settings />} />

              {/* Help */}
              <Route path="help" element={<Help />} />
              
          </Route>


        </Routes>
      </BrowserRouter>
    </UserProvider>
  );
}
