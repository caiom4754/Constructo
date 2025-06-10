const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let stack = [];
let tamanhoPadrao = 40;
$(document).ready(function () {
    $('[data-toggle="tooltip"]').tooltip();
});

function desenharPadrao() {
    const linhas = Math.ceil(canvas.height / tamanhoPadrao);
    const colunas = Math.ceil(canvas.width / tamanhoPadrao);
    context.fillStyle = '#ccc';
    for (let linha = 0; linha < linhas; linha++) {
        for (let coluna = 0; coluna < colunas; coluna++) {
            if ((linha + coluna) % 2 === 0) {
                context.fillRect(coluna * tamanhoPadrao, linha * tamanhoPadrao, tamanhoPadrao, tamanhoPadrao);
            }
        }
    }
}

desenharPadrao()

function snapGrid(coord) {
    return Math.round(coord / (tamanhoPadrao / 2)) * (tamanhoPadrao / 2);
}

function obterCoordenadasMouse(e) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: snapGrid(e.clientX - rect.left),
        y: snapGrid(e.clientY - rect.top)
    };
}

function comecarDesenho(e) {
    isDrawing = true;
    const pos = obterCoordenadasMouse(e);
    startX = pos.x;
    startY = pos.y;
}

function desenhar(e) {
    if (!isDrawing) return;
    const pos = obterCoordenadasMouse(e);
    endX = pos.x;
    endY = pos.y;
    redesenhar();
}

function pararDesenho(e) {
    if (!isDrawing) return;
    isDrawing = false;
    const pos = obterCoordenadasMouse(e);
    endX = pos.x;
    endY = pos.y;
    stack.push({ startX, startY, endX, endY });
    redesenhar();
}

function redesenhar() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    desenharPadrao();
    for (let i = 0; i < stack.length; i++) {
        const { startX, startY, endX, endY } = stack[i];
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = 'blue';
        context.lineWidth = 5;
        context.stroke();
    }
    if (isDrawing) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = 'blue';
        context.lineWidth = 5;
        context.stroke();
    }
}

function dividirLinhaEmSegmentos(startX, startY, endX, endY) {
    const segmentos = [];
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY)) / (tamanhoPadrao / 2);

    for (let i = 0; i <= steps; i++) {
        const x = startX + (deltaX / steps) * i;
        const y = startY + (deltaY / steps) * i;
        segmentos.push({ x, y });
    }

    return segmentos;
}

canvas.addEventListener('mousedown', comecarDesenho);
canvas.addEventListener('mousemove', desenhar);
canvas.addEventListener('mouseup', pararDesenho);
canvas.addEventListener('mouseleave', () => isDrawing = false);

// função para verificar sobreposição de segmentos
function verificarSobreposicao(startX, startY, endX, endY) {
    /* a função 'verificarSobreposicao' analisa se uma nova linha desenhada 
    sobrepõe alguma linha já existente no canvas. ela começa dividindo a nova 
    linha em segmentos e para cada linha já desenhada, ela também divide 
    em segmentos
    depois, compara os segmentos da nova linha com os segmentos 
    das linhas existentes, contando quantas vezes os pontos se cruzam 
    se mais de um ponto de interseção for encontrado, isso significa que a 
    nova linha sobrepõe a linha existente, e a função retorna 'true' 
    caso contrário, se não houver interseções significativas, ela retorna 'false'*/
    const novaLinhaSegmentos = dividirLinhaEmSegmentos(startX, startY, endX, endY);

    for (let i = 0; i < stack.length; i++) {
        const { startX: sX, startY: sY, endX: eX, endY: eY } = stack[i];
        const linhaExistenteSegmentos = dividirLinhaEmSegmentos(sX, sY, eX, eY);

        let intersecoes = 0;  // para contar quantos segmentos tocam

        // comparando cada segmento
        for (let novoSegmento of novaLinhaSegmentos) {
            for (let segmentoExistente of linhaExistenteSegmentos) {
                if (novoSegmento.x === segmentoExistente.x && novoSegmento.y === segmentoExistente.y) {
                    intersecoes++;
                }
            }
        }

        // se todos os segmentos tocarem, é sobreposição 
        //Permite conexão em apenas um ponto
        if (intersecoes > 1) {
            return true;  // tem sobreposição total ou parcial
        }
    }

    return false;  // não tem sobreposição relevante
}

