/**
 * CONTEÚDOS DO SITE FORTIS
 * ------------------------------------------------------------
 * Este é o único ficheiro a editar para mudar textos, FAQ, planos,
 * morada, contactos e redes sociais. Ver README.md › "Editar conteúdos".
 *
 * Regras:
 * - `null` = informação ainda não existe → o bloco fica escondido.
 * - `confirmado: false` = existe mas não está validado pela FORTIS →
 *   escondido no site público; visível com etiqueta "Por confirmar"
 *   apenas quando PUBLIC_PREVIEW=true (ambiente de testes).
 * - Imagens: colocar em /public/images e indicar o caminho, ex. "images/espaco-1.webp".
 *   Sem imagem, aparece um marcador "Imagem conceptual".
 */

export type Fase = 'pre-abertura' | 'aberto';

export interface Imagem {
  src: string;
  alt: string;
  largura: number;
  altura: number;
  /** true enquanto for imagem ilustrativa e não do espaço real */
  conceptual?: boolean;
}

export const site = {
  /** Mudar para 'aberto' depois da abertura: mostra planos, morada, mapa, etc. */
  fase: 'pre-abertura' as Fase,

  nome: 'FORTIS Training Center',
  slogan: 'Mais do que treinar. Evoluir.',
  localidade: 'Celorico de Basto',
  regiao: 'Braga',
  pais: 'Portugal',

  seo: {
    titulo: 'FORTIS Training Center | Treino funcional em Celorico de Basto',
    descricao:
      'A FORTIS Training Center está a chegar a Celorico de Basto: treino funcional, acompanhamento, aulas de grupo e treino híbrido. Deixa o teu contacto e recebe as novidades.',
  },

  contactos: {
    email: null as string | null, // ex.: 'geral@fortis.pt'
    telefone: null as string | null, // ex.: '+351 912 345 678'
    /** Número em formato internacional, só dígitos, ex.: '351912345678' */
    whatsapp: null as string | null,
    instagram: null as string | null, // ex.: 'https://www.instagram.com/fortis.trainingcenter'
    instagramHandle: null as string | null, // ex.: '@fortis.trainingcenter'
  },

  morada: {
    confirmada: false,
    rua: null as string | null,
    codigoPostal: null as string | null,
    localidade: 'Celorico de Basto',
    /** Link "Como chegar", ex.: 'https://maps.google.com/?q=...' */
    direcoesUrl: null as string | null,
    /** URL de incorporação do Google Maps (Partilhar › Incorporar mapa › src) */
    mapaEmbedUrl: null as string | null,
    latitude: null as number | null,
    longitude: null as number | null,
  },

  hero: {
    titulo: 'Mais do que treinar.',
    destaque: 'Evoluir.',
    subtitulo: 'Uma nova forma de treinar está a chegar a Celorico de Basto.',
    etiqueta: 'Celorico de Basto · Brevemente',
    imagem: null as Imagem | null,
    /** Vídeo curto em loop (mp4, sem som), opcional */
    video: null as string | null,
    temas: ['Treino funcional', 'Acompanhamento', 'Aulas de grupo', 'Treino híbrido'],
  },

  sobre: {
    titulo: 'Uma nova forma de',
    destaque: 'treinar.',
    texto:
      'A FORTIS Training Center nasce em Celorico de Basto com uma visão clara: criar um espaço onde força, disciplina e superação fazem parte de cada treino.',
    texto2:
      'Mais do que um local para treinar, queremos construir uma comunidade onde cada pessoa encontra motivação para evoluir.',
    valores: [
      { icone: 'forca', titulo: 'Força', texto: 'Treino com propósito, para construir uma base sólida dentro e fora do ginásio.' },
      { icone: 'evolucao', titulo: 'Evolução', texto: 'Cada treino é um passo. Disciplina e consistência para ires sempre mais longe.' },
      { icone: 'comunidade', titulo: 'Comunidade', texto: 'Um espaço onde a motivação se partilha e ninguém treina sozinho.' },
    ],
  },

  modalidades: {
    titulo: 'Encontra o teu',
    destaque: 'ritmo.',
    intro: 'Quatro formas de treinar, pensadas para diferentes objetivos e níveis de experiência.',
    lista: [
      { nome: 'Treino Funcional', texto: 'Força, resistência e mobilidade através de movimentos funcionais.', imagem: null as Imagem | null, confirmado: false },
      { nome: 'Treino Personalizado', texto: 'Acompanhamento ajustado aos teus objetivos.', imagem: null as Imagem | null, confirmado: false },
      { nome: 'Aulas de Grupo', texto: 'Treina com energia e motivação em comunidade.', imagem: null as Imagem | null, confirmado: false },
      { nome: 'Treino Híbrido', texto: 'Combinação de força e resistência para desafiar a tua performance.', imagem: null as Imagem | null, confirmado: false },
    ],
  },

  espaco: {
    titulo: 'O espaço onde começa a tua',
    destaque: 'evolução.',
    texto:
      'Uma área de treino ampla e funcional, pensada para treino de força, condicionamento e aulas de grupo — com espaço para te movimentares à vontade.',
    indicadores: [
      { valor: '+500', texto: 'm² de área de treino', confirmado: true },
      { valor: '≈3’', texto: 'do centro de Celorico de Basto', confirmado: false },
      { valor: '≈5’', texto: 'do centro de Mondim de Basto', confirmado: false },
    ],
    /** 4 a 6 imagens. Enquanto vazio, mostra marcadores "Imagem conceptual". */
    galeria: [] as Imagem[],
    legendasMarcadores: ['Zona de força', 'Área funcional', 'Aulas de grupo', 'Balneários', 'Receção', 'Área de cardio'],
  },

  experiencia: {
    titulo: 'O teu compromisso.',
    destaque: 'A nossa motivação.',
    pilares: [
      { titulo: 'Treino com propósito', texto: 'Cada sessão tem um objetivo claro e faz parte de um caminho.' },
      { titulo: 'Acompanhamento', texto: 'Orientação próxima para treinares com confiança e segurança.' },
      { titulo: 'Evolução contínua', texto: 'Progressão consistente, ao teu ritmo, sem atalhos.' },
      { titulo: 'Comunidade', texto: 'Pessoas que se motivam umas às outras, treino após treino.' },
    ],
    /** Equipa: fica escondida enquanto a lista estiver vazia. */
    equipa: [] as { nome: string; funcao: string; foto: Imagem | null }[],
  },

  planos: {
    preAbertura: {
      titulo: 'Informações',
      destaque: 'em breve.',
      texto: 'Estamos a preparar os nossos planos e condições de adesão. Deixa-nos o teu contacto para receber novidades.',
      cta: 'Receber novidades',
    },
    aberto: {
      titulo: 'Escolhe o teu',
      destaque: 'plano.',
      notas: null as string | null, // ex.: 'Preços com IVA incluído. Sem fidelização.'
    },
    /** Só aparecem com fase 'aberto'. Não publicar valores provisórios. */
    lista: [] as { nome: string; preco: string; periodo: string; inclui: string[]; destaque?: boolean }[],
  },

  localizacao: {
    titulo: 'Estamos mais perto do que',
    destaque: 'imaginas.',
    semMorada: 'A morada completa será divulgada em breve.',
  },

  faq: [
    { p: 'Quando abre a FORTIS?', r: 'A abertura está prevista para o início de 2027. A data exata será anunciada aqui e nas nossas redes sociais assim que estiver confirmada.' },
    { p: 'Que modalidades vão estar disponíveis?', r: 'Estamos a preparar treino funcional, treino personalizado, aulas de grupo e treino híbrido. A oferta final será confirmada antes da abertura.' },
    { p: 'Quanto vai custar?', r: 'Os planos e condições de adesão ainda estão a ser definidos. Deixa o teu contacto para seres dos primeiros a saber.' },
    { p: 'Quais vão ser os horários?', r: 'Os horários serão divulgados antes da abertura, nesta página e nas nossas redes sociais.' },
    { p: 'Como posso inscrever-me?', r: 'Para já, podes deixar o teu contacto no formulário. Este pedido não constitui uma inscrição — entraremos em contacto quando as inscrições abrirem.' },
  ],

  contacto: {
    titulo: 'O teu próximo passo começa',
    destaque: 'aqui.',
    texto:
      'Deixa-nos o teu contacto e diz-nos o que te interessa. Vamos partilhar contigo as novidades da abertura, planos e modalidades.',
    aviso: 'Este pedido é apenas uma manifestação de interesse e não constitui uma inscrição.',
    opcoesModalidade: ['Treino Funcional', 'Treino Personalizado', 'Aulas de Grupo', 'Treino Híbrido', 'Ainda não sei'],
    /** Texto exato do consentimento, guardado com cada pedido como evidência. */
    consentimentoPrivacidade:
      'Autorizo o tratamento dos meus dados pessoais pela FORTIS Training Center para responder a este pedido, nos termos da Política de Privacidade.',
    consentimentoMarketing: 'Quero receber novidades e comunicações da FORTIS por email ou telemóvel. (Opcional)',
    sucessoTitulo: 'Pedido recebido.',
    sucessoTexto: 'Obrigado pelo teu interesse na FORTIS. A nossa equipa irá entrar em contacto contigo.',
  },

  legal: {
    /** Entidade responsável pelo tratamento dos dados — OBRIGATÓRIO antes de publicar. */
    entidade: null as string | null, // ex.: 'FORTIS, Lda.'
    nif: null as string | null,
    emailPrivacidade: null as string | null,
    /** Atualizar a data sempre que a política mudar (fica guardada com cada consentimento). */
    versaoPolitica: '2026-10-16',
    retencaoMeses: 24,
  },
};

export type Site = typeof site;
