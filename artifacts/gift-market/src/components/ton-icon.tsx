export function TonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <img
      src="/ton-logo.jpeg"
      alt="TON"
      className={`rounded-full object-cover flex-shrink-0 ${className}`}
    />
  );
}
