import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
}

export function Card({ children, className = '' }: CardProps) {
  return (
    <div
      className={`bg-card rounded-2xl border border-black/5 shadow-[0_10px_25px_-15px_rgba(47,42,38,0.25)] p-5 ${className}`}
    >
      {children}
    </div>
  );
}
