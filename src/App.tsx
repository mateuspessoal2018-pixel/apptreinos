import { useEffect, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { db, garantirCatalogo, novoId } from './db'
import { DIAS, type DiaSemana, type Exercicio, type ExercicioNoDia } from './types'
import { Biblioteca } from './components/Biblioteca'
import { ExercicioDetalhe } from './components/ExercicioDetalhe'
import { exportarBackup, importarBackup } from './backup'

type Aba = 'semana' | 'biblioteca'

export default function App() {
  const [aba, setAba] = useState<Aba>('semana')
  const [dia, setDia] = useState<DiaSemana>(hojeNaSemana())
  const [detalhe, setDetalhe] = useState<Exercicio | null>(null)
  const [pronto, setPronto] = useState(false)

  useEffect(() => {
    garantirCatalogo().then(() => setPronto(true))
  }, [])

  const exercicios = useLiveQuery(() => db.exercicios.toArray(), [], [])
  const doDia = useLiveQuery(
    () => db.exerciciosNoDia.where('dia').equals(dia).sortBy('ordem'),
    [dia],
    [],
  )

  if (!pronto) return <p className="aviso">Carregando…</p>

  const porId = new Map(exercicios.map((e) => [e.id, e]))

  async function adicionar(exercicioId: string) {
    const ordem = doDia.length ? Math.max(...doDia.map((d) => d.ordem)) + 1 : 0
    const novo: ExercicioNoDia = {
      id: novoId(),
      dia,
      exercicioId,
      ordem,
      series: 3,
      repeticoes: '10',
      carga: '',
      descansoSeg: 60,
      feito: false,
    }
    await db.exerciciosNoDia.add(novo)
  }

  async function remover(item: ExercicioNoDia) {
    await db.exerciciosNoDia.delete(item.id)
  }

  async function atualizar(item: ExercicioNoDia, campos: Partial<ExercicioNoDia>) {
    await db.exerciciosNoDia.update(item.id, campos)
  }

  async function mover(index: number, direcao: -1 | 1) {
    const alvo = index + direcao
    if (alvo < 0 || alvo >= doDia.length) return
    const a = doDia[index]
    const b = doDia[alvo]
    await db.transaction('rw', db.exerciciosNoDia, async () => {
      await db.exerciciosNoDia.update(a.id, { ordem: b.ordem })
      await db.exerciciosNoDia.update(b.id, { ordem: a.ordem })
    })
  }

  return (
    <div className="app">
      <header className="topo">
        <h1>Treinos</h1>
        <nav>
          <button className={aba === 'semana' ? 'ativo' : ''} onClick={() => setAba('semana')}>
            Semana
          </button>
          <button className={aba === 'biblioteca' ? 'ativo' : ''} onClick={() => setAba('biblioteca')}>
            Biblioteca
          </button>
        </nav>
      </header>

      {aba === 'semana' && (
        <main>
          <div className="dias">
            {DIAS.map((d) => (
              <button
                key={d.chave}
                className={dia === d.chave ? 'dia ativo' : 'dia'}
                onClick={() => setDia(d.chave)}
              >
                {d.nome.slice(0, 3)}
              </button>
            ))}
          </div>

          <h2>{DIAS.find((d) => d.chave === dia)?.nome}</h2>

          {doDia.length === 0 && <p className="vazio">Nenhum exercício neste dia. Adicione abaixo.</p>}

          <ul className="lista">
            {doDia.map((item, index) => {
              const ex = porId.get(item.exercicioId)
              return (
                <li key={item.id} className={item.feito ? 'item feito' : 'item'}>
                  <div className="item-topo">
                    <input
                      type="checkbox"
                      checked={item.feito}
                      onChange={(e) => atualizar(item, { feito: e.target.checked })}
                      aria-label="Marcar como feito"
                    />
                    <button className="nome" onClick={() => ex && setDetalhe(ex)}>
                      {ex?.nome ?? 'Exercício removido'}
                    </button>
                    <div className="ordem">
                      <button onClick={() => mover(index, -1)} aria-label="Subir">▲</button>
                      <button onClick={() => mover(index, 1)} aria-label="Descer">▼</button>
                    </div>
                  </div>
                  <div className="campos">
                    <label>
                      Séries
                      <input
                        type="number"
                        min={1}
                        value={item.series}
                        onChange={(e) => atualizar(item, { series: Number(e.target.value) })}
                      />
                    </label>
                    <label>
                      Reps
                      <input
                        value={item.repeticoes}
                        onChange={(e) => atualizar(item, { repeticoes: e.target.value })}
                      />
                    </label>
                    <label>
                      Carga
                      <input
                        value={item.carga}
                        placeholder="kg"
                        onChange={(e) => atualizar(item, { carga: e.target.value })}
                      />
                    </label>
                    <label>
                      Descanso (s)
                      <input
                        type="number"
                        min={0}
                        value={item.descansoSeg}
                        onChange={(e) => atualizar(item, { descansoSeg: Number(e.target.value) })}
                      />
                    </label>
                  </div>
                  <button className="remover" onClick={() => remover(item)}>
                    Remover do dia
                  </button>
                </li>
              )
            })}
          </ul>

          <section className="adicionar">
            <h3>Adicionar exercício</h3>
            <select defaultValue="" onChange={(e) => { if (e.target.value) { adicionar(e.target.value); e.target.value = '' } }}>
              <option value="">Escolha um exercício…</option>
              {exercicios
                .slice()
                .sort((a, b) => a.nome.localeCompare(b.nome))
                .map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nome} ({e.grupoMuscular})
                  </option>
                ))}
            </select>
          </section>
        </main>
      )}

      {aba === 'biblioteca' && <Biblioteca exercicios={exercicios} />}

      <footer className="rodape">
        <button onClick={() => exportarBackup()}>Exportar backup</button>
        <label className="botao-arquivo">
          Importar backup
          <input
            type="file"
            accept="application/json"
            hidden
            onChange={(e) => {
              const arq = e.target.files?.[0]
              if (arq) importarBackup(arq).then(() => alert('Backup importado.'))
            }}
          />
        </label>
      </footer>

      {detalhe && <ExercicioDetalhe exercicio={detalhe} onFechar={() => setDetalhe(null)} />}
    </div>
  )
}

function hojeNaSemana(): DiaSemana {
  const d = new Date().getDay() // 0 = domingo
  return d >= 1 && d <= 5 ? (d as DiaSemana) : 1
}