// tem que fazer até função pra parar de desenhar 
function pararDesenho() {
    /* a função é treta, é chamada quando o usuário finaliza o desenho 
    de uma linha
    primeiro, ela checa se o desenho está ativo, se não estiver, 
    a função simplesmente retorna 
    se estiver ativo, o estado de 'isDrawing' 
    é definido como falso para parar o desenho
    depois, a função verifica se a linha desenhada tem comprimento, 
    ou seja, se as coordenadas de início 
    e fim são iguais. se forem, a função retorna sem salvar a linha, 
    pois isso significa que não há linha válida a ser adicionada 
    após isso, a função chama 'verificarSobreposicao' para checar se a nova 
    linha desenhada se sobrepõe a qualquer linha existente
    se houver sobreposição, um alerta é exibido informando o usuário, e a função 
    'redesenhar' é chamada para limpar a linha atual e atualizar o canvas 
    sem a linha inválida 
    por fim, se não houver sobreposição, a linha é 
    adicionada ao 'stack' e o canvas é redesenhado para mostrar todas as 
    linhas, incluindo a nova.
     */
    if (!isDrawing) return;
    isDrawing = false;

    // verifica se a linha desenhada é válida
    if (startX === endX && startY === endY) {
        return; // linha sem comprimento, não salva
    }

    // chama a função para verificar sobreposição
    const sobreposicao = verificarSobreposicao(startX, startY, endX, endY);

    if (sobreposicao) {
        Swal.fire({
            title: 'Atenção',
            text: 'A linha desenhada se sobrepõe a outra linha existente.',
            icon: 'warning'
        })

        // limpa a linha atual e redesenha todas as outras
        redesenhar();  // redesenha o estado atual do canvas sem a linha inválida

        return;  // não adiciona a linha sobreposta ao stack
    }

    // adiciona a linha ao stack se não houver sobreposição
    stack.push({ startX, startY, endX, endY });
    redesenhar(); // redesenha as linhas no canvas
}

function DimensaoPortasJanelas() {
    /* a função 'DimensaoPortasJanelas' cria campos para que o 
    usuário possa inserir as dimensões e a quantidade de portas e janelas 
    primeiro, ela busca o container onde os campos serão adicionados
    depois, um novo grupo de campos é criado para inserir os valores 
    de largura, altura e quantidade
    cada campo de entrada é configurado como um número, 
    com espaços reservados apropriados para guiar o usuário 
    na entrada dos dados 
    também é criado um botão de remover, que permite ao usuário excluir o grupo de campos, se necessário. 
    por fim, todos os campos são anexados ao container, tornando-os 
    visíveis na interface do usuário.*/
    const container = document.getElementById("dimensions-container");

    const fieldGroup = document.createElement("div");
    fieldGroup.classList.add("field-group");

    const larguraInput = document.createElement("input");
    larguraInput.type = "number";
    larguraInput.placeholder = "Largura (m)";
    larguraInput.name = "largura[]";
    larguraInput.min = "0";
    larguraInput.required = true;

    const alturaInput = document.createElement("input");
    alturaInput.type = "number";
    alturaInput.placeholder = "Altura (m)";
    alturaInput.name = "altura[]";
    alturaInput.min = "0";
    alturaInput.required = true;

    const quantidadeInput = document.createElement("input");
    quantidadeInput.type = "number";
    quantidadeInput.placeholder = "Quantidade";
    quantidadeInput.name = "quantidade[]";
    quantidadeInput.min = "0";
    quantidadeInput.required = true;

    const removeButton = document.createElement("button");
    removeButton.innerText = "X";
    removeButton.type = "button";
    removeButton.onclick = () => container.removeChild(fieldGroup);

    fieldGroup.appendChild(larguraInput);
    fieldGroup.appendChild(alturaInput);
    fieldGroup.appendChild(quantidadeInput);
    fieldGroup.appendChild(removeButton);

    container.appendChild(fieldGroup);
}

