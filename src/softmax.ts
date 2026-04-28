type Logit = {
  token: string;
  score: number;
};


// função que recebe uma lista de logits (tokens e suas pontuações)
function softmax(logits: Logit[]) {
  // calcula a exponencial de cada pontuação e a soma total das exponenciais
  const exponentials = logits.map((item) => ({
    token: item.token,
    exp: Math.exp(item.score),
  }));

  // soma total das exponenciais para normalizar as probabilidades
  const sum = exponentials.reduce((acc, item) => acc + item.exp, 0);

  // retorna uma lista de tokens com suas respectivas probabilidades e porcentagens
  return exponentials.map((item) => ({
    token: item.token,
    probability: item.exp / sum,
    percentage: `${((item.exp / sum) * 100).toFixed(2)}%`,
  }));
}

const logits: Logit[] = [
  { token: " TypeScript", score: 2.3 },
  { token: " JavaScript", score: 1.9 },
  { token: " Kotlin", score: 1.5 },
  { token: " Python", score: 0.8 },
];

const probabilities = softmax(logits);

console.table(probabilities);