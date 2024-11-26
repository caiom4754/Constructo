INTRODUÇÃO
Planejar e construir uma residência é um processo que envolve diversas etapas técnicas, muitas vezes desafiadoras para pessoas sem experiência na área. A criação de plantas baixas e a estimativa de materiais necessários são atividades que demandam precisão e conhecimento específico, o que pode afastar leigos interessados em planejar ou reformar suas casas.
A proposta deste trabalho é o desenvolvimento de um aplicativo web acessível e funcional, cujo objetivo é simplificar o processo de criação de plantas residenciais, possibilitando que usuários sem formação técnica alcancem resultados satisfatórios. A solução integra uma ferramenta inovadora de cálculo de materiais, projetada para estimar de forma detalhada os insumos necessários para a construção, como tijolos, cimento e areia.
A ideia central é remover barreiras técnicas e financeiras que dificultam o planejamento e a execução de obras residenciais. Por meio de uma interface intuitiva, o aplicativo busca facilitar o processo de desenho e dimensionamento de plantas, ao mesmo tempo que oferece suporte no cálculo e previsão de materiais, proporcionando maior clareza sobre os custos e recursos envolvidos.
Este trabalho visa demonstrar a viabilidade e o impacto positivo dessa aplicação, que almeja empoderar indivíduos na organização de seus projetos residenciais, promovendo economia, eficiência e acessibilidade em construções e reformas.
________________________________________

Resumo
Este projeto apresenta o desenvolvimento de um aplicativo web inovador, voltado para o público leigo, com o objetivo de simplificar a criação de plantas residenciais e democratizar o planejamento de construções. O principal diferencial da ferramenta está em sua calculadora de materiais, que permite a estimativa precisa de insumos como tijolos, cimento, areia, entre outros, essenciais para a construção civil. Com uma interface intuitiva e de fácil navegação, o aplicativo foi projetado para capacitar usuários sem conhecimento técnico a criar projetos funcionais e bem fundamentados. Essa solução busca remover barreiras técnicas, tornando o processo de planejamento residencial mais acessível e eficiente, ao mesmo tempo que empodera o usuário com maior controle sobre seu projeto e orçamento.

________________________________________
 
DESENVOLVIMENTO
1.	Visão geral:
Planejar e executar uma construção residencial é um empreendimento desafiador, tanto para leigos quanto para profissionais da construção civil. Uma das principais dificuldades encontradas nesse processo é realizar uma estimativa precisa dos custos com materiais. Muitas vezes, os orçamentos iniciais não conseguem prever adequadamente imprevistos e variações de preços, o que pode resultar em despesas adicionais e dificuldades financeiras inesperadas.

Para pessoas sem experiência técnica, a falta de conhecimento sobre as etapas e requisitos específicos da obra torna o cálculo da quantidade de materiais e a previsão dos custos ainda mais complexos. Já para os profissionais, mesmo com o conhecimento técnico, surgem desafios como o controle do desperdício de material, a adaptação a alterações no projeto e a gestão das oscilações nos preços dos insumos, que podem ser influenciadas por fatores econômicos, sazonais e regionais.

Esse contexto demonstra a importância de uma abordagem cuidadosa e detalhada, que envolva planejamento estratégico e monitoramento constante dos custos, para que a execução do projeto seja viável e sustentável do ponto de vista financeiro.

Nossa aplicação web foi desenvolvida para enfrentar esses desafios, oferecendo uma plataforma prática e intuitiva para a criação de plantas baixas e a estimativa de materiais de construção. Através de uma interface simples, o usuário pode projetar o espaço desejado e, em seguida, utilizar nossa calculadora de materiais para obter uma previsão dos itens necessários e seus custos estimados.

Apesar de nos esforçarmos para fornecer estimativas precisas, é importante destacar que essas previsões se baseiam em médias de consumo e custos de materiais. Cada projeto possui características e necessidades específicas, que podem resultar em variações nos custos finais. Por isso, nossa aplicação oferece uma base sólida para o planejamento financeiro e de recursos, mas recomendamos que os usuários também consultem profissionais locais para um levantamento mais detalhado e preciso dos custos envolvidos.

Em síntese, nosso objetivo é proporcionar uma ferramenta confiável e acessível para o planejamento de obras, ajudando a minimizar riscos e a otimizar a gestão dos recursos. Ao combinar o uso de nossa plataforma com orientações de profissionais, os usuários podem realizar um planejamento mais completo, reduzindo a incerteza e melhorando a execução de seus projetos.

2.	Arquitetura do Sistema:
O sistema é projetado para permitir o desenvolvimento e armazenamento de plantas residenciais, integrando funcionalidades como login e armazenamento de projetos personalizados. Para isso, a arquitetura será composta por um servidor que gerenciará autenticação de usuários e persistência de dados, garantindo que projetos (incluindo desenhos salvos como coordenadas de traços e seus respectivos nomes) sejam armazenados de maneira segura e acessível.
Atualmente, o sistema está em desenvolvimento utilizando as seguintes tecnologias:
•	JavaScript: Linguagem principal para implementar a lógica do sistema, incluindo funcionalidades de desenho e cálculo.
•	HTML e CSS: Estruturam e estilizam as interfaces, garantindo uma experiência visual amigável ao usuário.
•	Bootstrap: Facilita o design responsivo e consistente, otimizando a usabilidade em diferentes dispositivos.

