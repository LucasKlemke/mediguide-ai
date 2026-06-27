import { AlertCircle, AlertTriangle, CheckCircle2, Stethoscope } from "lucide-react";
import type { Resultado } from "@/engine/types";
import { cn } from "@/lib/utils";

const URGENCIA_STYLES = {
  ALTA: {
    label: "URGÊNCIA ALTA",
    badge: "bg-danger/10 text-danger border-danger/30",
    dot: "bg-danger",
    icon: AlertCircle,
    ring: "ring-danger/20",
  },
  MEDIA: {
    label: "URGÊNCIA MÉDIA",
    badge: "bg-warning/15 text-foreground border-warning/40",
    dot: "bg-warning",
    icon: AlertTriangle,
    ring: "ring-warning/20",
  },
  BAIXA: {
    label: "URGÊNCIA BAIXA",
    badge: "bg-success/10 text-success border-success/30",
    dot: "bg-success",
    icon: CheckCircle2,
    ring: "ring-success/20",
  },
} as const;

export function ResultadoCard({ resultado }: { resultado: Resultado }) {
  const style = URGENCIA_STYLES[resultado.urgencia];
  const Icon = style.icon;

  return (
    <div
      className={cn(
        "animate-fade-in rounded-3xl border border-border bg-card p-6 shadow-sm ring-8 sm:p-10",
        style.ring,
      )}
    >
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span
          className={cn(
            "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold tracking-wide",
            style.badge,
          )}
        >
          <span className={cn("h-2 w-2 rounded-full", style.dot)} />
          {style.label}
        </span>
      </div>

      <p className="mb-1 text-xs font-medium uppercase tracking-wider text-muted-foreground">
        Diagnóstico Provável
      </p>
      <h1 className="mb-8 font-display text-3xl font-bold leading-tight text-foreground sm:text-4xl">
        {resultado.diagnostico}
      </h1>

      <div className="mb-8">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
          <Stethoscope className="h-4 w-4 text-primary" />
          Sintomas identificados
        </h3>
        <ul className="grid gap-2 sm:grid-cols-2">
          {resultado.sintomas_identificados.map((s, i) => (
            <li
              key={i}
              className="flex items-start gap-2 rounded-lg bg-muted px-3 py-2 text-sm text-foreground"
            >
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <span>{s}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-6">
        <h3 className="mb-3 text-sm font-semibold text-foreground">Conduta recomendada</h3>
        <ul className="space-y-2">
          {resultado.conduta.map((c, i) => (
            <li
              key={i}
              className="flex items-start gap-3 rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground"
            >
              <span className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-soft text-xs font-bold text-primary">
                {i + 1}
              </span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className={cn("flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium", style.badge)}>
        <Icon className="h-4 w-4" />
        <span>Nível de atenção: {style.label.replace("URGÊNCIA ", "")}</span>
      </div>
    </div>
  );
}
