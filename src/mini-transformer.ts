type Vector = number[];

// array de vetores para representar palavras ou tokens
const vocabulary = ["Eu", "gosto", "de", "programar", "em", "TypeScript"];

// dicionário que mapeia cada palavra para seu vetor correspondente
const embeddings: Record<string, Vector> = {
  Eu: [0.1, 0.2],
  gosto: [0.2, 0.4],
  de: [0.1, 0.1],
  programar: [0.8, 0.9],
  em: [0.3, 0.2],
  TypeScript: [0.9, 0.7],
  Kotlin: [0.7, 0.8],
};

// função para calcular a similaridade entre 
// dois vetores usando o produto escalar  
// o que é o produto escalar? é uma operação matemática que
// multiplica os componentes correspondentes de dois vetores e soma os resultados
// a similaridade é uma medida de quão próximos ou semelhantes são dois vetores
function dot(a: Vector, b: Vector): number {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}
// função para calcular a magnitude de um vetor
// o que é magnitude? é a "distância" do vetor em relação 
// à origem (0,0) no espaço vetorial
function softmax(values: number[]): number[] {
  const exps = values.map(Math.exp);
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((v) => v / sum);
}

// função para calcular a similaridade de cosseno entre dois vetores
// o que é similaridade de cosseno? é uma medida de similaridade entre dois vetores
// que calcula o cosseno do ângulo entre eles, variando de -1 a 1
function normalize(v: Vector): Vector {
  const mean = v.reduce((a, b) => a + b, 0) / v.length;
  const variance = v.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / v.length;
  const std = Math.sqrt(variance + 1e-6);

  return v.map((x) => (x - mean) / std);
}

// função para calcular a similaridade de cosseno entre dois vetores
function feedForward(v: Vector): Vector {
  return [
    Math.max(0, v[0] * 1.2 + v[1] * 0.3),
    Math.max(0, v[0] * 0.4 + v[1] * 1.1),
  ];
}

// função para calcular a similaridade de cosseno entre dois vetores
// self-attention é um mecanismo que permite que um modelo de linguagem
// foque em diferentes partes de uma sequência de entrada ao processá-la
function selfAttention(tokens: string[]): Vector {
  const tokenVectors = tokens.map((token) => embeddings[token]);

  const target = tokenVectors[tokenVectors.length - 1];

  const scores = tokenVectors.map((vector) => dot(target, vector));
  const attentionWeights = softmax(scores);

  console.log("\n3. Self-Attention");
  console.table(
    tokens.map((token, i) => ({
      token,
      score: scores[i].toFixed(4),
      attention: attentionWeights[i].toFixed(4),
    })),
  );

  const contextVector: Vector = [0, 0];

  for (let i = 0; i < tokenVectors.length; i++) {
    contextVector[0] += tokenVectors[i][0] * attentionWeights[i];
    contextVector[1] += tokenVectors[i][1] * attentionWeights[i];
  }

  return contextVector;
}

// função para gerar logits (pontuações) para cada token do vocabulário
function generateLogits(contextVector: Vector) {
  return vocabulary.map((token) => ({
    token,
    logit: dot(contextVector, embeddings[token]),
  }));
}


const inputText = "Eu gosto de programar em";
const tokens = inputText.split(" ");

console.log("1. Entrada de tokens");
console.log(tokens);

console.log("\n2. Embeddings");
console.table(
  tokens.map((token) => ({
    token,
    embedding: embeddings[token],
  })),
);

const attentionOutput = selfAttention(tokens);
console.log("Saída da atenção:", attentionOutput);

console.log("\n4. Feed Forward Neural Network");
const ffOutput = feedForward(attentionOutput);
console.log(ffOutput);

console.log("\n5. Normalização");
const normalized = normalize(ffOutput);
console.log(normalized);

console.log("\n6. Repetiria várias camadas");
console.log("Aqui estamos simulando apenas 1 camada.");

console.log("\n7. Logits");
const logits = generateLogits(normalized);
console.table(
  logits.map((item) => ({
    token: item.token,
    logit: item.logit.toFixed(4),
  })),
);

console.log("\n8. Softmax");
const probabilities = softmax(logits.map((item) => item.logit));

console.table(
  logits.map((item, i) => ({
    token: item.token,
    probability: `${(probabilities[i] * 100).toFixed(2)}%`,
  })),
);

const nextToken = logits[probabilities.indexOf(Math.max(...probabilities))].token;

console.log("\n9. Próximo token escolhido");
console.log(nextToken);

console.log("\nTexto final:");
console.log(inputText + " " + nextToken);