// função para calcular a área da parede
function calcularComprimentoParede() {
    /*a função 'calcularComprimentoParede' é responsável por calcular 
    o comprimento total das paredes desenhadas no canvas 
    ela começa definindo o tamanho do quadrado, que é a base para 
    as conversões de pixels para metros 
    em seguida, inicializa uma variável para somar os comprimentos das linhas 
    a função percorre todas as linhas armazenadas na 'stack', 
    utilizando o teorema de pitágoras para calcular a distância 
    entre os pontos de início e fim de cada linha desenhada 
    a distância calculada é convertida de pixels para metros, 
    dividindo pelo tamanho do quadrado 
    finalmente, todos os comprimentos são somados e o resultado total é retornado 
    em metros, representando o comprimento total das paredes
     */
    const tamanhoQuadrado = tamanhoPadrao;
    let linear = 0;
    for (let i = 0; i < stack.length; i++) {
        const { startX, startY, endX, endY } = stack[i];

        // meu deusn não acredito quqe to tendo que usar teorema de pitagoras pra calcular pixel 
        const comprimento = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / tamanhoQuadrado;

        linear += comprimento; // somando o comprimento da linha convertida para metros
    }
    return linear;
}

//função para calcular a área das portas e janelas e subtrair
function calcularAreaAberturas() {
    /*essa função calcula a área total das aberturas, como portas e janelas,
    com base nas dimensões e quantidades fornecidas pelo usuário
    ela coleta os valores de largura, altura e quantidade de cada abertura
    e soma suas áreas para obter o total*/

    const larguraInputs = document.getElementsByName("largura[]"); // obtém todos os inputs de largura
    const alturaInputs = document.getElementsByName("altura[]"); // obtém todos os inputs de altura
    const quantidadeInputs = document.getElementsByName("quantidade[]"); // obtém todos os inputs de quantidade

    let areaTotalAberturas = 0; // inicializa a área total das aberturas

    for (let i = 0; i < larguraInputs.length; i++) { // percorre todos os inputs de largura
        const largura = parseFloat(larguraInputs[i].value); // converte o valor de largura para número
        const altura = parseFloat(alturaInputs[i].value); // converte o valor de altura para número
        const quantidade = parseInt(quantidadeInputs[i].value); // converte o valor de quantidade para número inteiro

        // verifica se os valores não são NaN antes de calcular a área
        if (!isNaN(largura) && !isNaN(altura) && !isNaN(quantidade)) {
            areaTotalAberturas += largura * altura * quantidade; // calcula a área e adiciona ao total
        }
    }

    return areaTotalAberturas; // retorna a área total das aberturas
}

// Função para calcular o número de blocos
function calcularNumeroBlocos(alturaParede) {
    /* a função calcula quantos blocos são necessários para a construção de uma parede,
    considerando a altura da parede, o tipo de bloco selecionado e a área das aberturas 
    (como portas e janelas) 
    ela obtém as dimensões do bloco de acordo com a seleção 
    do usuário, calcula a área total das aberturas, a área efetiva da parede e, 
    em seguida, determina quantos blocos são necessários
    se a área da parede for menor ou igual a zero, 
    um alerta é exibido e a função retorna zero para os materiais*/
    const tipoBloco = document.getElementById('tipoBloco').value;
    let dimensoesBloco;

    switch (tipoBloco) {
        case 'concreto34x19x14':
            dimensoesBloco = { comprimento: 0.34, altura: 0.19, largura: 0.14 };
            break;
        case 'ceramico19x19x09':
            dimensoesBloco = { comprimento: 0.19, altura: 0.19, largura: 0.09 };
            break;
        case 'ecologico25x12.5x6.25':
            dimensoesBloco = { comprimento: 0.25, altura: 0.125, largura: 0.0625 };
            break;
        default:
            Swal.fire({
                title: 'Erro',
                text: 'Tipo de bloco não encontrado',
                icon: 'error',
            })
            return;
    }

    const areaTotalAberturas = calcularAreaAberturas();
    const areaParede = (calcularComprimentoParede() * alturaParede) - areaTotalAberturas;
    const areaBloco = dimensoesBloco.comprimento * dimensoesBloco.altura;
    const numeroBlocos = Math.ceil(areaParede / areaBloco);

    if (areaParede <= 0) {
        Swal.fire({
            title: 'Erro',
            text: 'Área da parede inválida',
            icon: 'error',
        })
        return { cimento: 0, areia: 0, agua: 0 };
    }

    return numeroBlocos;
}

