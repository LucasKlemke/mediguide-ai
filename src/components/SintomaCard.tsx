import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface Option<V extends string> {
  value: V;
  label: string;
}

interface SintomaCardProps<V extends string> {
  icon: LucideIcon;
  question: string;
  options: Option<V>[];
  onSelect: (value: V) => void;
  selected?: V;
}

export function SintomaCard<V extends string>({
  icon: Icon,
  question,
  options,
  onSelect,
  selected,
}: SintomaCardProps<V>) {
  return (
    <div className="animate-fade-in rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary-soft text-primary">
          <Icon className="h-6 w-6" />
        </div>
      </div>
      <h2 className="mb-8 font-display text-2xl font-bold leading-snug text-foreground sm:text-3xl">
        {question}
      </h2>
      <div className="grid gap-3">
        {options.map((opt) => {
          const isSelected = selected === opt.value;
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onSelect(opt.value)}
              className={cn(
                "group flex w-full items-center justify-between rounded-2xl border-2 px-5 py-4 text-left text-base font-medium transition-all",
                "hover:border-primary hover:bg-primary-soft hover:-translate-y-0.5",
                isSelected
                  ? "border-primary bg-primary-soft text-primary"
                  : "border-border bg-background text-foreground",
              )}
            >
              <span>{opt.label}</span>
              <span
                className={cn(
                  "ml-4 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
                  isSelected ? "border-primary bg-primary" : "border-border bg-background group-hover:border-primary",
                )}
              >
                {isSelected && <span className="h-2 w-2 rounded-full bg-primary-foreground" />}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
