import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import SiteLayout from "./components/SiteLayout";
import HomePage from "./pages/HomePage";
import EventsPage from "./pages/EventsPage";
import CategoriesPage from "./pages/CategoriesPage";
import BusinessesPage from "./pages/BusinessesPage";
import BusinessDetailPage from "./pages/BusinessDetailPage";
import ContactPage from "./pages/ContactPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<SiteLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/categorias" element={<CategoriesPage />} />
          <Route path="/comercios" element={<BusinessesPage />} />
          <Route path="/comercios/:id" element={<BusinessDetailPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/admin/login" element={<Navigate to="/admin" replace />} />
          <Route path="/admin" element={<AdminDashboardPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