// Função para calcular materiais
function calcularMateriais(alturaParede) {
    /* a função calcula a quantidade necessária de materiais (cimento, areia e água) 
    para construir uma parede com base na altura e na área da parede. ela considera 
    a proporção padrão de 1:4:0.5 para cimento, areia e água
     primeiro, obtém o tipo de bloco selecionado e chama a função calcularNumeroBlocos para determinar 
    quantos blocos serão necessários 
    dependendo do tipo de bloco, ela define quantos blocos podem ser 
    feitos com um saco de cimento e a quantidade de areia necessária por bloco 
    em seguida, calcula o número de sacos de cimento, a quantidade total de 
    areia e a quantidade de água em litros, e retorna esses valores formatados
    se o cálculo de blocos falhar, retorna zero para todos os materiais*/

    if (isNaN(alturaParede) || alturaParede <= 0) {
        return { erro: 'Altura da parede inválida (NBR 12118: deve ser > 0)' };
    }

    const tipoBloco = document.getElementById('tipoBloco').value;
    const numBlocos = calcularNumeroBlocos(alturaParede);
    
    if (!numBlocos || numBlocos <= 0) {
        return { erro: 'Cálculo de blocos inválido' };
    }

     // Parâmetros por tipo de bloco (NBR 15270 para cerâmico)
    const PARAMETROS = {
        'concreto34x19x14': {
            consumoArgamassa: 0.0012, // 1.2L/bloco (junta de 10mm)
            traco: { cimento: 1, areia: 4 },
            relacaoAC: 0.5 // 0.5L/kg de cimento
        },
        'ceramico19x19x09': {
            consumoArgamassa: 0.0015, // 1.5L/bloco (junta de 12mm - NBR 15270)
            traco: { cimento: 1, areia: 5 }, // Traço 1:5 (argamassa mais magra)
            relacaoAC: 0.8 // 0.8L/kg (bloco cerâmico absorve mais água)
        },
        'ecologico25x12.5x6.25': {
            consumoArgamassa: 0.0009, // 0.9L/bloco (junta de 8mm)
            traco: { cimento: 1, areia: 4 },
            relacaoAC: 0.6 // 0.6L/kg
        }
    };

    const params = PARAMETROS[tipoBloco];
    const volumeArgamassa = numBlocos * params.consumoArgamassa;
    const volumeCimento = volumeArgamassa / (params.traco.cimento + params.traco.areia);

    // Resultados com margem de 10%
    return {
        cimento: (volumeCimento / 0.0357 * 1.1).toFixed(1) , // Sacos de 50kg
        areia: (volumeArgamassa * (params.traco.areia / (params.traco.cimento + params.traco.areia)) * 1.1).toFixed(3),
        agua: (volumeCimento * 1400 * params.relacaoAC * 1.1).toFixed(1)
    };
}

// função para exibir o número de blocos e materiais
function exibirResultados(numeroBlocos, materiais) {
    const materiaisElement = document.getElementById('resultadosMateriais');
    materiaisElement.innerHTML = `
        Materiais necessários:
        <ul>
            <li>Blocos:     ${numeroBlocos} </li>
            <li>Cimento:    ${materiais.cimento} sacos (50kg)</li>
            <li>Areia:  ${materiais.areia} m³</li>
            <li>Água:   ${materiais.agua} litros</li>
        </ul>
    `;
}

const botaoDesfazer = document.getElementById('undoButton');
botaoDesfazer.addEventListener('click', function () {
    if (stack.length < 1) return;
    stack.pop(); //como dentro do stack funciona como uma pilha, pra fazer o desfazer basta chamar um pop removendo o ultimo item adicionado
    redesenhar();
});