3.	Design da Interface:
O sistema foi desenvolvido com um foco especial em acessibilidade e facilidade de uso, permitindo que até mesmo usuários sem experiência técnica possam criar plantas residenciais de forma intuitiva.
•	Paleta de Cores
A interface do sistema utiliza como cores principais o preto e o laranja, que foram escolhidas para criar um contraste marcante e funcional.
Preto: Representa robustez, estabilidade e sofisticação, alinhando-se ao tema de materiais de construção, que requerem precisão e resistência.
Laranja: Evoca energia, dinamismo e criatividade, simbolizando o processo de criação e reforma de residências.
•	Elementos Interativos
Botões e Caixas de Entrada: Os botões são estilizados para serem intuitivos, com texto legível e ícones que indicam claramente sua função. As caixas de entrada possuem design limpo, permitindo ao usuário inserir informações de forma clara e direta.
Feedback Visual (Hover): Os elementos interativos apresentam alterações visuais (como mudanças de cor ou sombreamento) ao passar o cursor ou ao serem clicados, fornecendo uma resposta imediata às ações do usuário.
Canvas: A área de desenho (Canvas) é o principal elemento interativo, onde o usuário pode criar a planta da residência. Devido à natureza precisa do desenho, o Canvas foi projetado para ser otimizado para telas maiores.

•	Experiência do Usuário (UX)
Foco na Intuição: A interface é projetada para simplificar o processo, permitindo que o usuário informe diretamente as dimensões de portas e janelas (altura e largura) e a quantidade desejada. O sistema permite adicionar múltiplas portas e janelas de tamanhos variados, refletindo a diversidade real dos projetos residenciais. Essas informações são automaticamente utilizadas para subtrair a área total das aberturas da área total do desenho
•	Ferramentas Utilizadas
Figma: A ferramenta foi empregada para a criação dos mockups e wireframes, garantindo um planejamento visual eficiente antes da implementação.

