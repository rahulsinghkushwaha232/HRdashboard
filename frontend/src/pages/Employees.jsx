import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Eye, Pencil, Plus, Search, Trash2 } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import EmptyState from "../components/EmptyState";
import EmployeeForm from "../components/EmployeeForm";
import Loader from "../components/Loader";
import Modal from "../components/Modal";
import { useToast } from "../context/ToastContext";
import { createEmployee, deleteEmployee, getEmployees, updateEmployee } from "../services/api";

const PAGE_SIZE = 10;
const currency = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 });
const dateFormatter = new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const statusClasses = {
  Active: "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  "On Leave": "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300",
  Resigned: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
};

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : dateFormatter.format(date);
}

function ConnectionError({ message, onRetry }) {
  return (
    <div className="rounded-2xl border border-rose-100 bg-white px-5 py-12 text-center shadow-sm dark:border-rose-900/60 dark:bg-slate-900">
      <p className="font-semibold text-slate-900 dark:text-white">We couldn’t load your employees</p>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{message}</p>
      <button type="button" onClick={onRetry} className="mt-5 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Retry</button>
    </div>
  );
}

function EmployeeActions({ onView, onEdit, onDelete }) {
  return (
    <div className="flex items-center gap-1">
      <button type="button" onClick={onView} title="View employee" aria-label="View employee" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800 dark:hover:text-primary-300"><Eye className="h-4 w-4" /></button>
      <button type="button" onClick={onEdit} title="Edit employee" aria-label="Edit employee" className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-primary-600 dark:hover:bg-slate-800 dark:hover:text-primary-300"><Pencil className="h-4 w-4" /></button>
      <button type="button" onClick={onDelete} title="Delete employee" aria-label="Delete employee" className="rounded-lg p-2 text-slate-400 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-500/10 dark:hover:text-rose-300"><Trash2 className="h-4 w-4" /></button>
    </div>
  );
}

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [page, setPage] = useState(1);
  const [modalMode, setModalMode] = useState("");
  const [selected, setSelected] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const requestNumber = useRef(0);
  const toast = useToast();

  useEffect(() => {
    const timeout = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const loadEmployees = useCallback(async (showLoading = true) => {
    const requestId = ++requestNumber.current;
    if (showLoading) setLoading(true);
    setLoadError("");
    try {
      const response = await getEmployees(search);
      if (requestId === requestNumber.current) setEmployees(response.data);
    } catch (error) {
      if (requestId === requestNumber.current) {
        setLoadError("Cannot reach the server. Is the backend running on port 8080?");
      }
    } finally {
      if (requestId === requestNumber.current) setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  const departments = useMemo(
    () => [...new Set(employees.map((employee) => employee.department).filter(Boolean))].sort((a, b) => a.localeCompare(b)),
    [employees]
  );

  const filteredEmployees = useMemo(() => {
    const result = employees.filter((employee) =>
      (!statusFilter || employee.status === statusFilter) &&
      (!departmentFilter || employee.department === departmentFilter)
    );
    result.sort((a, b) => {
      if (sortBy === "hireDate") return (b.hireDate || "").localeCompare(a.hireDate || "");
      if (sortBy === "salary") return (Number(b.basicSalary) || 0) - (Number(a.basicSalary) || 0);
      return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
    });
    return result;
  }, [employees, statusFilter, departmentFilter, sortBy]);

  const pageCount = Math.max(1, Math.ceil(filteredEmployees.length / PAGE_SIZE));
  const visibleEmployees = filteredEmployees.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, departmentFilter, sortBy]);

  function closeModal() {
    if (saving) return;
    setModalMode("");
    setSelected(null);
  }

  async function saveEmployee(data) {
    setSaving(true);
    try {
      if (modalMode === "edit" && selected) {
        await updateEmployee(selected.id, data);
        toast.success("Employee details updated.");
      } else {
        await createEmployee(data);
        toast.success("Employee added to your team.");
      }
      setModalMode("");
      setSelected(null);
      await loadEmployees(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not save the employee. Please try again.");
      throw error;
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!selected) return;
    setDeleting(true);
    try {
      await deleteEmployee(selected.id);
      toast.success(`${selected.firstName} ${selected.lastName} was deleted.`);
      setModalMode("");
      setSelected(null);
      await loadEmployees(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Could not delete this employee. Please try again.");
    } finally {
      setDeleting(false);
    }
  }

  function open(mode, employee = null) {
    setSelected(employee);
    setModalMode(mode);
  }

  if (loading && employees.length === 0 && !loadError) return <Loader label="Loading employees..." variant="employees" />;
  if (loadError) return <ConnectionError message={loadError} onRetry={() => loadEmployees()} />;

  return (
    <div className="space-y-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage your people and keep their details up to date.</p>
          <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{filteredEmployees.length} {filteredEmployees.length === 1 ? "employee" : "employees"}</p>
        </div>
        <button type="button" onClick={() => open("add")} className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-700 sm:w-auto">
          <Plus className="h-4 w-4" />Add employee
        </button>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[minmax(220px,1fr)_180px_180px_180px]">
          <label className="relative block min-w-0">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={searchInput} onChange={(event) => setSearchInput(event.target.value)} placeholder="Search name or email..." aria-label="Search employees" className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-800 outline-none focus:border-primary-400 focus:ring-2 focus:ring-primary-100 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:focus:ring-primary-500/20" />
          </label>
          <select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)} className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <option value="">All statuses</option>
            <option value="Active">Active</option>
            <option value="On Leave">On Leave</option>
            <option value="Resigned">Resigned</option>
          </select>
          <select aria-label="Filter by department" value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)} className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <option value="">All departments</option>
            {departments.map((department) => <option key={department} value={department}>{department}</option>)}
          </select>
          <select aria-label="Sort employees" value={sortBy} onChange={(event) => setSortBy(event.target.value)} className="min-w-0 rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-primary-400 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200">
            <option value="name">Sort: Name</option>
            <option value="hireDate">Sort: Hire date</option>
            <option value="salary">Sort: Salary</option>
          </select>
        </div>
      </section>

      {loading && <Loader label="Updating employees..." variant="employees" />}
      {!loading && filteredEmployees.length === 0 && (
        <div className="rounded-2xl border border-slate-100 bg-white dark:border-slate-800 dark:bg-slate-900">
          <EmptyState title={employees.length ? "No matching employees" : "No employees yet"} description={employees.length ? "Try a different search or adjust your filters." : "Add an employee to start building your team directory."} />
        </div>
      )}

      {!loading && visibleEmployees.length > 0 && (
        <>
          <section className="space-y-3 lg:hidden">
            {visibleEmployees.map((employee) => (
              <article key={employee.id} className="min-w-0 rounded-2xl border border-slate-100 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
                <div className="flex min-w-0 items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-50 text-sm font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">{employee.firstName?.[0]}{employee.lastName?.[0]}</span>
                  <div className="min-w-0 flex-1">
                    <p className="break-words font-semibold text-slate-900 dark:text-white">{employee.firstName} {employee.lastName}</p>
                    <p className="break-all text-xs text-slate-500 dark:text-slate-400">{employee.email}</p>
                  </div>
                  <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusClasses[employee.status] || statusClasses.Resigned}`}>{employee.status}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-3 border-t border-slate-100 pt-3 dark:border-slate-800">
                  <div className="min-w-0"><p className="text-[11px] text-slate-400">Department</p><p className="truncate text-sm text-slate-700 dark:text-slate-200">{employee.department || "—"}</p></div>
                  <div className="min-w-0"><p className="text-[11px] text-slate-400">Hire date</p><p className="text-sm text-slate-700 dark:text-slate-200">{formatDate(employee.hireDate)}</p></div>
                  <div className="min-w-0"><p className="text-[11px] text-slate-400">Basic salary</p><p className="truncate text-sm font-medium text-slate-700 dark:text-slate-200">{currency.format(employee.basicSalary || 0)}</p></div>
                  <div className="flex justify-end"><EmployeeActions onView={() => open("view", employee)} onEdit={() => open("edit", employee)} onDelete={() => open("delete", employee)} /></div>
                </div>
              </article>
            ))}
          </section>

          <section className="hidden overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[790px] text-left">
                <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:bg-slate-800/60 dark:text-slate-400">
                  <tr>
                    <th className="px-5 py-3.5">Employee</th><th className="px-4 py-3.5">Department</th><th className="px-4 py-3.5">Hire date</th><th className="px-4 py-3.5">Basic salary</th><th className="px-4 py-3.5">Status</th><th className="px-4 py-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {visibleEmployees.map((employee) => (
                    <tr key={employee.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/30">
                      <td className="px-5 py-4">
                        <div className="flex min-w-0 items-center gap-3">
                          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-50 text-xs font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">{employee.firstName?.[0]}{employee.lastName?.[0]}</span>
                          <div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-800 dark:text-slate-100">{employee.firstName} {employee.lastName}</p><p className="max-w-48 truncate text-xs text-slate-500 dark:text-slate-400">{employee.email}</p></div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{employee.department || "—"}</td>
                      <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{formatDate(employee.hireDate)}</td>
                      <td className="px-4 py-4 text-sm font-medium text-slate-700 dark:text-slate-200">{currency.format(employee.basicSalary || 0)}</td>
                      <td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[employee.status] || statusClasses.Resigned}`}>{employee.status}</span></td>
                      <td className="px-4 py-4"><div className="flex justify-end"><EmployeeActions onView={() => open("view", employee)} onEdit={() => open("edit", employee)} onDelete={() => open("delete", employee)} /></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-xs text-slate-500 dark:text-slate-400 sm:text-left">
              Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredEmployees.length)} of {filteredEmployees.length}
            </p>
            <div className="flex items-center justify-center gap-2">
              <button type="button" onClick={() => setPage((current) => Math.max(1, current - 1))} disabled={page <= 1} aria-label="Previous page" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><ChevronLeft className="h-4 w-4" /></button>
              <span className="px-2 text-sm text-slate-600 dark:text-slate-300">Page {page} of {pageCount}</span>
              <button type="button" onClick={() => setPage((current) => Math.min(pageCount, current + 1))} disabled={page >= pageCount} aria-label="Next page" className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-white disabled:cursor-not-allowed disabled:opacity-40 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"><ChevronRight className="h-4 w-4" /></button>
            </div>
          </div>
        </>
      )}

      <Modal open={modalMode === "add" || modalMode === "edit"} onClose={closeModal} title={modalMode === "edit" ? "Edit employee" : "Add employee"}>
        <EmployeeForm key={`${modalMode}-${selected?.id || "new"}`} employee={selected} onSubmit={saveEmployee} onCancel={closeModal} submitting={saving} />
      </Modal>
      <Modal open={modalMode === "view"} onClose={closeModal} title="Employee details" size="max-w-lg">
        {selected && (
          <div>
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5 dark:border-slate-800">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-50 text-lg font-bold text-primary-700 dark:bg-primary-500/10 dark:text-primary-300">{selected.firstName?.[0]}{selected.lastName?.[0]}</span>
              <div className="min-w-0"><h3 className="break-words text-lg font-bold text-slate-900 dark:text-white">{selected.firstName} {selected.lastName}</h3><p className="break-all text-sm text-slate-500 dark:text-slate-400">{selected.email}</p></div>
            </div>
            <dl className="mt-5 grid grid-cols-1 gap-4 min-[420px]:grid-cols-2">
              {[["Phone", selected.phone], ["Hire date", formatDate(selected.hireDate)], ["Department", selected.department], ["Job title", selected.jobTitle], ["Basic salary", currency.format(selected.basicSalary || 0)], ["Status", selected.status]].map(([label, value]) => (
                <div key={label} className="min-w-0"><dt className="text-xs font-medium text-slate-400">{label}</dt><dd className="mt-1 break-words text-sm font-medium text-slate-800 dark:text-slate-100">{value || "—"}</dd></div>
              ))}
            </dl>
            <div className="mt-7 flex justify-end"><button type="button" onClick={closeModal} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Close</button></div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={modalMode === "delete"} employee={selected} onCancel={closeModal} onConfirm={confirmDelete} loading={deleting} />
    </div>
  );
}
