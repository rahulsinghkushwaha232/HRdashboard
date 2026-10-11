import { SearchX } from "lucide-react";

export default function EmptyState({ title = "Nothing to see here yet", description = "Try changing your filters or search." }) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-14 text-center">
      <div className="mb-4 rounded-2xl bg-slate-100 p-4 text-slate-400 dark:bg-slate-800 dark:text-slate-500">
        <SearchX className="h-7 w-7" />
      </div>
      <h3 className="font-semibold text-slate-800 dark:text-white">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
