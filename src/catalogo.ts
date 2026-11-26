import type { Exercicio } from './types'

/** Busca no YouTube pelo nome do exercício, usada até você colar um link exato. */
const busca = (nome: string) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(nome + ' execução correta')}`

type Base = Omit<Exercicio, 'id' | 'origem' | 'passos' | 'videoUrl'> & { slug: string }

const BASE: Base[] = [
  { slug: 'supino-reto', nome: 'Supino reto', grupoMuscular: 'Peito', equipamento: 'Barra', explicacao: 'Empurre a barra para cima a partir do peito, com os ombros para trás.' },
  { slug: 'supino-inclinado-halteres', nome: 'Supino inclinado com halteres', grupoMuscular: 'Peito', equipamento: 'Halteres', explicacao: 'Empurre os halteres para cima num banco inclinado, focando na parte superior do peito.' },
  { slug: 'flexao', nome: 'Flexão de braço', grupoMuscular: 'Peito', equipamento: 'Peso corporal', explicacao: 'Desça o corpo em linha reta até quase encostar no chão e volte empurrando.' },
  { slug: 'crucifixo-polia', nome: 'Crucifixo na polia', grupoMuscular: 'Peito', equipamento: 'Polia', explicacao: 'Feche os braços à frente do corpo com a polia, mantendo leve flexão nos cotovelos.' },
  { slug: 'agachamento-livre', nome: 'Agachamento livre', grupoMuscular: 'Pernas', equipamento: 'Barra', explicacao: 'Agache mantendo o tronco firme e os joelhos alinhados com os pés.' },
  { slug: 'leg-press', nome: 'Leg press', grupoMuscular: 'Pernas', equipamento: 'Máquina', explicacao: 'Empurre a plataforma com os pés, sem travar os joelhos no final.' },
  { slug: 'cadeira-extensora', nome: 'Cadeira extensora', grupoMuscular: 'Quadríceps', equipamento: 'Máquina', explicacao: 'Estenda as pernas contra o apoio, contraindo o quadríceps no topo.' },
  { slug: 'mesa-flexora', nome: 'Mesa flexora', grupoMuscular: 'Posterior de coxa', equipamento: 'Máquina', explicacao: 'Flexione os joelhos trazendo o apoio em direção aos glúteos.' },
  { slug: 'stiff', nome: 'Stiff', grupoMuscular: 'Posterior de coxa', equipamento: 'Barra', explicacao: 'Desça a barra rente às pernas empurrando o quadril para trás, com as costas retas.' },
  { slug: 'levantamento-terra', nome: 'Levantamento terra', grupoMuscular: 'Costas', equipamento: 'Barra', explicacao: 'Levante a barra do chão estendendo quadril e joelhos, mantendo a coluna neutra.' },
  { slug: 'hip-thrust', nome: 'Hip thrust', grupoMuscular: 'Glúteos', equipamento: 'Barra', explicacao: 'Empurre o quadril para cima com as costas apoiadas num banco, apertando os glúteos no topo.' },
  { slug: 'passada', nome: 'Passada', grupoMuscular: 'Pernas', equipamento: 'Peso corporal', explicacao: 'Dê um passo à frente e flexione os dois joelhos, voltando à posição inicial.' },
  { slug: 'panturrilha-em-pe', nome: 'Panturrilha em pé', grupoMuscular: 'Panturrilha', equipamento: 'Máquina', explicacao: 'Suba na ponta dos pés e desça devagar até alongar a panturrilha.' },
  { slug: 'puxada-frontal', nome: 'Puxada frontal', grupoMuscular: 'Costas', equipamento: 'Polia', explicacao: 'Puxe a barra em direção ao peito, levando os cotovelos para baixo.' },
  { slug: 'barra-fixa', nome: 'Barra fixa', grupoMuscular: 'Costas', equipamento: 'Peso corporal', explicacao: 'Puxe o corpo para cima até o queixo passar da barra, e desça devagar.' },
  { slug: 'remada-baixa', nome: 'Remada baixa', grupoMuscular: 'Costas', equipamento: 'Polia', explicacao: 'Puxe o cabo em direção ao abdômen, mantendo o tronco firme.' },
  { slug: 'remada-unilateral', nome: 'Remada unilateral com halter', grupoMuscular: 'Costas', equipamento: 'Halteres', explicacao: 'Puxe o halter em direção ao quadril, apoiando a outra mão num banco.' },
  { slug: 'face-pull', nome: 'Face pull', grupoMuscular: 'Ombros', equipamento: 'Polia', explicacao: 'Puxe a corda em direção ao rosto, com os cotovelos altos.' },
  { slug: 'desenvolvimento-halteres', nome: 'Desenvolvimento com halteres', grupoMuscular: 'Ombros', equipamento: 'Halteres', explicacao: 'Empurre os halteres acima da cabeça, sentado ou em pé.' },
  { slug: 'elevacao-lateral', nome: 'Elevação lateral', grupoMuscular: 'Ombros', equipamento: 'Halteres', explicacao: 'Eleve os braços para os lados até a altura dos ombros, com leve flexão nos cotovelos.' },
  { slug: 'rosca-direta', nome: 'Rosca direta', grupoMuscular: 'Bíceps', equipamento: 'Barra', explicacao: 'Flexione os cotovelos trazendo a barra em direção aos ombros.' },
  { slug: 'rosca-martelo', nome: 'Rosca martelo', grupoMuscular: 'Bíceps', equipamento: 'Halteres', explicacao: 'Flexione os cotovelos com as palmas voltadas uma para a outra.' },
  { slug: 'triceps-polia-corda', nome: 'Tríceps na polia com corda', grupoMuscular: 'Tríceps', equipamento: 'Polia', explicacao: 'Estenda os cotovelos empurrando a corda para baixo, com os cotovelos junto ao corpo.' },
  { slug: 'mergulho', nome: 'Mergulho', grupoMuscular: 'Tríceps', equipamento: 'Peso corporal', explicacao: 'Desça o corpo flexionando os cotovelos e volte empurrando.' },
  { slug: 'prancha', nome: 'Prancha', grupoMuscular: 'Abdômen', equipamento: 'Peso corporal', explicacao: 'Mantenha o corpo reto apoiado nos antebraços e nas pontas dos pés.' },
  { slug: 'abdominal-crunch', nome: 'Abdominal crunch', grupoMuscular: 'Abdômen', equipamento: 'Peso corporal', explicacao: 'Eleve os ombros do chão contraindo o abdômen, sem puxar o pescoço.' },
  { slug: 'abdominal-polia', nome: 'Abdominal na polia', grupoMuscular: 'Abdômen', equipamento: 'Polia', explicacao: 'Flexione o tronco para baixo contra a polia, contraindo o abdômen.' },
  { slug: 'elevacao-pernas-suspenso', nome: 'Elevação de pernas suspenso', grupoMuscular: 'Abdômen', equipamento: 'Peso corporal', explicacao: 'Pendurado na barra, eleve as pernas controlando o movimento.' },
]

export const CATALOGO_INICIAL: Exercicio[] = BASE.map(({ slug, nome, ...resto }) => ({
  id: `cat-${slug}`,
  nome,
  ...resto,
  passos: [],
  videoUrl: busca(nome),
  origem: 'catalogo' as const,
}))
