import type { Sintomas, Resultado } from "./types";

/**
 * Motor de inferência baseado em FORWARD CHAINING.
 *
 * Forward chaining (encadeamento progressivo): partimos dos FATOS conhecidos
 * (sintomas do paciente) e aplicamos regras de produção (SE ... ENTÃO ...)
 * em ordem de prioridade até derivar uma conclusão (diagnóstico).
 *
 * As regras são avaliadas da maior para a menor urgência. A primeira regra
 * cuja condição é satisfeita "dispara" e produz o resultado final.
 * A Regra 6 funciona como fallback (closed-world assumption).
 */

function sintomasLegiveis(s: Sintomas): string[] {
  const out: string[] = [];
  if (s.febre === "alta") out.push("Febre acima de 38°C");
  else if (s.febre === "baixa") out.push("Febre entre 37,5°C e 38°C");
  if (s.tosse === "seca") out.push("Tosse seca");
  else if (s.tosse === "catarro") out.push("Tosse com catarro");
  if (s.dor_cabeca === "forte") out.push("Dor de cabeça forte");
  else if (s.dor_cabeca === "leve") out.push("Dor de cabeça leve");
  if (s.falta_ar === "intensa") out.push("Falta de ar intensa");
  else if (s.falta_ar === "leve") out.push("Falta de ar leve");
  if (s.dor_garganta === "sim") out.push("Dor de garganta");
  if (s.dores_corpo === "generalizada") out.push("Dores generalizadas no corpo");
  else if (s.dores_corpo === "localizada") out.push("Dores localizadas no corpo");
  const tempo = {
    menos_24h: "Sintomas há menos de 24h",
    "1_3_dias": "Sintomas entre 1 e 3 dias",
    mais_3_dias: "Sintomas há mais de 3 dias",
  }[s.tempo_sintomas];
  out.push(tempo);
  return out;
}

export function runEngine(s: Sintomas): Resultado {
  const sintomas_identificados = sintomasLegiveis(s);

  // REGRA 1 — Emergência respiratória (ALTA prioridade)
  if (s.falta_ar === "intensa") {
    return {
      diagnostico: "Possível Insuficiência Respiratória",
      urgencia: "ALTA",
      conduta: [
        "Procurar pronto-socorro imediatamente",
        "Não dirigir — peça ajuda ou chame o SAMU (192)",
        "Manter-se em posição sentada e calma",
      ],
      regras_ativadas: [
        "Regra 1: SE falta_ar = INTENSA ENTÃO diagnóstico = Insuficiência Respiratória, urgência = ALTA",
      ],
      sintomas_identificados,
    };
  }

  // REGRA 2 — Síndrome Gripal
  if (s.febre === "alta" && s.tosse !== "nao" && s.dores_corpo !== "nao") {
    return {
      diagnostico: "Síndrome Gripal (provável Influenza)",
      urgencia: "MEDIA",
      conduta: [
        "Repouso e hidratação abundante",
        "Antitérmico (dipirona ou paracetamol)",
        "Isolamento domiciliar por 7 dias",
        "Retornar ao serviço de saúde se piorar em 48h",
      ],
      regras_ativadas: [
        "Regra 2: SE febre > 38°C E tosse ≠ NÃO E dores_corpo ≠ NÃO ENTÃO diagnóstico = Síndrome Gripal, urgência = MÉDIA",
      ],
      sintomas_identificados,
    };
  }

  // REGRA 3 — Resfriado comum
  if (s.febre === "nao" && s.tosse !== "nao" && s.dor_garganta === "sim") {
    return {
      diagnostico: "Resfriado Comum",
      urgencia: "BAIXA",
      conduta: [
        "Repouso e hidratação",
        "Mel com limão para alívio da garganta",
        "Antialérgico se necessário",
        "Sintomas costumam regredir em 5–7 dias",
      ],
      regras_ativadas: [
        "Regra 3: SE febre = NÃO E tosse ≠ NÃO E dor_garganta = SIM ENTÃO diagnóstico = Resfriado Comum, urgência = BAIXA",
      ],
      sintomas_identificados,
    };
  }

  // REGRA 4 — Faringite
  if (s.dor_garganta === "sim" && s.febre !== "nao" && s.tosse === "nao") {
    return {
      diagnostico: "Possível Faringite Bacteriana",
      urgencia: "MEDIA",
      conduta: [
        "Consultar médico para avaliação de antibiótico",
        "Antitérmico (dipirona ou paracetamol)",
        "Gargarejo com água morna e sal",
      ],
      regras_ativadas: [
        "Regra 4: SE dor_garganta = SIM E febre ≠ NÃO E tosse = NÃO ENTÃO diagnóstico = Faringite Bacteriana, urgência = MÉDIA",
      ],
      sintomas_identificados,
    };
  }

  // REGRA 5 — Cefaleia
  if (s.dor_cabeca === "forte" && s.febre === "nao" && s.tosse === "nao") {
    return {
      diagnostico: "Cefaleia (provável tensional ou enxaqueca)",
      urgencia: "BAIXA",
      conduta: [
        "Repouso em ambiente escuro e silencioso",
        "Analgésico simples (paracetamol ou dipirona)",
        "Hidratação adequada",
        "Consultar neurologista se crises recorrentes",
      ],
      regras_ativadas: [
        "Regra 5: SE dor_cabeca = FORTE E febre = NÃO E tosse = NÃO ENTÃO diagnóstico = Cefaleia, urgência = BAIXA",
      ],
      sintomas_identificados,
    };
  }

  // REGRA 6 — Fallback (sintomas inespecíficos)
  return {
    diagnostico: "Sintomas Inespecíficos",
    urgencia: "BAIXA",
    conduta: [
      "Monitorar sintomas nas próximas 24–48h",
      "Hidratação e repouso",
      "Consultar médico se houver piora ou novos sintomas",
    ],
    regras_ativadas: [
      "Regra 6 (fallback): SE nenhuma regra anterior foi ativada ENTÃO diagnóstico = Sintomas Inespecíficos, urgência = BAIXA",
    ],
    sintomas_identificados,
  };
}
