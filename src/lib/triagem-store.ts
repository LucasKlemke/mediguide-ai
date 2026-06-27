import type { Resultado, Sintomas } from "@/engine/types";

// Estado em memória compartilhado entre as rotas (sem backend).
let _sintomas: Sintomas | null = null;
let _resultado: Resultado | null = null;

export const triagemStore = {
  setSintomas(s: Sintomas) {
    _sintomas = s;
  },
  getSintomas() {
    return _sintomas;
  },
  setResultado(r: Resultado) {
    _resultado = r;
  },
  getResultado() {
    return _resultado;
  },
  reset() {
    _sintomas = null;
    _resultado = null;
  },
};
