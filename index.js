
//Cada rota vai ser um array de 1 ou 0 para todos os caminhos utilizados
class Caminho {

    constructor(...rotas){
        this.genes = rotas;
        this.taxaMutacao = 0.01;
    }

    gerarDescendente(Pai){

        const tamanhoCromossomo = this.genes.length;

        const genesMae = this.genes;
        const genesPai = Pai.genes;

        const linhaDivisoria = Math.random() * tamanhoCromossomo;

        const parteDaMae =  genesMae.split(         0        ,   linhaDivisoria );

        const parteDoPai =  genesPai.filter(gene => !parteDaMae.includes(gene));
                            
        const genesFilho = parteDaMae + parteDoPai;

        const sofreuMutacao = this.taxaMutacao < Math.random();

        const filho = new Caminho(genesFilho);

        if(sofreuMutacao) return filho.sofrerMutacao();

        return filho;
    }

    sofrerMutacao(){

        const tamanhoCromossomo = this.genes.length;
        
        const posicao1 = Math.random() * tamanhoCromossomo;
        const posicao2 = Math.random() * tamanhoCromossomo;

        const gene = this.genes[posicao1];

        this.genes[posicao1] = this.genes[posicao2];
        this.genes[posicao2] = gene;

        return this;
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

            const ordemDasCidadesVisitadas = this.cidades.map(e => e);

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

        const distancias = this.custos;

        const cidades = caminho.cidades;

        const arestas = cidades.slice(0, cidades.length - 1)
                               .map((city,index) => [cidades[index], cidades[index + 1]]);
        
        const custo   = arestas.flatmap(aresta => distancias[arestas[0]][arestas[1]])
                                .reduce((a,b) => a+b);

        return custo;
    }
}

const cidades = new Array(15).fill(0).map((e,i) => i);

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

const algoritmo = new AlgoritmoGenetico(cidades,distancias).gerarPopulacao();

console.log(algoritmo)

console.log()