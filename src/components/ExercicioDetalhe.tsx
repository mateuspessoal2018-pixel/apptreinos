import { useState } from 'react'
import type { Exercicio } from '../types'

interface Props {
  exercicio: Exercicio
  onFechar: () => void
}

export function ExercicioDetalhe({ exercicio, onFechar }: Props) {
  const [semGif, setSemGif] = useState(false)

  return (
    <div className="modal-fundo" onClick={onFechar}>
      <div className="modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true">
        <button className="fechar" onClick={onFechar} aria-label="Fechar">✕</button>
        <h2>{exercicio.nome}</h2>
        <p className="meta">
          {exercicio.grupoMuscular} · {exercicio.equipamento}
        </p>

        {exercicio.gifUrl && !semGif ? (
          <img
            className="gif"
            src={exercicio.gifUrl}
            alt={`Execução de ${exercicio.nome}`}
            loading="lazy"
            onError={() => setSemGif(true)}
          />
        ) : (
          <div className="gif-vazio">GIF indisponível. Sem internet ou sem fonte configurada.</div>
        )}

        <p className="explicacao">{exercicio.explicacao}</p>

        {exercicio.passos.length > 0 && (
          <ol className="passos">
            {exercicio.passos.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
