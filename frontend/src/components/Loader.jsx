export default function Loader({ label = "Loading...", variant = "dashboard" }) {
  const rows = variant === "employees" ? 5 : variant === "payroll" ? 4 : 2;

  return (
    <div className="space-y-5" role="status" aria-label={label} aria-busy="true">
      <p className="sr-only">{label}</p>
      {variant === "dashboard" && (
        <div className="grid grid-cols-1 gap-4 min-[480px]:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div key={index} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <div className="h-3 w-28 animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-4 h-8 w-36 max-w-full animate-pulse rounded bg-slate-200 dark:bg-slate-700" />
              <div className="mt-3 h-3 w-24 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
            </div>
          ))}
        </div>
      )}
      <div className={`grid grid-cols-1 gap-4 ${variant === "dashboard" ? "xl:grid-cols-2" : ""}`}>
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className={`animate-pulse rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 ${variant === "employees" || variant === "payroll" ? "h-24" : "h-64"}`}>
            <div className="h-4 w-40 max-w-full rounded bg-slate-200 dark:bg-slate-700" />
            <div className="mt-3 h-3 w-28 rounded bg-slate-100 dark:bg-slate-800" />
            <div className="mt-8 h-24 rounded-xl bg-slate-100 dark:bg-slate-800" />
          </div>
        ))}
      </div>
    </div>
  );
}
