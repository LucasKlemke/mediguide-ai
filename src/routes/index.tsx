import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartPulse, ShieldCheck, Sparkles } from "lucide-react";
import { triagemStore } from "@/lib/triagem-store";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "MediRules — Triagem Médica por Regras de IA" },
      {
        name: "description",
        content:
          "Sistema especialista acadêmico que aplica forward chaining para sugerir diagnósticos a partir de sintomas.",
      },
      { property: "og:title", content: "MediRules — Triagem Médica por Regras de IA" },
      {
        property: "og:description",
        content: "Demonstração acadêmica de sistema especialista com motor de inferência baseado em regras.",
      },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  useEffect(() => {
    triagemStore.reset();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-soft">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-10 sm:py-16">
        <header className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <HeartPulse className="h-5 w-5" />
          </div>
          <span className="font-display text-lg font-bold tracking-tight text-foreground">
            MediRules
          </span>
        </header>

        <main className="flex flex-1 flex-col items-center justify-center py-12 text-center">
          <span className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="h-3 w-3 text-primary" />
            Projeto Acadêmico — Engenharia de Software
          </span>

          <h1 className="mb-4 font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
            Triagem médica
            <br />
            por <span className="text-primary">regras de IA</span>
          </h1>

          <p className="mb-10 max-w-md text-base leading-relaxed text-muted-foreground sm:text-lg">
            Responda algumas perguntas sobre seus sintomas. Nosso motor de inferência aplica regras
            lógicas (<em>forward chaining</em>) para sugerir um diagnóstico provável e a conduta
            recomendada.
          </p>

          <Link
            to="/triagem"
            className="group inline-flex items-center gap-2 rounded-2xl bg-primary px-8 py-4 font-display text-base font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30"
          >
            Iniciar triagem
            <span className="transition-transform group-hover:translate-x-1">→</span>
          </Link>

          <div className="mt-10 grid w-full max-w-md gap-3 text-left">
            {[
              { icon: ShieldCheck, t: "100% offline", d: "Nenhum dado é enviado a servidores." },
              { icon: Sparkles, t: "6 regras de produção", d: "Avaliadas por ordem de urgência." },
            ].map(({ icon: Icon, t, d }) => (
              <div
                key={t}
                className="flex items-start gap-3 rounded-2xl border border-border bg-card p-4"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-soft text-primary">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t}</p>
                  <p className="text-xs text-muted-foreground">{d}</p>
                </div>
              </div>
            ))}
          </div>
        </main>

        <footer className="pt-8 text-center text-xs text-muted-foreground">
          Este sistema não substitui avaliação médica profissional.
        </footer>
      </div>
    </div>
  );
}
