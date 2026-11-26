// Uso: EXERCISEDB_BASE=<url-base> node scripts/importar-exercisedb.mjs
// Gera src/catalogo-exercisedb.json com os exercícios principais e seus GIFs.
// ATENÇÃO: o formato de resposta abaixo segue o padrão público da ExerciseDB.
// Confirme os campos e a URL base na documentação antes de rodar.
import { readFileSync, writeFileSync } from 'node:fs'

const BASE = process.env.EXERCISEDB_BASE
if (!BASE) {
  console.error('Defina EXERCISEDB_BASE com a URL base da API.')
  process.exit(1)
}

const nomes = JSON.parse(readFileSync(new URL('./exercicios-principais.json', import.meta.url), 'utf8'))
const saida = []

for (const nome of nomes) {
  const res = await fetch(`${BASE}/exercises/name/${encodeURIComponent(nome)}`)
  if (!res.ok) {
    console.warn(`Falhou: ${nome} (${res.status})`)
    continue
  }
  const [ex] = await res.json()
  if (!ex) {
    console.warn(`Não encontrado: ${nome}`)
    continue
  }
  saida.push({
    id: `edb-${ex.id}`,
    nome: ex.name,
    grupoMuscular: ex.target,
    equipamento: ex.equipment,
    explicacao: (ex.instructions?.[0] ?? '').slice(0, 200),
    passos: ex.instructions ?? [],
    gifUrl: ex.gifUrl,
    origem: 'catalogo',
  })
}

writeFileSync(new URL('../src/catalogo-exercisedb.json', import.meta.url), JSON.stringify(saida, null, 2))
console.log(`${saida.length} exercícios salvos em src/catalogo-exercisedb.json`)
