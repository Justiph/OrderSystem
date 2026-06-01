export function LoadingState({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-64 items-center justify-center rounded-xl border border-gray-200 bg-white p-8">
      <div className="flex items-center gap-3 text-sm font-medium text-neutral-600">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-gray-200 border-t-neutral-900" />
        {label}
      </div>
    </div>
  );
}

export function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-neutral-50 px-6 py-12 text-center">
      <h3 className="text-lg font-semibold text-neutral-950">{title}</h3>
      {message && <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-neutral-600">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorBanner({ message }) {
  if (!message) return null;
  return (
    <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
      {message}
    </div>
  );
}
