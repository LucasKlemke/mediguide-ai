import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { HeartPulse, RotateCcw } from "lucide-react";
import { ResultadoCard } from "@/components/ResultadoCard";
import { RegrasList } from "@/components/RegrasList";
import { triagemStore } from "@/lib/triagem-store";
import type { Resultado } from "@/engine/types";

export const Route = createFileRoute("/resultado")({
  head: () => ({
    meta: [
      { title: "Resultado da triagem — MediRules" },
      { name: "description", content: "Diagnóstico provável e conduta recomendada com base nos sintomas informados." },
    ],
  }),
  component: ResultadoPage,
});

function ResultadoPage() {
  const navigate = useNavigate();
  const [resultado, setResultado] = useState<Resultado | null>(null);

  useEffect(() => {
    const r = triagemStore.getResultado();
    if (!r) {
      navigate({ to: "/triagem" });
      return;
    }
    setResultado(r);
  }, [navigate]);

  function novaTriagem() {
    triagemStore.reset();
    navigate({ to: "/" });
  }

  if (!resultado) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-soft">
      <div className="mx-auto max-w-2xl px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold text-foreground">MediRules</span>
          </Link>
        </header>

        <ResultadoCard resultado={resultado} />

        <div className="mt-6">
          <RegrasList regras={resultado.regras_ativadas} />
        </div>

        <button
          type="button"
          onClick={novaTriagem}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-2xl border border-border bg-card px-6 py-4 font-display text-base font-semibold text-foreground transition-all hover:border-primary hover:bg-primary-soft hover:text-primary"
        >
          <RotateCcw className="h-4 w-4" />
          Fazer nova triagem
        </button>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Este resultado é apenas orientativo. Consulte um médico para avaliação completa.
        </p>
      </div>
    </div>
  );
}
