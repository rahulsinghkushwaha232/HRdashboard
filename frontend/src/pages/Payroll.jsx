import { useCallback, useEffect, useMemo, useState } from "react";
import { Download, IndianRupee, Wallet } from "lucide-react";
import EmptyState from "../components/EmptyState";
import Loader from "../components/Loader";
import StatCard from "../components/StatCard";
import { getEmployees } from "../services/api";

const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });

function calculate(basicSalary) {
  const basic = Number(basicSalary) || 0;
  const hra = basic * 0.4;
  const allowances = basic * 0.1;
  const pf = basic * 0.12;
  return { basic, hra, allowances, pf, net: basic + hra + allowances - pf };
}

function csvCell(value) {
  let safeValue = String(value ?? "");
  if (/^[\s]*[=+\-@]/.test(safeValue)) safeValue = `'${safeValue}`;
  return `"${safeValue.replace(/"/g, '""')}"`;
}

function ConnectionError({ onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm dark:border-rose-900/60 dark:bg-slate-900">
      <p className="font-semibold text-slate-900 dark:text-white">We couldn’t load payroll data</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Cannot reach the server. Is the backend running on port 8080?</p>
      <button type="button" onClick={onRetry} className="mt-5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Retry</button>
    </div>
  );
}

export default function Payroll() {
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

  const rows = useMemo(
    () => employees.map((employee) => ({ employee, ...calculate(employee.basicSalary) })),
    [employees]
  );
  const totalBasic = rows.reduce((total, row) => total + row.basic, 0);
  const totalNet = rows.reduce((total, row) => total + row.net, 0);
  const departmentSummary = useMemo(() => {
    const summary = new Map();
    rows.forEach(({ employee, basic, net }) => {
      const department = employee.department || "Unassigned";
      const current = summary.get(department) || { department, employees: 0, basic: 0, net: 0 };
      current.employees += 1;
      current.basic += basic;
      current.net += net;
      summary.set(department, current);
    });
    return [...summary.values()].sort((a, b) => b.net - a.net);
  }, [rows]);

  function exportCsv() {
    const headers = ["Employee", "Email", "Department", "Basic salary (INR)", "HRA (INR)", "Allowances (INR)", "PF deduction (INR)", "Illustrative net pay (INR)"];
    const lines = [headers, ...rows.map(({ employee, basic, hra, allowances, pf, net }) => [
      `${employee.firstName} ${employee.lastName}`,
      employee.email,
      employee.department || "Unassigned",
      basic.toFixed(2),
      hra.toFixed(2),
      allowances.toFixed(2),
      pf.toFixed(2),
      net.toFixed(2)
    ])].map((line) => line.map(csvCell).join(","));
    const blob = new Blob([`\uFEFF${lines.join("\r\n")}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "hr-dashboard-payroll.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  if (loading) return <Loader label="Loading payroll..." variant="payroll" />;
  if (failed) return <ConnectionError onRetry={load} />;

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">A monthly view of your team’s estimated compensation.</p>
          <p className="mt-2 max-w-3xl rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs leading-5 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-200">
            Illustration only: HRA (40%), allowances (10%), and PF deduction (12%) are estimated from basic salary. This breakup is not stored in the database and is not a payroll calculation.
          </p>
        </div>
        <button type="button" onClick={exportCsv} disabled={rows.length === 0} className="inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
          <Download className="h-4 w-4" />Export CSV
        </button>
      </div>

      <section className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-3">
        <StatCard label="Total basic salaries" value={currency.format(totalBasic)} detail={`${employees.length} employees`} icon={IndianRupee} tone="indigo" />
        <StatCard label="Estimated net payroll" value={currency.format(totalNet)} detail="Illustrative monthly total" icon={Wallet} tone="violet" />
        <StatCard label="Average net pay" value={currency.format(rows.length ? totalNet / rows.length : 0)} detail="Per employee, estimated" icon={IndianRupee} tone="emerald" />
      </section>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900"><EmptyState title="No payroll records yet" description="Add employees with salary details to see a payroll illustration." /></div>
      ) : (
        <>
          <section className="space-y-3 lg:hidden">
            {rows.map(({ employee, basic, hra, allowances, pf, net }) => (
              <article key={employee.id} className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex min-w-0 items-start justify-between gap-3 border-b border-slate-100 pb-3 dark:border-slate-800">
                  <div className="min-w-0"><p className="break-words font-semibold text-slate-900 dark:text-white">{employee.firstName} {employee.lastName}</p><p className="break-all text-xs text-slate-500 dark:text-slate-400">{employee.department || "Unassigned"}</p></div>
                  <p className="shrink-0 text-sm font-bold text-primary-700 dark:text-primary-300">{currency.format(net)}</p>
                </div>
                <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                  <div><dt className="text-slate-400">Basic</dt><dd className="mt-1 font-medium text-slate-700 dark:text-slate-200">{currency.format(basic)}</dd></div>
                  <div><dt className="text-slate-400">HRA (40%)</dt><dd className="mt-1 font-medium text-slate-700 dark:text-slate-200">{currency.format(hra)}</dd></div>
                  <div><dt className="text-slate-400">Allowances (10%)</dt><dd className="mt-1 font-medium text-slate-700 dark:text-slate-200">{currency.format(allowances)}</dd></div>
                  <div><dt className="text-slate-400">PF (12%)</dt><dd className="mt-1 font-medium text-rose-600 dark:text-rose-400">−{currency.format(pf)}</dd></div>
                </dl>
              </article>
            ))}
            <div className="rounded-xl bg-primary-50 px-4 py-3 text-sm font-semibold text-primary-800 dark:bg-primary-500/10 dark:text-primary-200">Total illustrative net pay <span className="float-right">{currency.format(totalNet)}</span></div>
          </section>

          <section className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[950px] text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                  <tr><th className="px-5 py-3.5">Employee</th><th className="px-4 py-3.5">Basic</th><th className="px-4 py-3.5">HRA · 40%</th><th className="px-4 py-3.5">Allowances · 10%</th><th className="px-4 py-3.5">PF · 12%</th><th className="px-4 py-3.5 text-right">Illustrative net pay</th></tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {rows.map(({ employee, basic, hra, allowances, pf, net }) => (
                    <tr key={employee.id}>
                      <td className="px-5 py-4"><p className="text-sm font-semibold text-slate-800 dark:text-slate-100">{employee.firstName} {employee.lastName}</p><p className="text-xs text-slate-500 dark:text-slate-400">{employee.department || "Unassigned"}</p></td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{currency.format(basic)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{currency.format(hra)}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{currency.format(allowances)}</td>
                      <td className="px-4 py-4 text-sm text-rose-600 dark:text-rose-400">−{currency.format(pf)}</td>
                      <td className="px-4 py-4 text-right text-sm font-bold text-slate-900 dark:text-white">{currency.format(net)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-primary-50 dark:bg-primary-500/10">
                  <tr className="font-bold text-primary-900 dark:text-primary-100"><td className="px-5 py-4">Monthly total</td><td className="px-4 py-4">{currency.format(totalBasic)}</td><td colSpan="3" className="px-4 py-4 text-sm font-medium">Illustrative monthly breakup</td><td className="px-4 py-4 text-right">{currency.format(totalNet)}</td></tr>
                </tfoot>
              </table>
            </div>
          </section>

          <section className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="border-b border-slate-100 px-5 py-4 dark:border-slate-800">
              <h2 className="font-semibold text-slate-900 dark:text-white">Department summary</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Estimated monthly net pay by team</p>
            </div>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {departmentSummary.map((department) => (
                <div key={department.department} className="flex min-w-0 flex-wrap items-center justify-between gap-2 px-5 py-3.5">
                  <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{department.department}</p><p className="text-xs text-slate-500 dark:text-slate-400">{department.employees} {department.employees === 1 ? "employee" : "employees"} · Basic {currency.format(department.basic)}</p></div>
                  <p className="shrink-0 text-sm font-bold text-slate-900 dark:text-white">{currency.format(department.net)}</p>
                </div>
              ))}
              <div className="flex justify-between gap-3 bg-slate-50 px-5 py-3.5 text-sm font-bold text-slate-900 dark:bg-slate-800/60 dark:text-white"><span>All departments</span><span className="shrink-0">{currency.format(totalNet)}</span></div>
            </div>
          </section>
        </>
      )}
    </div>
  );
}
