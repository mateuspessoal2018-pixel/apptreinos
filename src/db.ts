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
  const total = await db.exercicios.count()
  if (total === 0) {
    await db.exercicios.bulkAdd(CATALOGO_INICIAL)
  }
}

export function novoId(): string {
  return crypto.randomUUID()
}
