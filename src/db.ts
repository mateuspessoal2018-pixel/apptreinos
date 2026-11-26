import Dexie, { type Table } from 'dexie'
import type { Exercicio, ExercicioNoDia } from './types'
import { CATALOGO_INICIAL } from './catalogo'

class PlannerDB extends Dexie {
  exercicios!: Table<Exercicio, string>
  exerciciosNoDia!: Table<ExercicioNoDia, string>

  constructor() {
    super('planner-treinos')
    this.version(1).stores({
      exercicios: 'id, grupoMuscular, origem',
      exerciciosNoDia: 'id, dia, exercicioId',
    })
  }
}

export const db = new PlannerDB()

/** Preenche a biblioteca com o catálogo base na primeira abertura. */
export async function garantirCatalogo() {
  // Atualiza o catálogo base sem apagar exercícios criados por você (origem 'usuario')
  // e sem sobrescrever links de vídeo que você já colou.
  const existentes = new Map((await db.exercicios.toArray()).map((e) => [e.id, e]))
  const novos = CATALOGO_INICIAL.filter((e) => !existentes.has(e.id)).map((e) => e)
  if (novos.length) await db.exercicios.bulkAdd(novos)
}

export function novoId(): string {
  return crypto.randomUUID()
}
