import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowLeft,
  Brain,
  Clock,
  HeartPulse,
  Stethoscope,
  Thermometer,
  Wind,
  Activity,
  Bone,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProgressBar } from "@/components/ProgressBar";
import { SintomaCard } from "@/components/SintomaCard";
import { runEngine } from "@/engine/rules-engine";
import type { Sintomas } from "@/engine/types";
import { triagemStore } from "@/lib/triagem-store";

export const Route = createFileRoute("/triagem")({
  head: () => ({
    meta: [
      { title: "Triagem — MediRules" },
      { name: "description", content: "Responda perguntas sobre seus sintomas para obter uma orientação." },
    ],
  }),
  component: TriagemPage,
});

type QKey = keyof Sintomas;

interface QuestionDef {
  key: QKey;
  icon: LucideIcon;
  question: string;
  options: { value: string; label: string }[];
}

const QUESTIONS: QuestionDef[] = [
  {
    key: "febre",
    icon: Thermometer,
    question: "Você está com febre?",
    options: [
      { value: "alta", label: "Sim, acima de 38°C" },
      { value: "baixa", label: "Sim, entre 37,5°C e 38°C" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    key: "tosse",
    icon: Wind,
    question: "Você tem tosse?",
    options: [
      { value: "seca", label: "Sim, tosse seca" },
      { value: "catarro", label: "Sim, tosse com catarro" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    key: "dor_cabeca",
    icon: Brain,
    question: "Você sente dor de cabeça?",
    options: [
      { value: "forte", label: "Sim, forte" },
      { value: "leve", label: "Sim, leve" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    key: "falta_ar",
    icon: HeartPulse,
    question: "Você sente dificuldade para respirar?",
    options: [
      { value: "intensa", label: "Sim, intensa" },
      { value: "leve", label: "Sim, leve" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    key: "dor_garganta",
    icon: Stethoscope,
    question: "Você tem dor de garganta?",
    options: [
      { value: "sim", label: "Sim" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    key: "dores_corpo",
    icon: Bone,
    question: "Você sente dores no corpo?",
    options: [
      { value: "generalizada", label: "Sim, generalizadas" },
      { value: "localizada", label: "Sim, localizadas" },
      { value: "nao", label: "Não" },
    ],
  },
  {
    key: "tempo_sintomas",
    icon: Clock,
    question: "Há quanto tempo você está com esses sintomas?",
    options: [
      { value: "menos_24h", label: "Menos de 24 horas" },
      { value: "1_3_dias", label: "Entre 1 e 3 dias" },
      { value: "mais_3_dias", label: "Mais de 3 dias" },
    ],
  },
];

function TriagemPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Partial<Sintomas>>({});
  // chave para forçar remount do card a cada step → re-dispara animate-fade-in
  const [animKey, setAnimKey] = useState(0);

  const q = QUESTIONS[step];

  function handleSelect(value: string) {
    const next: Partial<Sintomas> = { ...answers, [q.key]: value as Sintomas[QKey] };
    setAnswers(next);

    if (step < QUESTIONS.length - 1) {
      // pequeno delay para o usuário ver a seleção antes de avançar
      setTimeout(() => {
        setStep((s) => s + 1);
        setAnimKey((k) => k + 1);
      }, 200);
    } else {
      const sintomas = next as Sintomas;
      const resultado = runEngine(sintomas);
      triagemStore.setSintomas(sintomas);
      triagemStore.setResultado(resultado);
      setTimeout(() => navigate({ to: "/resultado" }), 250);
    }
  }

  function goBack() {
    if (step === 0) return;
    setStep((s) => s - 1);
    setAnimKey((k) => k + 1);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary-soft">
      <div className="mx-auto flex min-h-screen max-w-2xl flex-col px-6 py-8">
        <header className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <HeartPulse className="h-4 w-4" />
            </div>
            <span className="font-display text-base font-bold text-foreground">MediRules</span>
          </Link>
          <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-1 text-xs font-medium text-muted-foreground">
            <Activity className="h-3 w-3 text-primary" />
            Triagem em andamento
          </span>
        </header>

        <ProgressBar current={step + 1} total={QUESTIONS.length} />

        <main className="flex flex-1 items-center py-8">
          <div key={animKey} className="w-full">
            <SintomaCard
              icon={q.icon}
              question={q.question}
              options={q.options}
              selected={answers[q.key]}
              onSelect={handleSelect}
            />
          </div>
        </main>

        <footer className="flex items-center justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground disabled:cursor-not-allowed disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </button>
          <span className="text-xs text-muted-foreground">
            Selecione uma opção para continuar
          </span>
        </footer>
      </div>
    </div>
  );
}
