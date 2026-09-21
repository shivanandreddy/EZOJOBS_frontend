import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Login from "./pages/auth/Login";


export default function App() {

  return (
  <UserProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/ezohr" element={<Navigate to="/ezohr/dashboard" replace />} />
        <Route path="/ezohr/dashboard" element={<h1>Dashboard</h1>} />
      </Routes>
    </BrowserRouter>
    </UserProvider>
  )
}

