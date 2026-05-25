import { cn } from "@/lib/utils"

type ModeCardProps = {
  label: string
  description: string
  selected: boolean
  onSelect: () => void
}

export default function ModeCard({
  label,
  description,
  selected,
  onSelect,
}: ModeCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "rounded-xl border p-4 text-left transition-all",
        selected
          ? "border-accent bg-accent/10 ring-2 ring-accent/30"
          : "border-border bg-card hover:border-accent/40"
      )}
    >
      <p className="font-semibold text-primary">{label}</p>
      <p className="mt-1 text-sm text-muted-foreground">{description}</p>
    </button>
  )
}
