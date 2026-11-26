export const DIAS = [
  { chave: 1, nome: 'Segunda' },
  { chave: 2, nome: 'Terça' },
  { chave: 3, nome: 'Quarta' },
  { chave: 4, nome: 'Quinta' },
  { chave: 5, nome: 'Sexta' },
] as const

export type DiaSemana = 1 | 2 | 3 | 4 | 5

/** Exercício da biblioteca. Pode ser do catálogo base ou criado pelo usuário. */
export interface Exercicio {
  id: string
  nome: string
  grupoMuscular: string
  equipamento: string
  explicacao: string
  passos: string[]
  gifUrl?: string
  videoUrl?: string
  origem: 'catalogo' | 'usuario'
}

/** Exercício colocado em um dia, com os parâmetros personalizados. */
export interface ExercicioNoDia {
  id: string
  dia: DiaSemana
  exercicioId: string
  ordem: number
  series: number
  repeticoes: string
  carga: string
  descansoSeg: number
  feito: boolean
}

export interface Backup {
  versao: 1
  exportadoEm: string
  exercicios: Exercicio[]
  exerciciosNoDia: ExercicioNoDia[]
}
