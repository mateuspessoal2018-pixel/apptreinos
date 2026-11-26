// Uso: node scripts/importar-exercisedb.mjs
// Percorre o endpoint gratuito da ExerciseDB V1, filtra os exercícios principais
// (scripts/exercicios-principais.json) e gera src/catalogo-exercisedb.json.
// Rode uma única vez. Depois o app lê o JSON gerado e não chama a API.
import { readFileSync, writeFileSync } from 'node:fs'

const BASE = 'https://oss.exercisedb.dev/api/v1/exercises'
const PAUSA_MS = 150 // pausa entre páginas para não sobrecarregar a API

const principais = new Set(
  JSON.parse(readFileSync(new URL('./exercicios-principais.json', import.meta.url), 'utf8')).map((n) =>
    n.toLowerCase().trim(),
  ),
)

const encontrados = new Map()
let cursor = null
let pagina = 0

do {
  const url = cursor ? `${BASE}?cursor=${encodeURIComponent(cursor)}` : BASE
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Falha na página ${pagina + 1}: HTTP ${res.status}`)
  const json = await res.json()
  pagina++

  for (const ex of json.data ?? []) {
    const nome = String(ex.name).toLowerCase().trim()
    if (principais.has(nome) && !encontrados.has(nome)) {
      encontrados.set(nome, {
        id: `edb-${ex.exerciseId}`,
        nome: ex.name,
        grupoMuscular: ex.targetMuscles?.[0] ?? ex.bodyParts?.[0] ?? 'Outro',
        equipamento: ex.equipments?.[0] ?? 'Outro',
        explicacao: (ex.instructions?.[0] ?? '').slice(0, 200),
        passos: ex.instructions ?? [],
        gifUrl: ex.gifUrl,
        origem: 'catalogo',
      })
    }
  }

  cursor = json.meta?.hasNextPage ? json.meta.nextCursor : null
  if (cursor) await new Promise((r) => setTimeout(r, PAUSA_MS))
} while (cursor)

const saida = [...encontrados.values()]
const faltando = [...principais].filter((n) => !encontrados.has(n))

writeFileSync(new URL('../src/catalogo-exercisedb.json', import.meta.url), JSON.stringify(saida, null, 2))
console.log(`Páginas lidas: ${pagina}. Exercícios salvos: ${saida.length}.`)
if (faltando.length) console.log(`Não encontrados pelo nome exato: ${faltando.join(', ')}`)
