import { CheckCircle2, X, XCircle } from "lucide-react";

export default function Toast({ message, type, onClose }) {
  const isError = type === "error";
  const Icon = isError ? XCircle : CheckCircle2;

  return (
    <div
      role={isError ? "alert" : "status"}
      className={`pointer-events-auto flex items-start gap-3 rounded-xl border bg-white p-4 shadow-lg dark:bg-slate-800 ${
        isError ? "border-rose-200 dark:border-rose-900" : "border-emerald-200 dark:border-emerald-900"
      }`}
    >
      <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${isError ? "text-rose-500" : "text-emerald-500"}`} />
      <p className="min-w-0 flex-1 break-words text-sm font-medium text-slate-700 dark:text-slate-100">{message}</p>
      <button type="button" onClick={onClose} aria-label="Dismiss notification" className="text-slate-400 hover:text-slate-700 dark:hover:text-white">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
