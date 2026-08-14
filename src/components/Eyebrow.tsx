export default function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 text-xl font-light tracking-wide text-accent">
      <span className="h-2 w-2 rounded-full bg-accent" />
      {children}
    </span>
  );
}
