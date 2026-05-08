import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { GenerationDashboard } from "./pages/GenerationDashboard";
import { TimetablePage } from "./pages/TimetablePage";
import { ResourcesPage } from "./pages/ResourcesPage";
import { AboutEAPage } from "./pages/AboutEAPage";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<GenerationDashboard />} />
        <Route path="/timetable" element={<TimetablePage />} />
        <Route path="/resources" element={<ResourcesPage />} />
        <Route path="/about-ea" element={<AboutEAPage />} />
      </Route>
    </Routes>
  );
}
