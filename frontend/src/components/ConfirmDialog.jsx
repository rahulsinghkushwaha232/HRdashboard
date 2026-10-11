import { AlertTriangle } from "lucide-react";
import Modal from "./Modal";

export default function ConfirmDialog({ open, employee, onCancel, onConfirm, loading = false }) {
  return (
    <Modal open={open} onClose={onCancel} title="Delete employee" size="max-w-md">
      <div className="flex gap-4">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
          <AlertTriangle className="h-5 w-5" />
        </span>
        <div>
          <p className="font-medium text-slate-800 dark:text-slate-100">
            Delete {employee ? `${employee.firstName} ${employee.lastName}` : "this employee"}?
          </p>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">This action cannot be undone.</p>
        </div>
      </div>
      <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
        <button type="button" onClick={onCancel} disabled={loading} className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800">Cancel</button>
        <button type="button" onClick={onConfirm} disabled={loading} className="rounded-lg bg-rose-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-rose-700 disabled:opacity-60">{loading ? "Deleting..." : "Delete employee"}</button>
      </div>
    </Modal>
  );
}
