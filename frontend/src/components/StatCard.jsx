export default function StatCard({ label, value, detail, icon: Icon, tone = "indigo" }) {
  const tones = {
    indigo: "bg-primary-50 text-primary-600 dark:bg-primary-500/10 dark:text-primary-300",
    emerald: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-300",
    amber: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300",
    violet: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-300"
  };

  return (
    <article className="min-w-0 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-3xl">{value}</p>
          {detail && <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">{detail}</p>}
        </div>
        <span className={`shrink-0 rounded-xl p-3 ${tones[tone] || tones.indigo}`}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
    </article>
  );
}
