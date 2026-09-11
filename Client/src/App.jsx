import TipPage from "./pages/TipPage";
import AdminLayout from "./layouts/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import Workers from "./pages/admin/Workers";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/tip/:slug" element={<TipPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="workers" element={<Workers />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
