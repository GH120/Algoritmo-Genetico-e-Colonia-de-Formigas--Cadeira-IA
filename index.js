

    //Toda a lógica do programa de usar o algoritmo e criar o gráfico
    function criarGrafico(algoritmoEscolhido, iteracoes, taxaMutacao, popsize, quantidadeFormigas, coeficienteDeEvaporacao){

        const container = document.getElementById("container");

        if(container.children[1]){
            container.removeChild(container.children[1])
            container.removeChild(container.children[1])
        }

        //Defina aqui as rotas para os algoritmos escolhidos
        const algoritmos = {
            "Colônia de Formigas": () => new AlgoritmoColoniaFormigas(quantidadeFormigas, coeficienteDeEvaporacao), 
            "Genético": () => new AlgoritmoGenetico(cidades,distancias,popsize)
        }

        //Gera um array [0,1,2..., 14]
        const cidades = new Array(15).fill(0).map((e,i) => i);

        //Matriz de distâncias entre cidades
        const distancias = [
            [  0,  10,  15,  45,   5,  45,  50,  44,  30, 100,  67,  33,  90,  17,  50],
            [ 15,   0, 100,  30,  20,  25,  80,  45,  41,   5,  45,  10,  90,  10,  35],
            [ 40,  80,   0,  90,  70,  33, 100,  70,  30,  23,  80,  60,  47,  33,  25],
            [100,   8,   5,   0,   5,  40,  21,  20,  35,  14,  55,  35,  21,   5,  40],
            [ 17,  10,  33,  45,   0,  14,  50,  27,  33,  60,  17,  10,  20,  13,  71],
            [ 15,  70,  90,  20,  11,   0,  15,  35,  30,  15,  18,  35,  15,  90,  23],
            [ 25,  19,  18,  30, 100,  55,   0,  70,  55,  41,  55, 100,  18,  14,  18],
            [ 40,  15,  60,  45,  70,  33,  25,   0,  27,  60,  80,  35,  30,  41,  35],
            [ 21,  34,  17,  10,  11,  40,   8,  32,   0,  47,  76,  40,  21,  90,  21],
            [ 35, 100,   5,  18,  43,  25,  14,  30,  39,   0,  17,  35,  15,  13,  40],
            [ 38,  20,  23,  30,   5,  55,  50,  33,  70,  14,   0,  60,  30,  35,  21],
            [ 15,  14,  45,  21, 100,  10,   8,  20,  35,  43,   8,   0,  15, 100,  23],
            [ 80,  10,   5,  20,  35,   8,  90,   5,  44,  10,  80,  14,   0,  25,  80],
            [ 33,  90,  40,  18,  70,  45,  25,  23,  90,  44,  43,  70,   5,   0,  25],
            [ 25,  70,  45,  50,   5,  45,  20, 100,  25,  50,  35,  10,  90,   5,   0],
        ];

        //Configurações de certos algoritmos

        //Genético

        const nivelMutacao = 5;
        const porcentagemMelhor    = 0.2 //Porcentagem x da proxima geração que é o melhor caminho da geração
        const porcentagemMelhores  = 0.6 //Porcentagem y da proxima geração que são os y% melhores caminhos da geração
        const porcentagemAleatoria = 0.1 //Porcentagem z da proxima geração que são caminhos aleatórios

                    
        //Cada rota vai ser um array de 1 ou 0 para todos os caminhos utilizados
        class Caminho {

                constructor(cidades){
                    this.genes = cidades;
                    this.rota  = cidades;
                    this.taxaMutacao = taxaMutacao;
                    this.distancia   = this.calcularDistancia();
                    this.nivelMutacao = 5; //Quantas mudanças por mutação
                }

                gerarDescendente(Pai){

                    const tamanhoCromossomo = this.genes.length;

                    const genesMae = this.genes;
                    const genesPai = Pai.genes;

                    const linhaDivisoria = Math.random() * tamanhoCromossomo;

                    const parteDaMae =  genesMae.filter((gene, indice) => indice <= linhaDivisoria);

                    const parteDoPai =  genesPai.filter(gene => !parteDaMae.includes(gene));
                                        
                    const genesFilho = parteDaMae.concat(parteDoPai);

                    const filho = new Caminho(genesFilho);

                    const sofreuMutacao = Math.random() < this.taxaMutacao;

                    if(sofreuMutacao) filho.sofrerMutacao();

                    return filho;
                }

                sofrerMutacao(){

                    //Numero de trocas 
                    const quantidadeMutacoes = Math.round(Math.random() * this.nivelMutacao);

                    //Troca a ordem de duas cidades no caminho
                    for(let i=0; i<quantidadeMutacoes; i++){

                        const tamanhoCromossomo = this.genes.length - 1;
                    
                        const posicao1 = Math.round(Math.random() * tamanhoCromossomo);
                        const posicao2 = Math.round(Math.random() * tamanhoCromossomo);

                        const gene = this.genes[posicao1];

                        this.genes[posicao1] = this.genes[posicao2];
                        this.genes[posicao2] = gene;
                    }

                    return this;
                }

                calcularDistancia(){

                    const cidades = this.genes;

                    const arestas = cidades.map((city,index) => {

                                                const atual = city;
                                                const proxima = cidades[(index+1)%cidades.length]

                                                return [atual, proxima]
                                        })
                        
                    
                    const distanciaTotal   = arestas.flatMap(aresta => distancias[aresta[0]][aresta[1]])
                                                    .reduce((a,b) => a+b);

                    return distanciaTotal;
                }
        }

        class AlgoritmoGenetico{

            constructor(cidades, custos, quantidadePopulacao=100){

                this.cidades   = cidades;
                this.custos    = custos;
                this.populacao = [];
                this.popsize   = quantidadePopulacao;

                this.porcentagemMelhor   = porcentagemMelhor    //Porcentagem x da proxima geração que é o melhor caminho da geração
                this.porcentagemMelhores = porcentagemMelhores  //Porcentagem y da proxima geração que são os y% melhores caminhos da geração
                this.porcentagemAleatoria= porcentagemAleatoria //Porcentagem z da proxima geração que são caminhos aleatórios

                this.gerarPopulacao();
            }

            gerarPopulacao(){
                
                for(let i=0; i < this.popsize;i++){

                    //Clona array das cidades usando map, pois não tem método clone no javascript
                    const ordemDasCidadesVisitadas = this.cidades.map(e => e);

                    //Permuta ordem das cidades para criar um caminho aleatório
                    this.misturarArray(ordemDasCidadesVisitadas);

                    const caminho = new Caminho(ordemDasCidadesVisitadas);

                    this.populacao.push(caminho);
                }

                return this;
            }

            misturarArray(array) {
                for (var i = array.length - 1; i > 0; i--) {
                    var j = Math.floor(Math.random() * (i + 1));
                    var temp = array[i];
                    array[i] = array[j];
                    array[j] = temp;
                }
            }

            fitness(caminho){
                return caminho.distancia;
            }

            iterar(){

                //Cria descendentes da presente geração
                const tamanhoPopulacao = this.popsize;

                const descendentes = []; 

                for(let i=0; i < tamanhoPopulacao*2; i++){

                    const IndexPai = Math.round(Math.random() * (tamanhoPopulacao - 1));
                    const IndexMae = Math.round(Math.random() * (tamanhoPopulacao - 1));

                    const pai = this.populacao[IndexPai];
                    const mae = this.populacao[IndexMae];

                    const filho = mae.gerarDescendente(pai);

                    descendentes.push(filho);
                }
                
                descendentes.sort((a,b) => this.fitness(a) - this.fitness(b));


                //Agora selecionar descendentes para proxima geração

                const quantidadeMelhor    = Math.round(tamanhoPopulacao * this.porcentagemMelhor);
                const quantidadeMelhores  = Math.round(tamanhoPopulacao * this.porcentagemMelhores);
                const quantidadeAleatoria = tamanhoPopulacao - quantidadeMelhor - quantidadeMelhores;

                const melhorDescendente      = descendentes.filter((pop, index) => index < quantidadeMelhor).map(caminho => descendentes[0]);

                const melhoresDescendentes   = descendentes.filter((pop, index) => index < quantidadeMelhores);

                let descendentesAleatorios = descendentes.map(e => e);

                this.misturarArray(descendentesAleatorios)

                descendentesAleatorios = descendentesAleatorios.filter((pop, index) => index < quantidadeAleatoria)


                this.populacao = melhorDescendente.concat(melhoresDescendentes.concat(descendentesAleatorios))

            }

                roleta(){

                    const distanciaDeCadaCaminho = this.populacao.map(caminho => this.fitness(caminho));

                    const media = distanciaDeCadaCaminho.reduce((a,b) => a+b)/this.popsize;

                    const standardDeviation = distanciaDeCadaCaminho
                }

                getMostFit(){
                    return this.populacao[0];
                }
        }

        class Logger {

            constructor(algoritmo){

                this.algoritmo  = algoritmo;
                this.dataPoints = []
            }

            executar(iteracoes = 100){

                this.iteracoes = iteracoes;

                for(let i =0; i < iteracoes; i++){

                    let melhorCaminhoDaIteracao = algoritmo.getMostFit();

                    this.dataPoints.push({
                        x: i,
                        y: melhorCaminhoDaIteracao.distancia
                    })

                    if(!this.melhorCaminho || this.melhorCaminho.distancia > melhorCaminhoDaIteracao.distancia){
                        this.melhorCaminho = melhorCaminhoDaIteracao;
                        this.iteracaoMelhorCaminho = i;
                    } 

                    algoritmo.iterar()

                }
                
            }
        }

        class AlgoritmoColoniaFormigas {
            constructor(num_ants, evaporacao, alpha, beta) {
                this.num_ants = num_ants;
                this.ants = [];
                this.evaporacao = evaporacao;
                this.alpha = alpha
                this.beta = beta
                this.matrizFeromonios = Array.from({ length: 15 }, () => Array(15).fill(1));
                this.initializeAnts();
                this.updatePheromoneMatrix();
            }

            initializeAnts() {
                for (let i = 0; i < this.num_ants; i++) {
                    this.ants.push(new Caminho([i]));
                }
            }

            updatePheromoneMatrix() {
                let anterior = 0;
                this.matrizFeromonios = this.matrizFeromonios.map(row => row.map(() => (1 - this.evaporacao)));
                for (const ant of this.ants) {
                    for (const cidade of ant.rota) {
                        const distancia = (ant.distancia == 0)? 0.00000000001 : ant.distancia
                        this.matrizFeromonios[cidade][anterior] += 1 / distancia;
                        anterior = cidade;
                    }
                    this.matrizFeromonios[0][anterior] += 1 / ant.distancia;
                }
            }

            iterar() {

                    const new_ants = [];
                    for (let ant = 0; ant < this.num_ants; ant++) {
                        
                        const rotaAtual = [];

                        let escolhas = Array.from({ length: 14 }, (_, index) => index + 1);
                        let escolhasRestantes = [...escolhas]; // Create a copy of remaining_choices

                        //Cria uma rota iterando pelas escolhas restantes
                        while (escolhasRestantes.length > 0) {

                            //Calcula a probabilidade bruta, depois nivela para conseguir a probabilidade de 0 a 1
                            const probabilidadeBruta = escolhasRestantes.map(cidade => this.calcularProbabilidade(cidade, rotaAtual))

                            const probabilidadeTotal = probabilidadeBruta.reduce((acc, val) => acc + val, 0);

                            const probabilidades = probabilidadeBruta.map(prob => prob / probabilidadeTotal);

                            //Escolhe a cidade aleatoriamente ponderado na probabilidade
                            const cidadeEscolhida = this.escolherCidade(escolhasRestantes, probabilidades);

                            rotaAtual.push(cidadeEscolhida);

                            escolhasRestantes = escolhasRestantes.filter(choice => choice !== step);
                        }

                        new_ants.push(new Caminho(rotaAtual, false));
                    }
                    this.ants = new_ants;
                    this.updatePheromoneMatrix();
                    this.ants.sort((a, b) => a.distancia - b.distancia);
                    console.log(` Melhor distância = ${this.ants[0].distancia}`);
                    console.log(` Melhor caminho = ${this.ants[0].rota}`);

            }

            calcularProbabilidade(cidade, rotaAtual){

                const ultimaCidadeDaRota = rotaAtual[rotaAtual.length - 1];

                const tij = (1 / distancias[cidade][ultimaCidadeDaRota]); //Fator heurístico

                const nij = this.pheromone_matrix[cidade][ultimaCidadeDaRota]; //Fator dos feromônios

                const fatorHeuristico = tij ** (this.beta);
                const fatorFeromonico = nij ** (this.alpha);

                return fatorFeromonico * fatorHeuristico;
            }

            escolherCidade(escolhasRestantes, probabilidades){

                const numeroAleatorio = Math.random();

                let indice = 0;

                let soma   = 0;

                for(const probabilidade of probabilidades){
                    //Para na escolha cuja soma acumulada de probabilidades supera o número aleatório
                    if(soma > numeroAleatorio) break;
                    soma += probabilidade;
                    indice++;
                }

                indice = Math.max(indice, escolhasRestantes.length - 1)

                return escolhasRestantes[indice];
            }

            getMostFit(){
                return this.ants[0];
            }
        }




        const algoritmo = algoritmos[algoritmoEscolhido]();

        const logger = new Logger(algoritmo);

        logger.executar(iteracoes);

        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,
            zoomEnabled: true,
            title:{
                text: (algoritmoEscolhido == "Genético")? `Algoritmo Genético - População: ${algoritmo.popsize},  Mutação: ${taxaMutacao * 100}% ` :
                    (algoritmoEscolhido == "Colônia de Formigas")?  `Algoritmo Colônia de Formigas - Formigas: ${algoritmo.num_ants},  Evaporação: ${coeficienteDeEvaporacao * 100}% ` :
                    null
            },
            axisX: {
                title:"Iteração",
                minimum: 0,
                maximum: logger.iteracoes
            },
            axisY:{
                title: "Distância",
                minimum: 0
                // valueFormatString: "$#,##0k"
            },
            data: [{
                type: "scatter",
                toolTipContent: "<b>Iteração: </b>{x} <br/><b>Distância: </b>{y}",
                dataPoints: [...logger.dataPoints]
            }]
        });
        chart.render();

        const caminhoDiv = document.createElement("div");


        const ultimoCaminho = algoritmo.getMostFit();

        ultimoCaminho.rota.push(0); //Gambiarra, rota no algoritmo das formigas ignora o 0

        caminhoDiv.textContent ="Ultimo Caminho = [ "+ ultimoCaminho.rota.map(cidade => cidade+1).join(", ") + " ] com distância " + ultimoCaminho.distancia

        caminhoDiv.style.textAlign='center'
        caminhoDiv.style.paddingTop= '50px'
        caminhoDiv.style.fontSize = "20px"

        document.getElementById("container").appendChild(caminhoDiv);

        const caminhoDiv2 = document.createElement("div");


        const melhorCaminho = logger.melhorCaminho;

        melhorCaminho.rota.push(0); //Gambiarra, rota no algoritmo das formigas ignora o 0

        caminhoDiv2.textContent ="Melhor Caminho = [ "+ melhorCaminho.rota.map(cidade => cidade+1).join(", ") + " ] com distância " + melhorCaminho.distancia + " na iteração " + logger.iteracaoMelhorCaminho;

        caminhoDiv2.style.textAlign='center'
        caminhoDiv2.style.paddingTop= '50px'
        caminhoDiv2.style.fontSize = "20px"

        document.getElementById("container").appendChild(caminhoDiv2);



}

        document.getElementById("variableForm").addEventListener("submit", function(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        
        const algoritmo = formData.get("algoritmo");
        const iteracoes = parseInt(formData.get("iteracoes"));
        const taxaMutacao = parseFloat(formData.get("taxaMutacao"));
        const popsize = parseInt(formData.get("popsize"));
        const quantidadeFormigas = parseInt(formData.get("quantidadeFormigas"));
        const coeficienteDeEvaporacao = parseFloat(formData.get("coeficienteDeEvaporacao"));

        criarGrafico(algoritmo,iteracoes,taxaMutacao,popsize,quantidadeFormigas,coeficienteDeEvaporacao)
});

document.getElementById("algoritmo").addEventListener("change", function(event) {
    const selectedAlgorithm = event.target.value;
    const geneticVariablesDiv = document.getElementById("geneticVariables");
    const antVariablesDiv = document.getElementById("antVariables");
    if (selectedAlgorithm === "Genético") {
    geneticVariablesDiv.style.display = "block";
    antVariablesDiv.style.display = "none";
    } else if (selectedAlgorithm === "Colônia de Formigas") {
    geneticVariablesDiv.style.display = "none";
    antVariablesDiv.style.display = "block";
    }
});