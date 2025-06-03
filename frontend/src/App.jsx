import { Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import ScholarsPage from "./pages/ScholarsPage";
import BooksPage from "./pages/BooksPage";
import AdminDashboard from "./admin/AdminDashboard";
import AdminLogin from "./admin/AdminLogin";
import Register from "./components/Register";
import Login from "./components/Login";
import { AuthProvider } from "./context/AuthContext";

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/scholars" element={<ScholarsPage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;