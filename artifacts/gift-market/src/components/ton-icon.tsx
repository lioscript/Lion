export function TonIcon({ className = "w-4 h-4" }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path 
        d="M12 2L2 12L12 22L22 12L12 2Z" 
        fill="currentColor"
        className="text-primary"
      />
      <path 
        d="M12 5L5 12L12 19L19 12L12 5Z" 
        fill="#0a0a0f"
      />
      <path 
        d="M12 8L8 12L12 16L16 12L12 8Z" 
        fill="currentColor"
        className="text-primary"
      />
    </svg>
  );
}