function refazer() {
    if (redoStack.length > 0) {
        const linhaRefazer = redoStack.pop();
        stack.push(linhaRefazer); // Move a linha de volta para a pilha principal
        redesenhar(); // Redesenha o canvas com a linha restaurada
    } else {
        Swal.fire({
            title: 'Não há linhas para refazer',
            icon: 'info',

        });
    }
}

//fazendo algumas validaçoes antes de calcular
const botaoCalcular = document.getElementById('calcularButton');

botaoCalcular.addEventListener('click', function () {
    /*ao clicar, verifica se há pelo menos uma linha desenhada (representada pela 
    pilha 'stack') 
    se não houver, exibe um alerta solicitando que o usuário desenhe a parede primeiro 
    em seguida, tenta obter a altura da parede a partir do campo de entrada correspondente 
    se a altura não for um número válido ou 
    for menor ou igual a zero, um alerta é exibido solicitando uma altura válida 
    se a altura estiver correta, chama a função calcularNumeroBlocos para 
    determinar quantos blocos são necessários e a função calcularMateriais para 
    obter a quantidade de materiais necessários 
    por fim, exibe os resultados usando 
    a função exibirResultados, que apresenta o número de blocos e a quantidade de 
    materiais calculados*/

    if (stack.length < 1) {
        // Verifica se SweetAlert2 está disponível
        if (typeof Swal !== 'undefined' && Swal.fire) {
            Swal.fire({
                title: 'Atenção',
                text: 'Desenhe a parede antes de calcular',
                icon: 'warning',
            });
        } else {
            // Fallback para alerta padrão + console.log
            alert('Desenhe a parede antes de calcular');

            // Adiciona visualização do erro no DOM para debug
            const errorBox = document.createElement('div');
            errorBox.style = 'position: fixed; top: 10px; left: 10px; background: red; color: white; padding: 10px; z-index: 10000';
            errorBox.textContent = 'Erro: Desenhe paredes primeiro';
            document.body.appendChild(errorBox);

            // Remove após 5 segundos
            setTimeout(() => errorBox.remove(), 5000);
        }
        return;
    }
    const alturaParede = parseFloat(document.getElementById('alturaParede').value);
    if (isNaN(alturaParede) || alturaParede <= 0) {
        // Verifica se SweetAlert2 está disponível
        if (typeof Swal !== 'undefined' && Swal.fire) {
            Swal.fire({
                title: 'Atenção',
                text: 'Insira um valor para a altura da parede',
                icon: 'warning',
            });
        } else {
            // Fallback para alerta padrão + console.log
            alert('Insira uma altura para a altura da parede');

            // Adiciona visualização do erro no DOM para debug
            const errorBox = document.createElement('div');
            errorBox.style = 'position: fixed; top: 10px; left: 10px; background: red; color: white; padding: 10px; z-index: 10000';
            errorBox.textContent = 'Erro: Insira um valor para a parede primeiro';
            document.body.appendChild(errorBox);

            // Remove após 5 segundos
            setTimeout(() => errorBox.remove(), 5000);
        }
        return;
    }
    const numeroBlocos = calcularNumeroBlocos(alturaParede);
    const materiais = calcularMateriais(alturaParede, numeroBlocos);
    exibirResultados(numeroBlocos, materiais);
});

// adicionar eventos de mouse para desenhar
canvas.addEventListener('mousedown', comecarDesenho);
canvas.addEventListener('mousemove', desenhar);
canvas.addEventListener('mouseup', pararDesenho);
canvas.addEventListener('mouseout', pararDesenho);

// Função para normaizar o nome do projeto
function limparNomeProjeto(nome) {
    //remove os acentos
    const nomeSemAcentos = nome.normalize('NFD').replace(/[\u0300-\u036f]/g, "");

    //substitui espaços por - 
    const nomeSemEspacos = nomeSemAcentos.replace(/\s+/g, '-');

    //remove os caracteres especiais 
    const nomeLimpo = nomeSemEspacos.replace(/[^a-zA-Z0-9-]/g, '');

    //converte tudo para letra minuscula
    return nomeLimpo.toLowerCase();
}

