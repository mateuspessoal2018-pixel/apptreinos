import type { Exercicio } from './types'

/**
 * Catálogo inicial. Os campos de texto seguem o estilo do Free Exercise DB
 * (domínio público). O gifUrl fica vazio até você apontar para a fonte escolhida
 * (ExerciseDB ou WorkoutX) ou para um arquivo próprio.
 */
export const CATALOGO_INICIAL: Exercicio[] = [
  {
    id: 'cat-supino-reto',
    nome: 'Supino reto',
    grupoMuscular: 'Peito',
    equipamento: 'Barra',
    explicacao: 'Empurre a barra para cima a partir do peito, mantendo os ombros para trás.',
    passos: [
      'Deite no banco com os pés firmes no chão.',
      'Segure a barra um pouco mais larga que os ombros.',
      'Desça a barra até encostar de leve no peito.',
      'Empurre até estender os braços sem travar os cotovelos.',
    ],
    origem: 'catalogo',
  },
  {
    id: 'cat-agachamento',
    nome: 'Agachamento livre',
    grupoMuscular: 'Pernas',
    equipamento: 'Barra',
    explicacao: 'Agache mantendo o tronco firme e os joelhos alinhados com os pés.',
    passos: [
      'Posicione a barra sobre os trapézios.',
      'Afaste os pés na largura dos ombros.',
      'Desça empurrando o quadril para trás até as coxas ficarem paralelas ao chão.',
      'Suba empurrando o chão com os pés.',
    ],
    origem: 'catalogo',
  },
  {
    id: 'cat-puxada-frente',
    nome: 'Puxada frontal',
    grupoMuscular: 'Costas',
    equipamento: 'Polia',
    explicacao: 'Puxe a barra em direção ao peito, levando os cotovelos para baixo.',
    passos: [
      'Sente com as coxas presas no apoio.',
      'Segure a barra com pegada mais larga que os ombros.',
      'Puxe a barra até o alto do peito.',
      'Volte devagar até estender os braços.',
    ],
    origem: 'catalogo',
  },
  {
    id: 'cat-desenvolvimento',
    nome: 'Desenvolvimento com halteres',
    grupoMuscular: 'Ombros',
    equipamento: 'Halteres',
    explicacao: 'Empurre os halteres acima da cabeça, sentado ou em pé.',
    passos: [
      'Segure um halter em cada mão na altura dos ombros.',
      'Empurre os halteres para cima até quase estender os braços.',
      'Desça controlando o movimento até a altura inicial.',
    ],
    origem: 'catalogo',
  },
  {
    id: 'cat-rosca-direta',
    nome: 'Rosca direta',
    grupoMuscular: 'Bíceps',
    equipamento: 'Barra',
    explicacao: 'Flexione os cotovelos trazendo a barra em direção aos ombros.',
    passos: [
      'Fique em pé com a barra na altura das coxas, pegada supinada.',
      'Flexione os cotovelos sem mexer os ombros.',
      'Desça devagar até estender os braços.',
    ],
    origem: 'catalogo',
  },
  {
    id: 'cat-triceps-corda',
    nome: 'Tríceps na polia com corda',
    grupoMuscular: 'Tríceps',
    equipamento: 'Polia',
    explicacao: 'Estenda os cotovelos empurrando a corda para baixo.',
    passos: [
      'Segure a corda com as duas mãos acima da cabeça ou na altura do peito.',
      'Mantenha os cotovelos junto ao corpo.',
      'Empurre a corda para baixo até estender os braços.',
      'Volte devagar.',
    ],
    origem: 'catalogo',
  },
  {
    id: 'cat-stiff',
    nome: 'Stiff',
    grupoMuscular: 'Posterior de coxa',
    equipamento: 'Barra',
    explicacao: 'Desça a barra rente às pernas empurrando o quadril para trás, com joelhos levemente flexionados.',
    passos: [
      'Segure a barra na frente das coxas.',
      'Empurre o quadril para trás mantendo as costas retas.',
      'Desça até sentir alongamento na parte de trás das coxas.',
      'Suba apertando glúteos.',
    ],
    origem: 'catalogo',
  },
  {
    id: 'cat-prancha',
    nome: 'Prancha',
    grupoMuscular: 'Abdômen',
    equipamento: 'Peso corporal',
    explicacao: 'Mantenha o corpo reto apoiado nos antebraços e pontas dos pés.',
    passos: [
      'Apoie os antebraços no chão, cotovelos sob os ombros.',
      'Estique as pernas e mantenha o corpo em linha reta.',
      'Contraia o abdômen e segure pelo tempo definido.',
    ],
    origem: 'catalogo',
  },
]
