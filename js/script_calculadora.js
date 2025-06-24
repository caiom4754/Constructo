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
    const container = document.getElementById("dimensions-container-calculadora");

    const fieldGroup = document.createElement("div");
    fieldGroup.classList.add("field-group");

    const larguraInput = document.createElement("input");
    larguraInput.classList.add('input-dmsPJ')
    larguraInput.type = "number";
    larguraInput.placeholder = "Largura (m)";
    larguraInput.name = "largura[]";
    larguraInput.min = "0";
    larguraInput.required = true;

    const alturaInput = document.createElement("input");
    alturaInput.classList.add('input-dmsPJ')
    alturaInput.type = "number";
    alturaInput.placeholder = "Altura (m)";
    alturaInput.name = "altura[]";
    alturaInput.min = "0";
    alturaInput.required = true;

    const quantidadeInput = document.createElement("input");
    quantidadeInput.classList.add('input-dmsPJ')
    quantidadeInput.type = "number";
    quantidadeInput.placeholder = "Quantidade";
    quantidadeInput.name = "quantidade[]";
    quantidadeInput.min = "0";
    quantidadeInput.required = true;

    const removeButton = document.createElement("button");
    removeButton.classList.add('fas', 'fa-trash-alt')
    removeButton.type = "button";
    removeButton.onclick = () => container.removeChild(fieldGroup);

    fieldGroup.appendChild(larguraInput);
    fieldGroup.appendChild(alturaInput);
    fieldGroup.appendChild(quantidadeInput);
    fieldGroup.appendChild(removeButton);

    container.appendChild(fieldGroup);
}
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

const botaoCalcular = document.getElementById('calcularButton');

botaoCalcular.addEventListener('click', function () {
    let alturaParede = document.getElementById('alturaParede').value;
    let metrosLineares = document.getElementById('metrosLineares').value;
    const tipoBloco = document.getElementById('tipoBloco').value;
    let dimensoesBloco;
    const areaAberturas = calcularAreaAberturas();

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
    const areaParede = (metrosLineares * alturaParede)-areaAberturas;
    const areaBloco = dimensoesBloco.comprimento * dimensoesBloco.altura;
    const numBlocos = Math.ceil(areaParede / areaBloco);

    if (areaParede <= 0) {
        Swal.fire({
            title: 'Erro',
            text: 'Área da parede inválida',
            icon: 'error',
        })
        return { cimento: 0, areia: 0, agua: 0 };
    }
    if (isNaN(alturaParede) || alturaParede <= 0) {
        return { erro: 'Altura da parede inválida (NBR 12118: deve ser > 0)' };
    }

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

    let cimento = (volumeCimento / 0.0357 * 1.1).toFixed(2); // Sacos de 50kg
    let areia = (volumeArgamassa * (params.traco.areia / (params.traco.cimento + params.traco.areia)) * 1.1).toFixed(3);
    let agua = (volumeCimento * 1400 * params.relacaoAC * 1.1).toFixed(1);


    const materiaisElement = document.getElementById('resultadosMateriais');
    materiaisElement.innerHTML = `
        Materiais necessários:
        <ul>
            <li>Blocos:     ${numBlocos} </li>
            <li>Cimento:    ${cimento} sacos (50kg)</li>
            <li>Areia:  ${areia} m³</li>
            <li>Água:   ${agua} litros</li>
        </ul>
    `;
});