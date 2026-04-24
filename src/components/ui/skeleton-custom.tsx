import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-md bg-neutral-200 dark:bg-neutral-800",
        // Camada do brilho
        "after:absolute after:inset-0 after:content-['']",
        "after:animate-shimmer",
        // Gradiente - Usando sintaxe v4 bg-linear
        "after:bg-linear-to-r after:from-transparent after:via-white/50 after:to-transparent",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
