const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
let isDrawing = false;
let startX = 0;
let startY = 0;
let endX = 0;
let endY = 0;
let stack = [];

// função para desenhar o padrão quadriculado
function desenharPadrao() {
    const tamanhoPadrao = 40; // tamanho de cada quadrado em pixels
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

// função para começar o desenho
function comecarDesenho(e) {
    isDrawing = true;
    startX = e.offsetX;
    startY = e.offsetY;
}

// função para desenhar durante o arrasto do mouse
function desenhar(e) {
    if (!isDrawing) return;
    endX = e.offsetX;
    endY = e.offsetY;
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
        context.stroke();
    }
    if (isDrawing) {
        context.beginPath();
        context.moveTo(startX, startY);
        context.lineTo(endX, endY);
        context.strokeStyle = 'blue'; // cor da linha do desenho
        context.lineWidth = 5;
        context.stroke();
    }
}

// tem que fazer até função pra parar de desenhar 
function pararDesenho() {
    if (!isDrawing) return;
    isDrawing = false;
    if (startX !== endX || startY !== endY) {
        stack.push({ startX, startY, endX, endY });
    }
}

// função para calcular a área da parede
function calcularAreaParede() {
    const tamanhoQuadrado = 40;
    let area = 0;
    for (let i = 0; i < stack.length; i++) {
        const { startX, startY, endX, endY } = stack[i];

        // meu deusn não acredito quqe to tendo que usar teorema de pitagoras pra calcular pixel 
        const comprimento = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2)) / tamanhoQuadrado;

        area += comprimento; // somando o comprimento da linha convertida para metros
    }
    return area;
}

// função para calcular o numero de blocos
function calcularNumeroBlocos(alturaParede) {
    const tipoBloco = document.getElementById('tipoBloco').value;
    let dimensoesBloco;

    switch (tipoBloco) {
        case 'concreto39x19x14':
            dimensoesBloco = { comprimento: 0.39, altura: 0.19 };
            break;
        case 'ceramico19x19':
            dimensoesBloco = { comprimento: 0.19, altura: 0.19 };
            break;
        case 'ceramicoEstrutural29x19':
            dimensoesBloco = { comprimento: 0.29, altura: 0.19 };
            break;
        case 'concretoCelular60x20':
            dimensoesBloco = { comprimento: 0.60, altura: 0.20 };
            break;
        case 'silicioCalcio25x20':
            dimensoesBloco = { comprimento: 0.25, altura: 0.20 };
            break;
        default:
            alert("Tipo de bloco não reconhecido!");
            return;
    }

    const areaParede = calcularAreaParede() * alturaParede;
    const areaBloco = dimensoesBloco.comprimento * dimensoesBloco.altura;
    const numeroBlocos = Math.ceil(areaParede / areaBloco);
    return numeroBlocos;
}

// função para calcular materiaia
function calcularMateriais(alturaParede, numeroBlocos) {
    const tipoBloco = document.getElementById('tipoBloco').value;
    const areaParede = calcularAreaParede() * alturaParede;

    // qiantidade de materiais por m² para cada tipo de bloco
    let cimentoPorM2, areiaPorM2, calPorM2, aguaPorM2;

    switch (tipoBloco) {
        case 'concreto39x19x14':
            cimentoPorM2 = 0.12; // sacos de cimento (50kg) por m²
            areiaPorM2 = 0.04; // metros cúbicos de areia por m²
            calPorM2 = 0.03; // metros cúbicos de cal por m²
            aguaPorM2 = 18; // litros de água por m²
            break;
        case 'ceramico19x19':
            cimentoPorM2 = 0.10;
            areiaPorM2 = 0.05;
            calPorM2 = 0.04;
            aguaPorM2 = 15;
            break;
        case 'ceramicoEstrutural29x19':
            cimentoPorM2 = 0.08;
            areiaPorM2 = 0.06;
            calPorM2 = 0.03;
            aguaPorM2 = 12;
            break;
        case 'concretoCelular60x20':
            cimentoPorM2 = 0.14;
            areiaPorM2 = 0.03;
            calPorM2 = 0.05;
            aguaPorM2 = 20;
            break;
        case 'silicioCalcio25x20':
            cimentoPorM2 = 0.11;
            areiaPorM2 = 0.04;
            calPorM2 = 0.04;
            aguaPorM2 = 16;
            break;
        default:
            cimentoPorM2 = 0;
            areiaPorM2 = 0;
            calPorM2 = 0;
            aguaPorM2 = 0;
            break;
    }

    return {
        cimento: (cimentoPorM2 * areaParede).toFixed(2),
        areia: (areiaPorM2 * areaParede).toFixed(2),
        cal: (calPorM2 * areaParede).toFixed(2),
        agua: (aguaPorM2 * areaParede).toFixed(2)
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
            <li>Cal: ${materiais.cal} m³</li>
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

// Função para salvar o projeto em um arquivo JSON
function baixarProjeto() {
    const alturaParede = document.getElementById('alturaParede').value;
    const tipoBloco = document.getElementById('tipoBloco').value;

    const projeto = {
        alturaParede: alturaParede,
        tipoBloco: tipoBloco,
        stack: stack, // Salva as coordenadas do desenho
    };

    const blob = new Blob([JSON.stringify(projeto)], { type: 'application/json' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'projeto.json';
    link.click();
}

// Função para carregar o projeto de um arquivo JSON
function carregarProjetoDoArquivo(event) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
        const projeto = JSON.parse(e.target.result);

        // Atualiza os campos de altura e tipo de bloco
        document.getElementById('alturaParede').value = projeto.alturaParede;
        document.getElementById('tipoBloco').value = projeto.tipoBloco;

        // Recarrega as coordenadas do desenho
        stack = projeto.stack;
        redesenhar(); // Redesenha o canvas com as linhas salvas

        alert('Projeto carregado com sucesso!');
    };

    reader.readAsText(file);
}

// Função para abrir o seletor de arquivo JSON
function abrirSeletorArquivo() {
    document.getElementById('carregarArquivoInput').click();
}

// Adicionar eventos aos botões
document.getElementById('baixarProjetoButton').addEventListener('click', baixarProjeto);
document.getElementById('carregarArquivoInput').addEventListener('change', carregarProjetoDoArquivo);
document.getElementById('carregarArquivoButton').addEventListener('click', abrirSeletorArquivo);
