import { useState } from "react";
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import Dashboard from "./pages/Dashboard";
import Employees from "./pages/Employees";
import NotFound from "./pages/NotFound";
import Payroll from "./pages/Payroll";

const pageTitles = {
  "/": "Dashboard",
  "/employees": "Employees",
  "/payroll": "Payroll"
};

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { pathname } = useLocation();
  const title = pageTitles[pathname];

  if (!title && pathname !== "*") {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="min-h-screen lg:pl-64">
          <Topbar title="Page not found" onMenuClick={() => setSidebarOpen(true)} />
          <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8"><NotFound /></main>
        </div>
      </div>
    );
  }

  if (!title) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="min-h-screen min-w-0 lg:pl-64">
        <Topbar title={title} onMenuClick={() => setSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1440px] p-4 sm:p-6 lg:p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/employees" element={<Employees />} />
            <Route path="/payroll" element={<Payroll />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