// Função para salvar o projeto em um arquivo JSON
function baixarProjeto() {
    const alturaParede = document.getElementById('alturaParede').value;
    const tipoBloco = document.getElementById('tipoBloco').value;
    const nomeProjetoInput = document.getElementById('nomeProjeto').value;
    const nomeArquivo = limparNomeProjeto(nomeProjetoInput);

    // coletar dados das portas e janelas
    const portasJanelas = [];
    const campos = document.querySelectorAll("#dimensions-container .field-group");
    campos.forEach(campo => {
        const largura = campo.querySelector("input[name='largura[]']").value;
        const altura = campo.querySelector("input[name='altura[]']").value;
        const quantidade = campo.querySelector("input[name='quantidade[]']").value;

        portasJanelas.push({ largura, altura, quantidade });
    });

    if (alturaParede == 0 || alturaParede == null) {
        Swal.fire({
            title: 'Erro',
            text: 'A altura da parede não pode ser 0 ou nula',
            icon: 'error',
        })
        return;
    }
    if (stack.length == 0 || stack.length == null) {
        Swal.fire({
            title: 'Erro',
            text: 'É necessário desenhar o projeto para salva-lo',
            icon: 'error',
        })
        return;
    }

    // adiciona ao objeto do projeto
    const dados = {
        alturaParede: alturaParede,
        tipoBloco: tipoBloco,
        stack: stack, // salva as coordenadas do desenho
        portasJanelas: portasJanelas // salva portas e janelas
    };

    const blob = new Blob([JSON.stringify(dados)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = nomeArquivo + '.json';
    link.click();
}

// função para carregar o projeto com JSON
function carregarProjetoDoArquivo(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const projeto = JSON.parse(e.target.result);

        // atualiza os campos de altura e tipo de bloco
        document.getElementById('alturaParede').value = projeto.alturaParede;
        document.getElementById('tipoBloco').value = projeto.tipoBloco;

        // recarrega as coordenadas do desenho
        stack = projeto.stack;
        redesenhar();

        // recarrega as portas e janelas
        const container = document.getElementById("dimensions-container");
        container.innerHTML = ""; // limpa os campos existentes
        if (projeto.portasJanelas) {
            projeto.portasJanelas.forEach(item => {
                const fieldGroup = document.createElement("div");
                fieldGroup.classList.add("field-group");

                const larguraInput = document.createElement("input");
                larguraInput.type = "number";
                larguraInput.placeholder = "Largura (m)";
                larguraInput.name = "largura[]";
                larguraInput.value = item.largura;
                larguraInput.required = true;

                const alturaInput = document.createElement("input");
                alturaInput.type = "number";
                alturaInput.placeholder = "Altura (m)";
                alturaInput.name = "altura[]";
                alturaInput.value = item.altura;
                alturaInput.required = true;

                const quantidadeInput = document.createElement("input");
                quantidadeInput.type = "number";
                quantidadeInput.placeholder = "Quantidade";
                quantidadeInput.name = "quantidade[]";
                quantidadeInput.value = item.quantidade;
                quantidadeInput.required = true;

                // botão de remover
                const removeButton = document.createElement("button");
                removeButton.innerText = "X";
                removeButton.type = "button";
                removeButton.onclick = () => container.removeChild(fieldGroup);

                fieldGroup.appendChild(larguraInput);
                fieldGroup.appendChild(alturaInput);
                fieldGroup.appendChild(quantidadeInput);
                fieldGroup.appendChild(removeButton); // adiciona o botão ao grupo

                container.appendChild(fieldGroup);
            });
        }

        Swal.fire({
            title: "Sucesso",
            text: "Projeto carregado com sucesso",
            icon: "success",
        });
    };

    reader.readAsText(file);
}

// função para abrir o seletor de arquivo JSON
function abrirSeletorArquivo() {
    document.getElementById('carregarArquivoInput').click();
}

// Função para chamar quando o ID do projeto é recuperado do localStorage
const idProjeto = localStorage.getItem('idProjeto');
if (idProjeto) {
    carregarProjeto(idProjeto);
} else {
    console.error('ID do projeto não encontrado no localStorage.');
}

async function salvarProjeto() {
    // Coleta os dados do formulário
    const alturaParede = document.getElementById('alturaParede').value;
    const tipoBloco = document.getElementById('tipoBloco').value;
    const nomeProjetoInput = document.getElementById('nomeProjeto').value;

    // Coleta dados de portas e janelas
    const portasJanelas = [];
    const campos = document.querySelectorAll("#dimensions-container .field-group");
    campos.forEach(campo => {
        const largura = campo.querySelector("input[name='largura[]']").value;
        const altura = campo.querySelector("input[name='altura[]']").value;
        const quantidade = campo.querySelector("input[name='quantidade[]']").value;
        portasJanelas.push({ largura, altura, quantidade });
    });

    // Validações básicas
    if (alturaParede == 0 || alturaParede == null) {
        Swal.fire({
            title: 'Erro',
            text: 'A altura da parede não pode ser 0 ou nula',
            icon: 'error',
        });
        return;
    }
    
    if (stack.length == 0 || stack.length == null) {
        Swal.fire({
            title: 'Erro',
            text: 'É necessário desenhar o projeto para salvá-lo',
            icon: 'error',
        });
        return;
    }
    
    if (!nomeProjetoInput) {
        Swal.fire({
            title: 'Erro',
            text: 'O nome do projeto é obrigatório',
            icon: 'error',
        });
        return;
    }
    // if (nomeProjetoInput == 'casa1' || nomeProjetoInput == 'casa2' || nomeProjetoInput == 'casa3') {
    //     Swal.fire({
    //         title: 'Atenção',
    //         html: 'Não é possível utilizar este nome, por favor,<br><b>ESCOLHA OUTRO NOME</b>',
    //         icon: 'warning',
    //     });
    //     return;
    // }

    try {
        // Preparar dados para envio
        const dados = {
            alturaParede: alturaParede,
            tipoBloco: tipoBloco,
            stack: stack,
            portasJanelas: portasJanelas
        };

        // Verificação inicial (antes de mostrar confirmação)
        const formDataVerificacao = new FormData();
        formDataVerificacao.append('nome', nomeProjetoInput);
        formDataVerificacao.append('dados', JSON.stringify(dados));
        formDataVerificacao.append('acao', 'verificar');

        const responseVerificacao = await fetch('http://localhost:8080/Constructo/php/conexao.php', {
            method: 'POST',
            body: formDataVerificacao
        });

        const resultadoVerificacao = await responseVerificacao.json();

        if (resultadoVerificacao.status === 'confirmacao') {
            // Se precisa de confirmação, mostra o diálogo
            const { isConfirmed } = await Swal.fire({
                title: 'Projeto Existente',
                text: 'Já existe um projeto com este nome. Deseja sobrescrever?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Sim, sobrescrever',
                cancelButtonText: 'Cancelar'
            });

            if (!isConfirmed) {
                Swal.fire('Operação cancelada', 'O projeto não foi alterado', 'info');
                return;
            }
        } else if (resultadoVerificacao.status === 'erro') {
            throw new Error(resultadoVerificacao.mensagem);
        }

        // Envio final (com ou sem sobrescrita)
        const formDataFinal = new FormData();
        formDataFinal.append('nome', nomeProjetoInput);
        formDataFinal.append('dados', JSON.stringify(dados));
        formDataFinal.append('acao', 'confirmar');

        const responseFinal = await fetch('http://localhost:8080/Constructo/php/conexao.php', {
            method: 'POST',
            body: formDataFinal
        });

        const resultadoFinal = await responseFinal.json();

        if (resultadoFinal.status === 'sucesso') {
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: resultadoFinal.mensagem || 'Projeto salvo com sucesso',
            });
            
            // Atualiza o ID no localStorage se for um novo projeto
            if (resultadoFinal.novoId) {
                localStorage.setItem('projetoId', resultadoFinal.novoId);
            }
        } else {
            throw new Error(resultadoFinal.mensagem || 'Erro ao salvar projeto');
        }

    } catch (error) {
        console.error('Erro ao salvar:', error);
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: error.message || 'Erro ao salvar o projeto',
        });
    }
}

