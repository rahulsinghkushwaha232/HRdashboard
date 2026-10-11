import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <p className="text-sm font-bold uppercase tracking-widest text-primary-600">404 · Not found</p>
      <h2 className="mt-3 text-3xl font-bold text-slate-900 dark:text-white">This page wandered off.</h2>
      <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500 dark:text-slate-400">The page you were looking for does not exist. Let’s get you back to your workspace.</p>
      <Link to="/" className="mt-6 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-primary-700">Back to dashboard</Link>
    </div>
  );
}
