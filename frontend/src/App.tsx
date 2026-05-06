import { Route, Routes } from "react-router-dom";
import { DashboardLayout } from "./components/layout/DashboardLayout";
import { GenerationDashboard } from "./pages/GenerationDashboard";
import { TimetablePage } from "./pages/TimetablePage";

export default function App() {
  return (
    <Routes>
      <Route element={<DashboardLayout />}>
        <Route index element={<GenerationDashboard />} />
        <Route path="/timetable" element={<TimetablePage />} />
      </Route>
    </Routes>
  );
}