4.	Implementação:
O frontend do sistema foi projetado com foco na experiência do usuário, garantindo que a interface seja intuitiva. Ele desempenha o papel de interação direta com o usuário, permitindo o desenvolvimento de plantas residenciais e a inserção de informações de maneira fluida.
•	Estrutura
HTML: Estrutura básica da interface, organizando os elementos de forma hierárquica e semântica, facilitando a navegação e a compreensão do conteúdo.
CSS: Responsável pela estilização, utilizando a paleta de cores preto e laranja para destacar elementos importantes e criar um visual coerente e atrativo.
Bootstrap: Incorporado para acelerar o desenvolvimento de componentes responsivos e garantir um layout adaptável a diferentes tamanhos de tela. Contudo, vale destacar que o sistema não é projetado para telas pequenas de dispositivos móveis. Devido à complexidade do desenho e à precisão necessária para a criação da planta, a usabilidade em dispositivos como celulares pode ser comprometida, sendo mais eficiente em desktops e tablets.
•	Componentes Interativos
Canvas: Área central para a criação de desenhos, onde os usuários podem traçar linhas, retângulos e definir áreas. Esse componente é gerenciado por JavaScript, permitindo precisão e flexibilidade na construção da planta.
Formulários: Incluem campos de entrada para que os usuários possam especificar dimensões de portas e janelas, adicionando facilmente múltiplos tamanhos e quantidades conforme necessário.
Botões: Proporcionam ações como “Desfazer”, “Salvar” e “Carregar”, oferecendo controle total sobre o projeto.
Feedback Visual: Melhorado por meio de efeitos de hover e alterações dinâmicas nos elementos, ajudando o usuário a identificar estados ativos e inativos.
•	Funcionalidades Específicas
Validação de Entrada: As entradas de dados, como dimensões e quantidades, são verificadas para evitar inconsistências.
Customização em Tempo Real: Uma das principais características do frontend é a capacidade de customização em tempo real, que melhora a experiência do usuário ao proporcionar feedback imediato em cada etapa do processo.
Atualização Dinâmica do Desenho: À medida que o usuário realiza alterações no canvas, como adicionar ou modificar formas, o sistema reflete instantaneamente as mudanças sem necessidade de recarregar ou salvar.
Cálculo Automático de Materiais: Informações como a inclusão de portas e janelas têm impacto direto nos cálculos de materiais. Ao inserir as dimensões e quantidades, a área total das aberturas é automaticamente subtraída da área total do projeto, atualizando os cálculos em tempo real.
Ajustes Visuais Imediatos: Qualquer alteração feita no estilo ou na estrutura do desenho é exibida imediatamente, permitindo ao usuário visualizar os resultados de suas decisões instantaneamente.
5.	Desafios e Soluções
Um dos principais desafios encontrados durante o desenvolvimento do sistema foi a necessidade de criar várias funcionalidades do zero, sem contar com bibliotecas ou frameworks que pudessem facilitar a implementação dessas funções específicas. Muitas das funções precisavam ser criadas de forma incremental e personalizada, o que exigiu uma abordagem cuidadosa para garantir que o sistema fosse funcional e eficiente.
A solução para esse desafio foi desmembrar a lógica do sistema em pequenos pedaços, desenvolvendo cada funcionalidade de forma modular. Por exemplo, o primeiro passo foi a criação do canvas, que seria a base para o desenho das plantas. Após isso, foi implementada a função de desenhar, permitindo que o usuário começasse a criar as linhas e formas na interface.
Logo em seguida, foi criada a funcionalidade de redesenhar a última linha traçada, para que o usuário pudesse visualizar o último traço feito, proporcionando uma experiência mais dinâmica e fluida.
O próximo passo foi definir uma unidade de medida no sistema, estabelecendo que 40 pixels seria equivalente a 1 metro, o que tornou mais fácil calcular as dimensões reais da planta a partir da área de desenho. Com essa base definida, implementamos o teorema de Pitágoras para poder calcular linhas diagonais e retornar o valor real em metros lineares, garantindo que as distâncias entre pontos do desenho fossem precisas.
Após definir essas fundações, a próxima etapa foi realizar os cálculos dos materiais necessários com base nas medidas e nas dimensões dos elementos desenhados, como as paredes e aberturas. A subtração da área de portas e janelas da área total da parede foi uma parte essencial do processo, pois permitiu calcular com precisão a quantidade de materiais necessários para a construção, como blocos, cimento e areia.
Essa abordagem modular, passo a passo, foi fundamental para superar as dificuldades iniciais e garantir que cada funcionalidade fosse construída de maneira robusta, com cada parte complementando e apoiando a próxima.
________________________________________
Considerações Finais
O desenvolvimento deste sistema para o planejamento e armazenamento de plantas residenciais foi uma jornada desafiadora, mas altamente enriquecedora. Ao longo do processo, aprendemos a importância de uma abordagem modular no desenvolvimento de funcionalidades, o que permitiu criar soluções personalizadas para atender às necessidades específicas do projeto. A ausência de bibliotecas prontas nos obrigou a construir muitas das funções do zero, o que, embora desafiador, foi uma oportunidade valiosa de aprofundar nossos conhecimentos e habilidades técnicas.
A escolha de JavaScript como linguagem principal permitiu a criação de um sistema interativo, dinâmico e capaz de oferecer uma experiência fluida para o usuário, com destaque para a customização em tempo real no desenho das plantas e o cálculo automático de materiais. A combinação com HTML, CSS e Bootstrap proporcionou uma interface simples e intuitiva, alinhada à proposta de facilitar o uso por parte de usuários sem experiência prévia em ferramentas de design.
Apesar da limitação de responsividade, que impede a adaptação plena do sistema para dispositivos móveis, a aplicação foi otimizada para funcionar de forma eficiente em desktops e tablets, onde a precisão na criação dos desenhos é crucial.
Outro ponto relevante foi o foco na experiência do usuário, com a criação de uma interface que prioriza a intuição e o feedback visual imediato, garantindo que o usuário tenha controle total sobre o processo, desde a inserção das dimensões das portas e janelas até a atualização dos cálculos de materiais.
Em termos de desafios, a complexidade de realizar cálculos precisos de materiais e integrar as diversas funcionalidades do sistema, como o desenho, o cálculo da área e a atualização dinâmica dos materiais, exigiu uma atenção especial à implementação de cada pequena parte do processo. No entanto, a solução encontrada — desenvolver o sistema de maneira incremental e modular — foi eficaz e garantiu um progresso constante e controlado.
Em resumo, o projeto foi bem-sucedido em atender aos objetivos propostos, criando um sistema funcional e intuitivo para o desenvolvimento de plantas residenciais. As lições aprendidas ao longo do processo certamente contribuirão para a evolução de projetos futuros e para o aprimoramento contínuo das nossas habilidades em desenvolvimento de software.
________________________________________
REFERÊNCIAS
CHING, Francis. Arquitetura: forma, espaço e ordem. 1979. 447 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, New York, 2025.
NORMAN, Donald A.. O design do dia a dia. 2006. 272 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, São Paulo, 2025.
GUEDES, Gilleanes T.A.. UML2.: uma abordagem prática. 2011. 488 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, São Paulo, 2025.
SILVA, Maurício Samy. Fundamentos de HTML5 e CSS3. 2015. 304 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, São Paulo, 2025.
CLAISSE, Peter A.. Materiais de construção civil. 2015. 528 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, Oxford, 2025.
STEFANOV, Stoyan. Padrões Javascript. 2010. 240 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, São Paulo, 2025.
FLANAGAN, David. Javascript: o guia definitivo. 2012. 1080 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, Porto Alegre, 2025.
DUCKETT, Jon. PHP & MySql: desenvolvimento web no lado do servidor. 2024. 672 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, São Paulo, 2025.
SKLAR, David. Aprendendo PHP: Introdução Amigável à Linguagem Mais Popular da web. 2016. 413 f. TCC (Graduação) - Curso de Sistemas Para Internet, Fatec, São Paulo, 2025.
________________________________________

