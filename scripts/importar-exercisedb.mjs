// Uso: node scripts/importar-exercisedb.mjs
// Percorre o endpoint gratuito da ExerciseDB V1, filtra os exercícios principais
// (scripts/exercicios-principais.json) e gera src/catalogo-exercisedb.json.
// Para assim que encontrar todos, ou ao detectar paginação travada.
// O arquivo é salvo a cada página, então Ctrl+C não perde o progresso.
import { readFileSync, writeFileSync } from 'node:fs'

const BASE = 'https://oss.exercisedb.dev/api/v1/exercises'
const PAUSA_MS = 600
const MAX_TENTATIVAS = 8
const SAIDA = new URL('../src/catalogo-exercisedb.json', import.meta.url)

// Normaliza para comparar: minúsculas, sem hífen/pontuação e com espaços simples
const normalizar = (t) => String(t).toLowerCase().replace(/[-_.,/]/g, ' ').replace(/\s+/g, ' ').trim()

const nomesPrincipais = JSON.parse(
  readFileSync(new URL('./exercicios-principais.json', import.meta.url), 'utf8'),
).map(normalizar)
const principais = new Set(nomesPrincipais)

const encontrados = new Map()
let cursor = null
let pagina = 0
let limitePaginas = Infinity
const cursoresVistos = new Set()

function salvar() {
  const lista = [...encontrados.values()]
  writeFileSync(SAIDA, JSON.stringify(lista, null, 2))
  return lista
}

// Tenta de novo quando a API responde 429 (limite de requisições), esperando mais a cada vez.
async function buscarComEspera(url) {
  for (let tentativa = 1; tentativa <= MAX_TENTATIVAS; tentativa++) {
    const res = await fetch(url)
    if (res.ok) return res
    if (res.status !== 429 && res.status < 500) {
      throw new Error(`Falha na página ${pagina + 1}: HTTP ${res.status}`)
    }
    const espera = Number(res.headers.get('retry-after')) * 1000 || 2000 * 2 ** (tentativa - 1)
    console.log(`Página ${pagina + 1}: HTTP ${res.status}. Esperando ${Math.round(espera / 1000)}s (tentativa ${tentativa}/${MAX_TENTATIVAS})...`)
    await new Promise((r) => setTimeout(r, espera))
  }
  throw new Error(`Página ${pagina + 1} continua com erro após ${MAX_TENTATIVAS} tentativas.`)
}

let motivo = 'todas as páginas lidas'

while (true) {
  const url = cursor ? `${BASE}?cursor=${encodeURIComponent(cursor)}` : BASE
  const res = await buscarComEspera(url)
  const json = await res.json()
  pagina++

  if (pagina === 1 && json.meta?.total) {
    // Margem de 2 páginas sobre o total declarado, para não rodar para sempre
    limitePaginas = Math.ceil(json.meta.total / (json.data?.length || 10)) + 2
  }

  for (const ex of json.data ?? []) {
    const nome = normalizar(ex.name)
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
  salvar()
  console.log(`Página ${pagina}: ${encontrados.size}/${principais.size} exercícios principais encontrados.`)

  if (encontrados.size === principais.size) { motivo = 'todos os exercícios principais encontrados'; break }
  if (!json.meta?.hasNextPage || !json.meta?.nextCursor) break
  if (!json.data?.length) { motivo = 'página vazia'; break }
  if (cursoresVistos.has(json.meta.nextCursor)) { motivo = 'cursor repetido (paginação travada)'; break }
  if (pagina >= limitePaginas) { motivo = 'limite de páginas do total declarado'; break }

  cursoresVistos.add(json.meta.nextCursor)
  cursor = json.meta.nextCursor
  await new Promise((r) => setTimeout(r, PAUSA_MS))
}

const lista = salvar()
const faltando = nomesPrincipais.filter((n) => !encontrados.has(n))
console.log(`Parou: ${motivo}. Páginas lidas: ${pagina}. Exercícios salvos: ${lista.length}.`)
if (faltando.length) console.log(`Não encontrados pelo nome exato: ${faltando.join(', ')}`)
