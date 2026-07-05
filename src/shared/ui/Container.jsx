export function Container({ className = "", children }) {
  return (
    <div className={`w-full max-w-6xl px-4 sm:px-6 lg:px-10 ${className}`}>
      {children}
    </div>
  );
}
