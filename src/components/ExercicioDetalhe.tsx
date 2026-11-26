import { useState } from 'react'
import { db } from '../db'
import type { Exercicio } from '../types'

interface Props {
  exercicio: Exercicio
  onFechar: () => void
}

export function ExercicioDetalhe({ exercicio, onFechar }: Props) {
  const [semGif, setSemGif] = useState(false)
  const [video, setVideo] = useState(exercicio.videoUrl ?? '')

  async function salvarVideo() {
    const url = video.trim() || undefined
    if (url !== exercicio.videoUrl) await db.exercicios.update(exercicio.id, { videoUrl: url })
  }

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="fechar" onClick={onFechar} aria-label="Fechar">✕</button>
        <h2>{exercicio.nome}</h2>
        <p className="meta">
          {exercicio.grupoMuscular} · {exercicio.equipamento}
        </p>

        {exercicio.gifUrl && !semGif && (
          <img
            className="gif"
            src={exercicio.gifUrl}
            alt={`Execução de ${exercicio.nome}`}
            loading="lazy"
            onError={() => setSemGif(true)}
          />
        )}

        <p className="explicacao">{exercicio.explicacao}</p>

        {exercicio.passos.length > 0 && (
          <ol className="passos">
            {exercicio.passos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        )}

        <div className="video">
          {exercicio.videoUrl && (
            <a className="botao-video" href={exercicio.videoUrl} target="_blank" rel="noreferrer">
              Ver vídeo
            </a>
          )}
          <label>
            Link do vídeo (cole o link exato para substituir a busca)
            <input
              value={video}
              placeholder="https://www.youtube.com/watch?v=..."
              onChange={(e) => setVideo(e.target.value)}
              onBlur={salvarVideo}
            />
          </label>
        </div>
      </div>
    </div>
  )
}
