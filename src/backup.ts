import { db } from './db'
import type { Backup } from './types'

export async function exportarBackup() {
  const dados: Backup = {
    versao: 1,
    exportadoEm: new Date().toISOString(),
    exercicios: await db.exercicios.toArray(),
    exerciciosNoDia: await db.exerciciosNoDia.toArray(),
  }
  const blob = new Blob([JSON.stringify(dados, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `treinos-backup-${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}

export async function importarBackup(arquivo: File) {
  const texto = await arquivo.text()
  const dados = JSON.parse(texto) as Backup
  if (dados.versao !== 1 || !Array.isArray(dados.exercicios) || !Array.isArray(dados.exerciciosNoDia)) {
    throw new Error('Arquivo de backup inválido.')
  }
  await db.transaction('rw', db.exercicios, db.exerciciosNoDia, async () => {
    await db.exercicios.clear()
    await db.exerciciosNoDia.clear()
    await db.exercicios.bulkAdd(dados.exercicios)
    await db.exerciciosNoDia.bulkAdd(dados.exerciciosNoDia)
  })
}
