export interface Sintomas {
  febre: "alta" | "baixa" | "nao";
  tosse: "seca" | "catarro" | "nao";
  dor_cabeca: "forte" | "leve" | "nao";
  falta_ar: "intensa" | "leve" | "nao";
  dor_garganta: "sim" | "nao";
  dores_corpo: "generalizada" | "localizada" | "nao";
  tempo_sintomas: "menos_24h" | "1_3_dias" | "mais_3_dias";
}

export type Urgencia = "ALTA" | "MEDIA" | "BAIXA";

export interface Resultado {
  diagnostico: string;
  urgencia: Urgencia;
  conduta: string[];
  regras_ativadas: string[];
  sintomas_identificados: string[];
}
