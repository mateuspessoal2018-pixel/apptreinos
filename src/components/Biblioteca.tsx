import { useState } from 'react'
import { db, novoId } from '../db'
import type { Exercicio } from '../types'

interface Props {
  exercicios: Exercicio[]
}

const vazio = { nome: '', grupoMuscular: '', equipamento: '', explicacao: '', gifUrl: '', videoUrl: '' }

export function Biblioteca({ exercicios }: Props) {
  const [busca, setBusca] = useState('')
  const [form, setForm] = useState(vazio)

  const filtrados = exercicios
    .filter((e) => e.nome.toLowerCase().includes(busca.toLowerCase()) || e.grupoMuscular.toLowerCase().includes(busca.toLowerCase()))
    .sort((a, b) => a.nome.localeCompare(b.nome))

  async function criar(e: React.FormEvent) {
    e.preventDefault()
    if (!form.nome.trim()) return
    await db.exercicios.add({
      id: novoId(),
      nome: form.nome.trim(),
      grupoMuscular: form.grupoMuscular.trim() || 'Outro',
      equipamento: form.equipamento.trim() || 'Outro',
      explicacao: form.explicacao.trim(),
      passos: [],
      gifUrl: form.gifUrl.trim() || undefined,
      videoUrl: form.videoUrl.trim() || undefined,
      origem: 'usuario',
    })
    setForm(vazio)
  }

  async function excluir(ex: Exercicio) {
    if (!confirm(`Excluir "${ex.nome}" da biblioteca?`)) return
    await db.exerciciosNoDia.where('exercicioId').equals(ex.id).delete()
    await db.exercicios.delete(ex.id)
  }

  return (
    <main>
      <input
        className="busca"
        placeholder="Buscar exercício ou grupo muscular"
        value={busca}
        onChange={(e) => setBusca(e.target.value)}
      />

      <ul className="lista-biblioteca">
        {filtrados.map((ex) => (
          <li key={ex.id}>
            <div>
              <strong>{ex.nome}</strong>
              <span className="meta"> {ex.grupoMuscular} · {ex.equipamento}</span>
            </div>
            {ex.origem === 'usuario' && (
              <button className="remover" onClick={() => excluir(ex)}>Excluir</button>
            )}
          </li>
        ))}
      </ul>

      <form className="novo-exercicio" onSubmit={criar}>
        <h3>Criar exercício</h3>
        <input placeholder="Nome" value={form.nome} onChange={(e) => setForm({ ...form, nome: e.target.value })} />
        <input placeholder="Grupo muscular" value={form.grupoMuscular} onChange={(e) => setForm({ ...form, grupoMuscular: e.target.value })} />
        <input placeholder="Equipamento" value={form.equipamento} onChange={(e) => setForm({ ...form, equipamento: e.target.value })} />
        <textarea placeholder="Explicação curta" value={form.explicacao} onChange={(e) => setForm({ ...form, explicacao: e.target.value })} />
        <input placeholder="URL do GIF (opcional)" value={form.gifUrl} onChange={(e) => setForm({ ...form, gifUrl: e.target.value })} />
        <input placeholder="Link do vídeo (opcional)" value={form.videoUrl} onChange={(e) => setForm({ ...form, videoUrl: e.target.value })} />
        <button type="submit">Salvar exercício</button>
      </form>
    </main>
  )
}
