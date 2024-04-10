//Escolha o algoritmo
const algoritmoEscolhido  = "Colônia de Formigas";

//Defina aqui as rotas para os algoritmos escolhidos
const algoritmos = {
    "Colônia de Formigas": () => new AlgoritmoColoniaFormigas(quantidadeFormigas, coeficienteDeEvaporacao), 
    "Genético": () => new AlgoritmoGenetico(cidades,distancias,popsize)
}

//Variáveis a serem mudadas

//Genético
const taxaMutacao = 0.01;
const popsize = 100;
const iteracoes = 100;

//Smilinguido
const quantidadeFormigas = 10;
const coeficienteDeEvaporacao = 0.1;

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


            
//Cada rota vai ser um array de 1 ou 0 para todos os caminhos utilizados
class Caminho {

constructor(cidades){
    this.genes = cidades;
    this.rota  = cidades;
    this.taxaMutacao = taxaMutacao;
    this.distancia   = this.calcularDistancia();
}

gerarDescendente(Pai){

    const tamanhoCromossomo = this.genes.length;

    const genesMae = this.genes;
    const genesPai = Pai.genes;

    const linhaDivisoria = Math.random() * tamanhoCromossomo;

    const parteDaMae =  genesMae.filter((gene, indice) => indice <= linhaDivisoria);

    const parteDoPai =  genesPai.filter(gene => !parteDaMae.includes(gene));
                        
    const genesFilho = parteDaMae.concat(parteDoPai);

    const sofreuMutacao = Math.random() < this.taxaMutacao;

    const filho = new Caminho(genesFilho);

    if(sofreuMutacao) filho.sofrerMutacao();

    return filho;
}

sofrerMutacao(){

    const tamanhoCromossomo = this.genes.length - 1;
    
    const posicao1 = Math.round(Math.random() * tamanhoCromossomo);
    const posicao2 = Math.round(Math.random() * tamanhoCromossomo);

    const gene = this.genes[posicao1];

    this.genes[posicao1] = this.genes[posicao2];
    this.genes[posicao2] = gene;

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

    const tamanhoPopulacao = this.populacao.length;

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

    this.populacao = descendentes.filter((pop, index) => index < tamanhoPopulacao);
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

            algoritmo.iterar()

        }
        
    }
}

class AlgoritmoColoniaFormigas {
    constructor(num_ants, coef_de_evaporacao) {
        this.num_ants = num_ants;
        this.ants = [];
        this.coef_de_evaporacao = coef_de_evaporacao;
        this.pheromone_matrix = Array.from({ length: 15 }, () => Array(15).fill(1));
        this.initializeAnts();
        this.updatePheromoneMatrix();
    }

    initializeAnts() {
        for (let i = 0; i < this.num_ants; i++) {
            this.ants.push(new Caminho(Array.from({ length: 14 }, (_, index) => index + 1)));
        }
    }

    updatePheromoneMatrix() {
        let anterior = 0;
        this.pheromone_matrix = this.pheromone_matrix.map(row => row.map(() => (1 - this.coef_de_evaporacao)));
        for (const ant of this.ants) {
            for (const cidade of ant.rota) {
                this.pheromone_matrix[cidade][anterior] += 1 / ant.distancia;
                anterior = cidade;
            }
            this.pheromone_matrix[0][anterior] += 1 / ant.distancia;
        }
    }

    iterar() {

            const new_ants = [];
            for (let ant = 0; ant < this.num_ants; ant++) {
                const current_route = [];
                let remaining_choices = Array.from({ length: 14 }, (_, index) => index + 1);
                let tempRemainingChoices = [...remaining_choices]; // Create a copy of remaining_choices

                while (tempRemainingChoices.length > 0) {
                    let probabilities = tempRemainingChoices.map(choice => (1 / distancias[choice][current_route[current_route.length - 1]]) * this.pheromone_matrix[choice][current_route[current_route.length - 1]]);
                    probabilities = probabilities.map(prob => prob / probabilities.reduce((acc, val) => acc + val, 0));
                    let step = tempRemainingChoices[Math.floor(Math.random() * tempRemainingChoices.length)];
                    current_route.push(step);
                    tempRemainingChoices = tempRemainingChoices.filter(choice => choice !== step);
                }

                new_ants.push(new Caminho(current_route, false));
            }
            this.ants = new_ants;
            this.updatePheromoneMatrix();
            this.ants.sort((a, b) => a.distancia - b.distancia);
            console.log(` Melhor distância = ${this.ants[0].distancia}`);
            console.log(` Melhor caminho = ${this.ants[0].rota}`);

    }

    getMostFit(){
        return this.ants[0];
    }
}




const algoritmo = algoritmos[algoritmoEscolhido]();

const logger = new Logger(algoritmo);

logger.executar(iteracoes);
