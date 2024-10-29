const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let stack = [];
const tamanhoPadrao = 40;

// função para desenhar o padrão quadriculado
function desenharPadrao() {
    const linhas = Math.ceil(canvas.height / tamanhoPadrao);
    const colunas = Math.ceil(canvas.width / tamanhoPadrao);
    context.fillStyle = '#ccc'; // cor do padrão em cinza
    for (let linha = 0; linha < linhas; linha++) {
        for (let coluna = 0; coluna < colunas; coluna++) {
            if ((linha + coluna) % 2 === 0) {
                context.fillRect(coluna * tamanhoPadrao, linha * tamanhoPadrao, tamanhoPadrao, tamanhoPadrao);
            }
        }
    }
}

// desenhar o padrão quadriculado logo que iniciar a pagina
desenharPadrao();

function snapGrid(coord) {
    return Math.round(coord / (tamanhoPadrao / 2)) * (tamanhoPadrao / 2);
};

// função para começar o desenho
function comecarDesenho(e) {
    isDrawing = true;
    startX = snapGrid(e.offsetX);
    startY = snapGrid(e.offsetY);
}

// função para desenhar durante o arrasto do mouse
function desenhar(e) {
    if (!isDrawing) return;
    endX = snapGrid(e.offsetX);
    endY = snapGrid(e.offsetY);
    redesenhar();
}

// função para desenhar a linhas retas
function redesenhar() {
    context.clearRect(0, 0, canvas.width, canvas.height);
    desenharPadrao();
    for (let i = 0; i < stack.length; i++) {
        const { startX, startY, endX, endY } = stack[i];
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = 'blue'; // cor da linha do desenho
        context.lineWidth = 3;
        context.stroke();
    }
    if (isDrawing) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = 'blue'; // cor da linha do desenho
        context.lineWidth = 3;
        context.stroke();
    }
}

// função para dividir uma linha em segmentos com base no grid
function dividirLinhaEmSegmentos(startX, startY, endX, endY) {
    const segmentos = [];

    const deltaX = endX - startX;
    const deltaY = endY - startY;

    const steps = Math.max(Math.abs(deltaX), Math.abs(deltaY)) / (tamanhoPadrao / 2);  // dividindo conforme o grid

    for (let i = 0; i <= steps; i++) {
        const x = startX + (deltaX / steps) * i;
        const y = startY + (deltaY / steps) * i;
        segmentos.push({ x, y });
    }

    return segmentos;
}

// função para verificar sobreposição de segmentos
function verificarSobreposicao(startX, startY, endX, endY) {
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

        // se todos os segmentos tocarem, é sobreposição. Permite conexão em apenas um ponto
        if (intersecoes > 1) {
            return true;  // tem sobreposição total ou parcial
        }
    }

    return false;  // não tme sobreposição relevante
}

// tem que fazer até função pra parar de desenhar 
function pararDesenho() {
    if (!isDrawing) return;
    isDrawing = false;

    // verifica se a linha desenhada é válida
    if (startX === endX && startY === endY) {
        return; // Linha sem comprimento, não salva
    }

    // cahama a função para verificar sobreposiçâo
    const sobreposicao = verificarSobreposicao(startX, startY, endX, endY);

    if (sobreposicao) {
        alert("linhas sobrepostas");

        // limpa a linha atual e redesenha todas as otras
        redesenhar();  // redeesenha o estado atual do canvas sem a linha inválida

        return;  // não adiciona a linha sobreposta ao stack
    }

    // adiciona a linha ao stack se não houver sobreposição
    stack.push({ startX, startY, endX, endY });
    redesenhar(); // redesenha as linhas no canvas
}

function DimensaoPortasJanelas() {
    const container = document.getElementById("dimensions-container");

    const fieldGroup = document.createElement("div");
    fieldGroup.classList.add("field-group");

    const larguraInput = document.createElement("input");
    larguraInput.type = "number";
    larguraInput.placeholder = "Largura (m)";
    larguraInput.name = "largura[]";
    larguraInput.required = true;

    const alturaInput = document.createElement("input");
    alturaInput.type = "number";
    alturaInput.placeholder = "Altura (m)";
    alturaInput.name = "altura[]";
    alturaInput.required = true;

    const quantidadeInput = document.createElement("input");
    quantidadeInput.type = "number";
    quantidadeInput.placeholder = "Quantidade";
    quantidadeInput.name = "quantidade[]";
    quantidadeInput.required = true;

    const removeButton = document.createElement("button");
    removeButton.innerText = "Remover";
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
    const larguraInputs = document.getElementsByName("largura[]");
    const alturaInputs = document.getElementsByName("altura[]");
    const quantidadeInputs = document.getElementsByName("quantidade[]");

    let areaTotalAberturas = 0;

    for (let i = 0; i < larguraInputs.length; i++) {
        const largura = parseFloat(larguraInputs[i].value);
        const altura = parseFloat(alturaInputs[i].value);
        const quantidade = parseInt(quantidadeInputs[i].value);

        if (!isNaN(largura) && !isNaN(altura) && !isNaN(quantidade)) {
            areaTotalAberturas += largura * altura * quantidade;
        }
    }

    return areaTotalAberturas;
}

