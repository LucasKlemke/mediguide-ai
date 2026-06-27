import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface RegrasListProps {
  regras: string[];
}

export function RegrasList({ regras }: RegrasListProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-2xl border border-border bg-card">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-foreground">
          Como o sistema chegou a essa conclusão?
        </span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180",
          )}
        />
      </button>
      {open && (
        <div className="animate-fade-in border-t border-border px-5 py-5">
          <p className="mb-3 text-xs uppercase tracking-wide text-muted-foreground">
            Regras de produção ativadas (forward chaining)
          </p>
          <ul className="space-y-2">
            {regras.map((r, i) => (
              <li
                key={i}
                className="rounded-lg bg-muted px-4 py-3 font-mono text-sm leading-relaxed text-foreground"
              >
                {r}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
