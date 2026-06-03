/**
 * Çok hafif zemin akışı — sade, dağıtıcı değil.
 */
import { cn } from "@/lib/utils";

interface Props {
  className?: string;
  variant?: "hero" | "subtle";
}

export function GradientMesh({ className, variant = "hero" }: Props) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      aria-hidden="true"
    >
      <div
        className="absolute -right-32 -top-32 size-[36rem] rounded-full opacity-30 blur-3xl"
        style={{
          background:
            "radial-gradient(circle, var(--color-blue-600) 0%, transparent 60%)",
        }}
      />
      {variant === "hero" && (
        <div
          className="absolute -left-32 bottom-0 size-[32rem] rounded-full opacity-20 blur-3xl"
          style={{
            background:
              "radial-gradient(circle, var(--color-navy-700) 0%, transparent 65%)",
          }}
        />
      )}
    </div>
  );
}