// Função para calcular o número de blocos
function calcularNumeroBlocos(alturaParede) {
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
            dimensoesBloco = { comprimento: 0.25, altura: 0.125, largura : 0.0625 };
            break;
        default:
            alert("Tipo de bloco não reconhecido!");
            return;
    }

    const areaTotalAberturas = calcularAreaAberturas();
    const areaParede = (calcularComprimentoParede() * alturaParede) - areaTotalAberturas;
    const areaBloco = dimensoesBloco.comprimento * dimensoesBloco.altura;
    const numeroBlocos = Math.ceil(areaParede / areaBloco);

    if(areaParede <= 0){
        alert("Área da parede não pode ser menor ou igual a zero");
        return { cimento: 0, areia: 0, agua: 0 };
    }

    return numeroBlocos;
}

// Função para calcular materiais
function calcularMateriais(alturaParede, areaParede) {

    // levando em consideração que as medidas serão 1:4:.5 (cimento:areia:agua)

    const tipoBloco = document.getElementById('tipoBloco').value;

    // Chamando a função calcularNumeroBlocos e armazenando o resultado
    const numBlocos = calcularNumeroBlocos(alturaParede);

    if (!numBlocos) {
        return { cimento: 0, areia: 0, agua: 0 }; // Retorna 0 caso o cálculo de blocos falhe
    }

    let blocosPorSaco;

    switch (tipoBloco) {
        case 'concreto34x19x14':
            blocosPorSaco = 150; // 1 saco de cimento para 150 blocos de concreto
            areiaPorBloco = 0.020;
            break;
        case 'ceramico19x19x09':
            blocosPorSaco = 200; 
            areiaPorBloco = 0.015;
            break;
        case 'ecologico25x12.5x6.25':
            blocosPorSaco = 250; 
            areiaPorBloco = 0.012;
            break;
        default:
            return { cimento: 0, areia: 0 };
    }

    // Calculando o número de sacos de cimento
    const sacosCimento = (numBlocos / blocosPorSaco);

    // Calculando a quantidade de areia
    const areiaPorM3 = areaParede * 0.020;

    //calcular a quantidade de awa
    const aguaLitros = (sacosCimento * 50) * 0.5;

    //heheboy tudp funfando

    return {
        cimento: sacosCimento.toFixed(2),
        areia: areiaPorM3.toFixed(2),
        agua: aguaLitros.toFixed(1)
    };
}

// função para exibir o número de blocos e materiais
function exibirResultados(numeroBlocos, materiais) {
    const materiaisElement = document.getElementById('resultadosMateriais');
    materiaisElement.innerHTML = `
        Materiais necessários:
        <ul>
            <li>Blocos: ${numeroBlocos} </li>
            <li>Cimento: ${materiais.cimento} sacos (50kg)</li>
            <li>Areia: ${materiais.areia} m³</li>
            <li>Água: ${materiais.agua} litros</li>
        </ul>
    `;
}

const botaoDesfazer = document.getElementById('undoButton');
botaoDesfazer.addEventListener('click', function () {
    if (stack.length < 1) return;
    stack.pop();
    redesenhar();
});

//fazendo algumas validaçoes antes de calcular
const botaoCalcular = document.getElementById('calcularButton');
botaoCalcular.addEventListener('click', function () {
    if (stack.length < 1) {
        alert("Desenhe a parede primeiro!");
        return;
    }
    const alturaParede = parseFloat(document.getElementById('alturaParede').value);
    if (isNaN(alturaParede) || alturaParede <= 0) {
        alert("Insira uma altura válida para a parede!");
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
    const projeto = {
        alturaParede: alturaParede,
        tipoBloco: tipoBloco,
        stack: stack, // salva as cooedenadas do desenho
    };

    const blob = new Blob([JSON.stringify(projeto)], { type: 'application/json' });
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

        // recarrega as cooedenadas do desenho
        stack = projeto.stack;
        redesenhar();

        alert('Projeto carregado com sucesso!');
    };

    reader.readAsText(file);
}

// função para abrir o seletor de arquivo JSON
function abrirSeletorArquivo() {
    document.getElementById('carregarArquivoInput').click();
}

// adcicionar eventos aos botões
document.getElementById('baixarProjetoButton').addEventListener('click', baixarProjeto);
document.getElementById('carregarArquivoInput').addEventListener('change', carregarProjetoDoArquivo);
document.getElementById('carregarArquivoButton').addEventListener('click', abrirSeletorArquivo);

//postgre**
