import type { ReactNode } from "react";

export function PageHeader({
  label,
  title,
  children,
}: {
  label?: string;
  title: ReactNode;
  children?: ReactNode;
}) {
  return (
    <header className="border-b border-line px-6 py-10 sm:px-10 lg:px-16 lg:py-14 xl:px-20">
      {label && (
        <p className="text-[0.68rem] font-bold tracking-[0.16em] uppercase text-brand">{label}</p>
      )}
      <h1 className="mt-2 max-w-[20ch] font-display text-[clamp(2rem,4vw,3.1rem)] leading-[1.02] font-extrabold tracking-[-0.035em]">
        {title}
      </h1>
      {children && (
        <p className="mt-4 max-w-[56ch] text-[1.0625rem] leading-relaxed text-muted-foreground">
          {children}
        </p>
      )}
    </header>
  );
}
