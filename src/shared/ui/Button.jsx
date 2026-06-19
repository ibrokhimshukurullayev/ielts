const VARIANTS = {
  primary: "bg-accent text-white hover:bg-indigo-700",
  success: "bg-success text-white hover:bg-emerald-600",
  outline: "border border-navy text-navy hover:bg-navy hover:text-white",
  ghost: "text-navy hover:bg-slate-100",
};

export function Button({ variant = "primary", className = "", children, ...props }) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${VARIANTS[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
