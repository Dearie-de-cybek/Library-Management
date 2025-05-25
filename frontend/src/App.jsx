import {
  BrowserRouter as Router,
  Routes,
  Route,
  // eslint-disable-next-line no-unused-vars
  useLocation,
} from "react-router-dom";
import "./index.css";
import Home from "./pages/Home";
import ScholarsPage from "./pages/ScholarsPage";
import BooksPage from "./pages/BooksPage";
import AdminDashboard from "./admin/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/scholars" element={<ScholarsPage />} />
      <Route path="/books" element={<BooksPage />} />
      <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;
