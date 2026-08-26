/* ============================
   Áreas de atuação — single source of truth for the homepage grid
   (index.html) and every area's own detail page (e.g. ansiedade.html).

   `icon`/`name`/`flip` drive the homepage card.
   `detailImage`/`title`/`titleLight`/`description`/`manifest` drive the
   detail page's hero and "Quando procurar ajuda" section.
   Every `manifest` list has exactly 8 items (two rows of 4).
   To add/remove an area, edit this list only.
   ============================ */
window.AREAS = [
  {
    slug: 'phda',
    href: 'phda.html',
    pageTitle: 'PHDA - Perturbação de Hiperatividade e Défice de Atenção | Clínica Gonçalo Marinho',
    color: 'white',
    icon: 'assets/perturbacao-hiperatividade-defice-atencao-img.svg',
    name: 'PHDA',
    detailImage: 'assets/perturbacao-hiperatividade-defice-atencao-img.svg',
    title: 'Perturbação de Hiperatividade e Défice de Atenção',
    titleLight: 'PHDA',
    description: [
      '<p>A PHDA é uma perturbação do neurodesenvolvimento cuja sintomatologia se organiza em três domínios nucleares:</p>',
      '<ul class="area-intro-list"><li><strong>Desatenção:</strong> dificuldades em manter o foco, organizar tarefas, gerir o tempo, seguir instruções, concluir atividades e maior propensão para erros por distração</li><li><strong>Hiperatividade:</strong> atividade motora excessiva, sensação persistente de inquietação e dificuldade em permanecer parado</li><li><strong>Impulsividade:</strong> tendência para interromper os outros, responder ou tomar decisões precipitadamente e dificuldade em aguardar a sua vez</li></ul>',
      '<p>A PHDA tem habitualmente início na infância, podendo persistir na adolescência e na idade adulta, com impacto significativo no funcionamento académico, profissional ou social.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/aim.png', text: 'Dificuldade em manter o foco' },
      { color: 'yellow', icon: 'assets/clipboard.png', text: 'Dificuldade na organização e planeamento' },
      { color: 'blue', icon: 'assets/hourglass.png', text: 'Tendência para adiar tarefas de forma persistente' },
      { color: 'white', icon: 'assets/mindset.png', text: 'Dificuldade em gerir várias tarefas em simultâneo' },
      { color: 'yellow', icon: 'assets/calendar.png', text: 'Dificuldade em gerir rotinas e responsabilidades' },
      { color: 'red', icon: 'assets/flash.png', text: 'Inquietação constante ou dificuldade em permanecer parado' },
      { color: 'white', icon: 'assets/danger.png', text: 'Impulsividade nas respostas ou nas decisões' },
      { color: 'blue', icon: 'assets/chat.png', text: 'Tendência para interromper os outros ou dificuldade em aguardar a sua vez' }
    ]
  },
  {
    slug: 'pea',
    href: 'pea.html',
    pageTitle: 'PEA - Perturbação do Espetro do Autismo | Clínica Gonçalo Marinho',
    color: 'blue',
    icon: 'assets/perturbacao-espectro-autismo-img.svg',
    name: 'PEA',
    detailImage: 'assets/perturbacao-espectro-autismo-img.svg',
    title: 'Perturbação do Espetro do Autismo',
    titleLight: 'PEA',
    description: [
      '<p>A PEA caracteriza-se por alterações em dois domínios nucleares:</p>',
      '<ul class="area-intro-list"><li><strong>Comunicação e interação social:</strong> dificuldades na reciprocidade socioemocional, na compreensão e utilização da comunicação verbal e não verbal e no desenvolvimento e manutenção das relações interpessoais</li><li><strong>Padrões restritos e repetitivos:</strong> comportamentos repetitivos e estereotipados, insistência em rotinas ou resistência à mudança, interesses altamente restritos e intensos e alterações no processamento sensorial</li></ul>',
      '<p>A apresentação clínica é muito variável, podendo coexistir diferentes níveis de capacidade intelectual e de linguagem. O termo “espetro” reflete essa variabilidade, desde formas com maior necessidade de suporte até apresentações mais subtis.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/people.png', text: 'Dificuldade nas interações sociais' },
      { color: 'yellow', icon: 'assets/calendar.png', text: 'Necessidade de rotina, previsibilidade ou resistência à mudança' },
      { color: 'blue', icon: 'assets/volume.png', text: 'Sensibilidade aumentada a sons, luzes ou outros estímulos' },
      { color: 'white', icon: 'assets/user.png', text: 'Sensação persistente de não "encaixar" ou de ser diferente' },
      { color: 'yellow', icon: 'assets/chat.png', text: 'Dificuldade em compreender subtilezas da comunicação (ironia, humor, metáforas, linguagem não verbal ou regras implícitas)' },
      { color: 'red', icon: 'assets/story.png', text: 'Comportamentos repetitivos ou interesses restritos e intensos' },
      { color: 'white', icon: 'assets/mindset.png', text: 'Alterações no processamento sensorial' },
      { color: 'blue', icon: 'assets/logout.png', text: 'Dificuldade em adaptar-se a mudanças ou imprevistos' }
    ]
  },
  {
    slug: 'ansiedade',
    href: 'ansiedade.html',
    pageTitle: 'Ansiedade | Clínica Gonçalo Marinho',
    color: 'yellow',
    icon: 'assets/ansiedade.svg',
    name: 'Ansiedade',
    detailImage: 'assets/ansiedade-img.svg',
    title: 'Ansiedade',
    description: [
      '<p>A ansiedade é uma resposta natural do organismo perante situações de perigo, ameaça ou stress.</p>',
      '<p>É adaptativa quando é proporcional ao contexto e de curta duração, ajudando na resposta a possíveis perigos. Torna-se problemática quando é excessiva, persistente ou desproporcional, ocorrendo mesmo na ausência de perigo real e interferindo com o funcionamento diário, incluindo o trabalho, as relações e o bem-estar.</p>',
      '<p>Pode manifestar-se através de sintomas cognitivos, fisiológicos e comportamentais.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/brain.png', text: 'Preocupação excessiva ou pensamentos antecipatórios negativos' },
      { color: 'yellow', icon: 'assets/danger.png', text: 'Sensação constante de nervosismo ou alerta' },
      { color: 'blue', icon: 'assets/story.png', text: 'Pensamentos repetitivos e difíceis de controlar' },
      { color: 'white', icon: 'assets/love.png', text: 'Palpitações, aperto no peito ou falta de ar' },
      { color: 'yellow', icon: 'assets/pain.png', text: 'Tensão muscular' },
      { color: 'red', icon: 'assets/irritated.png', text: 'Irritabilidade ou impaciência' },
      { color: 'white', icon: 'assets/aim.png', text: 'Dificuldade de concentração' },
      { color: 'blue', icon: 'assets/moon.png', text: 'Alterações no sono' }
    ]
  },
  {
    slug: 'depressao',
    href: 'depressao.html',
    pageTitle: 'Depressão | Clínica Gonçalo Marinho',
    color: 'red',
    icon: 'assets/depressao-img.svg',
    name: 'Depressão',
    flip: true,
    detailImage: 'assets/depressao-img.svg',
    title: 'Depressão',
    description: [
      '<p>A depressão é uma perturbação do humor caracterizada por tristeza persistente e/ou perda de interesse ou prazer nas atividades, acompanhada por alterações cognitivas, emocionais e físicas.</p>',
      '<p>Estes sintomas tendem a persistir ao longo do tempo e podem causar um impacto significativo no funcionamento diário, afetando o trabalho, as relações e a qualidade de vida.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/sad.png', text: 'Tristeza persistente ou sensação de vazio' },
      { color: 'yellow', icon: 'assets/low.png', text: 'Falta de energia ou cansaço constante' },
      { color: 'blue', icon: 'assets/down-graphic.png', text: 'Perda de interesse ou prazer nas atividades' },
      { color: 'white', icon: 'assets/moon.png', text: 'Alterações no sono ou no apetite' },
      { color: 'yellow', icon: 'assets/brain.png', text: 'Dificuldade de concentração e falhas de memória' },
      { color: 'red', icon: 'assets/user.png', text: 'Sentimentos de culpa, inutilidade ou desesperança' },
      { color: 'white', icon: 'assets/irritated.png', text: 'Irritabilidade ou isolamento social' },
      { color: 'blue', icon: 'assets/clipboard.png', text: 'Dificuldade em realizar atividades do dia a dia' }
    ]
  },
  {
    slug: 'poc',
    href: 'poc.html',
    pageTitle: 'POC - Perturbação Obsessivo-Compulsiva | Clínica Gonçalo Marinho',
    color: 'yellow',
    icon: 'assets/perturbacao-obsessivo-compulsiva-img.svg',
    name: 'POC',
    flip: true,
    detailImage: 'assets/perturbacao-obsessivo-compulsiva-img.svg',
    title: 'Perturbação Obsessivo-Compulsiva',
    titleLight: 'POC',
    description: [
      '<p>A POC é caracterizada pela presença de obsessões, compulsões ou ambas.</p>',
      '<p>As obsessões são pensamentos, imagens ou impulsos indesejados e repetitivos que provocam ansiedade ou desconforto. As compulsões são comportamentos ou atos mentais repetitivos realizados na tentativa de reduzir essa ansiedade.</p>',
      '<p>Quando os sintomas são intensos ou persistentes, podem afetar significativamente o funcionamento diário e a qualidade de vida.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/confused.png', text: 'Pensamentos intrusivos, indesejados e repetitivos que provocam ansiedade ou desconforto' },
      { color: 'yellow', icon: 'assets/door.png', text: 'Necessidade constante de verificações' },
      { color: 'blue', icon: 'assets/virus.png', text: 'Medo excessivo de contaminação ou sujidade' },
      { color: 'white', icon: 'assets/clean.png', text: 'Lavagens ou limpezas repetidas' },
      { color: 'yellow', icon: 'assets/story.png', text: 'Repetição mental de palavras, números ou frases' },
      { color: 'red', icon: 'assets/doubt.png', text: 'Dúvidas constantes e necessidade de confirmação ou certeza' },
      { color: 'white', icon: 'assets/clock.png', text: 'Rituais que ocupam muito tempo e interferem com o dia a dia' },
      { color: 'blue', icon: 'assets/triangular-ruler.png', text: 'Necessidade intensa de ordem, simetria ou alinhamento' }
    ]
  },
  {
    slug: 'pca',
    href: 'pca.html',
    pageTitle: 'PCA - Perturbações do Comportamento Alimentar | Clínica Gonçalo Marinho',
    color: 'white',
    icon: 'assets/perturbacao-comportamento-alimentar-img.svg',
    name: 'PCA',
    detailImage: 'assets/perturbacao-comportamento-alimentar-img.svg',
    title: 'Perturbações do Comportamento Alimentar',
    titleLight: 'PCA',
    description: [
      '<p>São caracterizadas por alterações persistentes na relação com a alimentação, o peso e a imagem corporal, com impacto significativo na saúde física, emocional e social.</p>',
      '<p>As PCA mais frequentes incluem a Anorexia Nervosa, a Bulimia Nervosa, a Perturbação de Ingestão Alimentar Compulsiva e a Perturbação Alimentar de Evitamento/Restrição. O diagnóstico e a intervenção precoces são fundamentais para promover a recuperação.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/mirror.png', text: 'Preocupação excessiva com o peso ou a imagem corporal' },
      { color: 'yellow', icon: 'assets/salad.png', text: 'Restrição alimentar, dietas muito rígidas ou medo intenso de aumentar de peso' },
      { color: 'blue', icon: 'assets/burger.png', text: 'Episódios de compulsão alimentar' },
      { color: 'red', icon: 'assets/vomit.png', text: 'Comportamentos compensatórios, como vómito autoinduzido, jejum ou exercício físico excessivo' },
      { color: 'yellow', icon: 'assets/balance.png', text: 'Alterações significativas do peso, da alimentação ou do ciclo menstrual' },
      { color: 'red', icon: 'assets/people.png', text: 'Impacto na vida pessoal, social ou profissional relacionado com a alimentação ou a imagem corporal' },
      { color: 'white', icon: 'assets/brain.png', text: 'Pensamentos persistentes sobre comida, peso ou aparência' },
      { color: 'blue', icon: 'assets/logout.png', text: 'Isolamento social, evitação de refeições em grupo ou necessidade de controlar rigorosamente a alimentação' }
    ]
  },
  {
    slug: 'perturbacoes-do-sono',
    href: 'perturbacoes-do-sono.html',
    pageTitle: 'Perturbações do Sono | Clínica Gonçalo Marinho',
    color: 'blue',
    icon: 'assets/sono.svg',
    name: 'Perturbações\ndo Sono',
    detailImage: 'assets/perturbacoes-do-sono-img.svg',
    title: 'Perturbações do Sono',
    description: [
      '<p>As perturbações do sono correspondem a diferentes condições que afetam a qualidade, a duração ou o ritmo do sono.</p>',
      '<p>Quando persistem, estas alterações podem comprometer o funcionamento diário, o desempenho e a qualidade de vida.</p>',
      '<p>Entre as perturbações do sono mais frequentes incluem-se a insónia, a apneia obstrutiva do sono, a síndrome das pernas inquietas, as parassonias, a narcolepsia e as perturbações do ritmo circadiano.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/bed.png', text: 'Dificuldade persistente em adormecer' },
      { color: 'yellow', icon: 'assets/moon.png', text: 'Despertares frequentes durante a noite' },
      { color: 'blue', icon: 'assets/clock.png', text: 'Acordar muito cedo e não conseguir voltar a dormir' },
      { color: 'white', icon: 'assets/sad.png', text: 'Cansaço, irritabilidade ou dificuldade de concentração' },
      { color: 'yellow', icon: 'assets/snore.png', text: 'Roncar frequentemente durante o sono' },
      { color: 'red', icon: 'assets/pill.png', text: 'Necessidade frequente de recorrer a medicação para dormir' },
      { color: 'white', icon: 'assets/sleepy.png', text: 'Sonolência excessiva durante o dia' },
      { color: 'blue', icon: 'assets/cloud.png', text: 'Sensação de sono não reparador' }
    ]
  },
  {
    slug: 'sexologia',
    href: 'sexologia.html',
    pageTitle: 'Sexologia | Clínica Gonçalo Marinho',
    color: 'white',
    icon: 'assets/sexologia.svg',
    name: 'Sexologia',
    detailImage: 'assets/sexologia-img.svg',
    title: 'Sexologia',
    description: [
      '<p>A sexologia clínica aborda dificuldades relacionadas com o desejo, a excitação, o orgasmo, a intimidade e o funcionamento sexual, considerando as diferentes dimensões da experiência individual e relacional.</p>',
      '<p>A sexualidade é uma dimensão importante do bem-estar e pode ser influenciada por fatores físicos, emocionais e relacionais.</p>',
      '<p>Estas dificuldades podem ter impacto na autoestima, na qualidade das relações e na forma como cada pessoa se sente consigo própria e com os outros.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/love-down.png', text: 'Diminuição do desejo sexual' },
      { color: 'yellow', icon: 'assets/flash.png', text: 'Dificuldades na excitação ou no orgasmo' },
      { color: 'blue', icon: 'assets/pain.png', text: 'Dor ou desconforto durante as relações sexuais' },
      { color: 'white', icon: 'assets/confused.png', text: 'Impacto emocional ou relacional associado à sexualidade' },
      { color: 'yellow', icon: 'assets/empathy.png', text: 'Preocupações persistentes relacionadas com a intimidade ou a sexualidade' },
      { color: 'red', icon: 'assets/chat.png', text: 'Dificuldades na intimidade ou na comunicação sexual' },
      { color: 'white', icon: 'assets/low.png', text: 'Baixa autoestima relacionada com a sexualidade' },
      { color: 'blue', icon: 'assets/danger.png', text: 'Experiências traumáticas com impacto na sexualidade' }
    ]
  },
  {
    slug: 'saude-mental',
    href: 'saude-mental.html',
    pageTitle: 'Saúde Mental | Clínica Gonçalo Marinho',
    color: 'blue',
    icon: 'assets/saude-mental-img.svg',
    name: 'Saúde Mental\nda Mulher',
    flip: true,
    detailImage: 'assets/saude-mental-img.svg',
    title: 'Saúde Mental da Mulher',
    description: [
      '<p>A saúde mental da mulher refere-se ao bem-estar emocional, psicológico e social ao longo das diferentes fases da vida.</p>',
      '<p>Este equilíbrio pode ser influenciado por fatores biológicos, como as variações hormonais, mas também por fatores psicológicos e sociais, incluindo as exigências profissionais, a maternidade e as relações interpessoais.</p>',
      '<p>Ao longo da vida, existem períodos em que estas alterações podem tornar-se mais intensas, nomeadamente durante o ciclo menstrual, a gravidez, o pós-parto e a menopausa. Nestas fases, podem surgir alterações do humor, da energia, do sono e da forma como a mulher se sente consigo própria e com os outros.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/sad.png', text: 'Sintomas depressivos persistentes' },
      { color: 'yellow', icon: 'assets/wave.png', text: 'Oscilações intensas do humor' },
      { color: 'blue', icon: 'assets/confused.png', text: 'Ansiedade aumentada ou preocupação constante' },
      { color: 'white', icon: 'assets/pregnant.png', text: 'Dificuldade em adaptar-se à gravidez ou ao pós-parto' },
      { color: 'yellow', icon: 'assets/lotus.png', text: 'Sintomas da menopausa que afetam o bem-estar emocional' },
      { color: 'red', icon: 'assets/irritated.png', text: 'Irritabilidade, tristeza ou alterações persistentes do humor' },
      { color: 'white', icon: 'assets/moon.png', text: 'Alterações do sono ou da alimentação' },
      { color: 'blue', icon: 'assets/logout.png', text: 'Dificuldade em lidar com mudanças ou acontecimentos de vida' }
    ]
  },
  {
    slug: 'burnout',
    href: 'burnout.html',
    pageTitle: 'Burnout | Clínica Gonçalo Marinho',
    color: 'red',
    icon: 'assets/burnout.svg',
    name: 'Burnout',
    flip: true,
    detailImage: 'assets/burnout-img.svg',
    title: 'Burnout',
    description: [
      '<p>O burnout é um estado de exaustão física e emocional relacionado com stress crónico, habitualmente associado ao contexto profissional.</p>',
      '<p>Desenvolve-se de forma gradual quando existe um desequilíbrio persistente entre as exigências do trabalho (carga de trabalho, pressão e responsabilidade) e os recursos disponíveis (energia, tempo, apoio e reconhecimento).</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/low.png', text: 'Cansaço que não desaparece após períodos de descanso' },
      { color: 'yellow', icon: 'assets/user.png', text: 'Sentimentos de negatividade, irritabilidade ou distanciamento em relação às tarefas e colegas' },
      { color: 'blue', icon: 'assets/pain.png', text: 'Dores de cabeça, tensão muscular, alterações digestivas ou alterações no sono e no apetite' },
      { color: 'white', icon: 'assets/brain.png', text: 'Dificuldades na concentração, memória e tomada de decisão' },
      { color: 'yellow', icon: 'assets/slow.png', text: 'Sensação constante de incompetência, falta de produtividade e desmotivação' },
      { color: 'red', icon: 'assets/sad.png', text: 'Sensação persistente de exaustão física e emocional' },
      { color: 'white', icon: 'assets/down-graphic.png', text: 'Perda de motivação e satisfação com o trabalho' },
      { color: 'blue', icon: 'assets/logout.png', text: 'Dificuldade em desligar do trabalho, mesmo fora do horário laboral' }
    ]
  },
  {
    slug: 'pedopsiquiatria',
    href: 'pedopsiquiatria.html',
    pageTitle: 'Pedopsiquiatria | Clínica Gonçalo Marinho',
    color: 'white',
    icon: 'assets/pedopsiquiatria-img.svg',
    name: 'Pedopsiquiatria',
    detailImage: 'assets/pedopsiquiatria-img.svg',
    title: 'Pedopsiquiatria',
    description: [
      '<p>A saúde mental da criança e do adolescente influencia a aprendizagem, as relações interpessoais, a autonomia e a forma como o jovem enfrenta os desafios do crescimento.</p>',
      '<p>Entre os motivos mais frequentes de consulta encontram-se as perturbações de ansiedade, as perturbações do humor, as perturbações do neurodesenvolvimento, as dificuldades emocionais e comportamentais e os problemas de adaptação a diferentes fases do desenvolvimento ou acontecimentos de vida.</p>',
      '<p>A identificação e a intervenção precoces permitem promover um desenvolvimento mais saudável e prevenir dificuldades futuras.</p>'
    ],
    manifest: [
      { color: 'red', icon: 'assets/brain.png', text: 'Ansiedade intensa ou medos excessivos' },
      { color: 'yellow', icon: 'assets/story.png', text: 'Dificuldades de atenção, aprendizagem ou rendimento escolar' },
      { color: 'blue', icon: 'assets/people.png', text: 'Dificuldades nas relações familiares ou com outras crianças e adolescentes' },
      { color: 'white', icon: 'assets/chat.png', text: 'Atrasos no desenvolvimento ou dificuldades na comunicação' },
      { color: 'yellow', icon: 'assets/sad.png', text: 'Alterações significativas do comportamento' },
      { color: 'red', icon: 'assets/irritated.png', text: 'Irritabilidade, tristeza ou alterações do humor persistentes' },
      { color: 'white', icon: 'assets/moon.png', text: 'Alterações do sono ou da alimentação' },
      { color: 'blue', icon: 'assets/logout.png', text: 'Dificuldade em lidar com mudanças ou acontecimentos de vida' }
    ]
  }
];
