import { LayoutDashboard, Users, Wallet, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/employees", label: "Employees", icon: Users },
  { to: "/payroll", label: "Payroll", icon: Wallet }
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <button type="button" aria-label="Close navigation menu" onClick={onClose} className="fixed inset-0 z-40 bg-slate-950/50 lg:hidden" />}
      <aside className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200 bg-white transition-transform duration-200 dark:border-slate-800 dark:bg-slate-900 lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex h-20 items-center justify-between px-6">
          <NavLink to="/" onClick={onClose} className="flex min-w-0 items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-600 text-sm font-bold text-white shadow-sm">HR</span>
            <span className="truncate text-base font-bold tracking-tight text-slate-900 dark:text-white">HR Dashboard</span>
          </NavLink>
          <button type="button" onClick={onClose} aria-label="Close navigation menu" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"><X className="h-5 w-5" /></button>
        </div>
        <nav className="flex-1 px-4 py-5">
          <p className="mb-3 px-3 text-[11px] font-bold uppercase tracking-[0.14em] text-slate-400">Workspace</p>
          <div className="space-y-1">
            {links.map(({ to, label, icon: Icon, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${isActive ? "bg-primary-50 text-primary-700 dark:bg-primary-500/10 dark:text-primary-300" : "text-slate-500 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"}`}
              >
                <Icon className="h-[18px] w-[18px]" />{label}
              </NavLink>
            ))}
          </div>
        </nav>
        <div className="m-4 rounded-2xl bg-slate-50 p-4 dark:bg-slate-800/70">
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">People first</p>
          <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">Your team, at a glance.</p>
        </div>
      </aside>
    </>
  );
}
