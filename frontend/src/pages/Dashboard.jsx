import { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, CalendarDays, IndianRupee, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import { getEmployees } from "../services/api";

const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0
});
const chartColors = ["#4f46e5", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#f43f5e"];
const axisStyle = { fontSize: 11, fill: "#94a3b8" };
const tooltipStyle = {
  border: "1px solid #e2e8f0",
  borderRadius: 12,
  boxShadow: "0 8px 24px rgba(15, 23, 42, 0.08)"
};

function ChartCard({ title, subtitle, children, className = "" }) {
  return (
    <section className={`min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5 ${className}`}>
      <div className="mb-4">
        <h2 className="font-semibold text-slate-900 dark:text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{subtitle}</p>}
      </div>
      {children}
    </section>
  );
}

function ConnectionError({ onRetry }) {
  return (
    <div className="mx-auto flex min-h-[55vh] max-w-lg flex-col items-center justify-center px-4 text-center">
      <span className="mb-4 rounded-2xl bg-rose-50 p-4 text-rose-500 dark:bg-rose-500/10 dark:text-rose-400"><Activity className="h-7 w-7" /></span>
      <h2 className="text-xl font-bold text-slate-900 dark:text-white">We can’t load your dashboard</h2>
      <p className="mt-2 text-sm leading-6 text-slate-500 dark:text-slate-400">Cannot reach the server. Is the backend running on port 8080?</p>
      <button type="button" onClick={onRetry} className="mt-5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Retry</button>
    </div>
  );
}

export default function Dashboard() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [failed, setFailed] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    try {
      const response = await getEmployees();
      setEmployees(response.data);
    } catch (error) {
      setFailed(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const data = useMemo(() => {
    const departments = new Map();
    const statuses = new Map();
    const salaryBands = new Map([
      ["Under ₹50k", 0],
      ["₹50k–₹74k", 0],
      ["₹75k–₹99k", 0],
      ["₹100k+", 0]
    ]);
    const hires = new Map();
    let activeCount = 0;
    let leaveCount = 0;
    let netPayroll = 0;

    employees.forEach((employee) => {
      const department = employee.department || "Unassigned";
      departments.set(department, (departments.get(department) || 0) + 1);
      statuses.set(employee.status, (statuses.get(employee.status) || 0) + 1);
      const salary = Number(employee.basicSalary) || 0;
      const band = salary < 50000 ? "Under ₹50k" : salary < 75000 ? "₹50k–₹74k" : salary < 100000 ? "₹75k–₹99k" : "₹100k+";
      salaryBands.set(band, salaryBands.get(band) + 1);
      const year = employee.hireDate?.slice(0, 4);
      if (year) hires.set(year, (hires.get(year) || 0) + 1);
      if (employee.status === "Active") activeCount += 1;
      if (employee.status === "On Leave") leaveCount += 1;
      netPayroll += salary * 1.38;
    });

    return {
      departments: [...departments].map(([name, count]) => ({ name, count })).sort((a, b) => b.count - a.count),
      statuses: [...statuses].map(([name, value]) => ({ name, value })),
      salaries: [...salaryBands].map(([name, count]) => ({ name, count })),
      hires: [...hires].map(([year, hiresCount]) => ({ year, hires: hiresCount })).sort((a, b) => a.year.localeCompare(b.year)),
      activeCount,
      leaveCount,
      netPayroll
    };
  }, [employees]);

  const recentEmployees = useMemo(
    () => [...employees].sort((a, b) => (b.hireDate || "").localeCompare(a.hireDate || "")).slice(0, 5),
    [employees]
  );

  if (loading) return <Loader label="Loading your dashboard..." />;
  if (failed) return <ConnectionError onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Here’s how your team is doing.</p>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500">Live employee data</p>
      </div>
      <section className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total employees" value={employees.length} detail="Across all departments" icon={Users} tone="indigo" />
        <StatCard label="Active" value={data.activeCount} detail="Currently working" icon={Activity} tone="emerald" />
        <StatCard label="On Leave" value={data.leaveCount} detail="Temporarily away" icon={CalendarDays} tone="amber" />
        <StatCard label="Monthly payroll" value={inr.format(data.netPayroll)} detail="Illustrative estimated net pay" icon={IndianRupee} tone="violet" />
      </section>

      {employees.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
          <EmptyState title="Your dashboard is ready" description="Add your first employee to see team insights and charts here." />
        </div>
      ) : (
        <>
          <section className="grid min-w-0 grid-cols-1 gap-4 xl:grid-cols-2">
            <ChartCard title="Employees by department" subtitle="Team distribution">
              <div className="h-64 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.departments} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#eef2ff" }} />
                    <Bar dataKey="count" name="Employees" fill="#4f46e5" radius={[6, 6, 0, 0]} maxBarSize={44} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Employees by status" subtitle="Current team status">
              <div className="h-64 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={data.statuses} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={90} paddingAngle={4} stroke="none">
                      {data.statuses.map((entry, index) => <Cell key={entry.name} fill={chartColors[index % chartColors.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={tooltipStyle} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-2">
                {data.statuses.map((entry, index) => (
                  <span key={entry.name} className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: chartColors[index % chartColors.length] }} />
                    {entry.name} ({entry.value})
                  </span>
                ))}
              </div>
            </ChartCard>
            <ChartCard title="Salary distribution" subtitle="Employees by monthly basic salary band">
              <div className="h-64 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.salaries} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "#eef2ff" }} />
                    <Bar dataKey="count" name="Employees" fill="#8b5cf6" radius={[6, 6, 0, 0]} maxBarSize={48} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
            <ChartCard title="Hires per year" subtitle="New joiners by hire year">
              <div className="h-64 min-w-0">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.hires} margin={{ top: 8, right: 8, left: -20, bottom: 4 }}>
                    <CartesianGrid stroke="#e2e8f0" strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="year" tick={axisStyle} axisLine={false} tickLine={false} />
                    <YAxis allowDecimals={false} tick={axisStyle} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={tooltipStyle} />
                    <Line type="monotone" dataKey="hires" name="Hires" stroke="#06b6d4" strokeWidth={3} dot={{ r: 4, fill: "#06b6d4" }} activeDot={{ r: 6 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </ChartCard>
          </section>
          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <div>
                <h2 className="font-semibold text-slate-900 dark:text-white">Recently joined</h2>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Your newest team members</p>
              </div>
              <CalendarDays className="h-5 w-5 text-slate-400" />
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {recentEmployees.map((employee) => (
                <div key={employee.id} className="flex min-w-0 items-center gap-3 px-5 py-3.5">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">{employee.firstName?.[0]}{employee.lastName?.[0]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{employee.firstName} {employee.lastName}</p>
                    <p className="truncate text-xs text-slate-500 dark:text-slate-400">{employee.jobTitle || employee.department || "Team member"}</p>
                  </div>
                  <time className="shrink-0 text-right text-xs text-slate-500 dark:text-slate-400">{employee.hireDate || "—"}</time>
                </div>
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  );
}