function carregarProjeto(idProjeto) {
    fetch(`http://localhost:8080/Constructo/php/conexao.php?id=${idProjeto}`)
        .then(response => response.json())
        .then(projeto => {
            if (idProjeto == "novoProjeto") {
                Swal.fire({
                    title: "Vamos iniciar um novo projeto",
                    icon: "info"
                })
                return;
            }
            // veriifca se os dados do projeto estão corretos
            if (!projeto || !projeto.dados) {
                console.error("Dados do projeto não encontrados ou inválidos.");
                Swal.fire({
                    title: "Erro",
                    text: "Projeto não encontrado ou dados inválidos.",
                    icon: "error",
                });
                return;
            }


            // tenta fazer o parse dos dados (dados é uma string jsonm)
            let dados;
            try {
                dados = JSON.parse(projeto.dados);
            } catch (error) {
                console.error("Erro ao fazer o parse dos dados:", error);
                Swal.fire({
                    title: "Erro",
                    text: "Erro ao carregar os dados do projeto.",
                    icon: "error",
                });
                return;
            }

            // atualiza os campos de altura, tipo de bloco e nome
            document.getElementById('alturaParede').value = dados.alturaParede;
            document.getElementById('tipoBloco').value = dados.tipoBloco;
            document.getElementById('nomeProjeto').value = projeto.nome;

            // recarrega as coordenadas do desenho
            stack = dados.stack;
            redesenhar(); // Re-desenha as linhas no canvas

            // recarrega as portas e janelas
            const container = document.getElementById("dimensions-container");
            container.innerHTML = ""; // limpa os campos existentes

            if (dados.portasJanelas && Array.isArray(dados.portasJanelas)) {
                dados.portasJanelas.forEach(item => {
                    const fieldGroup = document.createElement("div");
                    fieldGroup.classList.add("field-group");

                    const larguraInput = document.createElement("input");
                    larguraInput.type = "number";
                    larguraInput.placeholder = "Largura (m)";
                    larguraInput.name = "largura[]";
                    larguraInput.value = item.largura;
                    larguraInput.required = true;

                    const alturaInput = document.createElement("input");
                    alturaInput.type = "number";
                    alturaInput.placeholder = "Altura (m)";
                    alturaInput.name = "altura[]";
                    alturaInput.value = item.altura;
                    alturaInput.required = true;

                    const quantidadeInput = document.createElement("input");
                    quantidadeInput.type = "number";
                    quantidadeInput.placeholder = "Quantidade";
                    quantidadeInput.name = "quantidade[]";
                    quantidadeInput.value = item.quantidade;
                    quantidadeInput.required = true;

                    // Botão de remover
                    const removeButton = document.createElement("button");
                    removeButton.innerText = "X";
                    removeButton.type = "button";
                    removeButton.onclick = () => container.removeChild(fieldGroup);

                    fieldGroup.appendChild(larguraInput);
                    fieldGroup.appendChild(alturaInput);
                    fieldGroup.appendChild(quantidadeInput);
                    fieldGroup.appendChild(removeButton);

                    container.appendChild(fieldGroup);
                });
            }

            Swal.fire({
                title: "Sucesso",
                text: "Projeto carregado com sucesso",
                icon: "success",
            });
        })
        .catch(error => {
            console.error("Erro ao carregar o projeto:", error);
            Swal.fire({
                title: "Erro",
                text: "Não foi possível carregar o projeto.",
                icon: "error",
            });
        });
}

// adcicionar eventos aos botões
document.getElementById('salvarProjeto').addEventListener('click', salvarProjeto);
document.getElementById('baixarProjetoButton').addEventListener('click', baixarProjeto);
document.getElementById('carregarArquivoInput').addEventListener('change', carregarProjetoDoArquivo);
document.getElementById('carregarArquivoButton').addEventListener('click', abrirSeletorArquivo);

//& NOS FETCH SEMPRE COLAR ESSE LINK http://localhost:8080/Constructo/conexao.php
//~ FIM