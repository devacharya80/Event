export const inputCls =
  "w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 aria-[invalid=true]:border-red-500";

export function Field({ label, error, optional, children }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium text-gray-700">
        {label} {optional && <span className="font-normal text-gray-400">(optional)</span>}
      </span>
      {children}
      {error && <span role="alert" className="mt-1 block text-xs text-red-600">{error}</span>}
    </label>
  );
}

export function Stepper({ steps, current }) {
  return (
    <ol className="mb-8 flex items-center gap-2" aria-label="Progress">
      {steps.map((label, i) => {
        const n = i + 1;
        const state = n < current ? "done" : n === current ? "active" : "todo";
        return (
          <li key={label} className="flex flex-1 flex-col gap-1" aria-current={state === "active" ? "step" : undefined}>
            <div
              className={`h-1.5 rounded-full ${
                state === "todo" ? "bg-gray-200" : "bg-indigo-600"
              }`}
            />
            <span className={`text-xs ${state === "todo" ? "text-gray-400" : "text-indigo-700 font-medium"}`}>
              {n}. {label}
            </span>
          </li>
        );
      })}
    </ol>
  );
}