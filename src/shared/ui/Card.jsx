export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-2xl bg-white p-6 shadow-[0_2px_12px_rgba(15,32,68,0.08)] ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
