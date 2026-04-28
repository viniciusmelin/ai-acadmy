const context = "Eu gosto de programar em";

const possibleNextTokens = [
  { token: " TypeScript", probability: 0.42 },
  { token: " JavaScript", probability: 0.25 },
  { token: " Kotlin", probability: 0.18 },
  { token: " Python", probability: 0.10 },
  { token: " casa", probability: 0.05 },
]; 

const sorted = possibleNextTokens.sort(
  (a, b) => b.probability - a.probability,
);

console.log("Contexto:", context);
console.log("Próximos tokens prováveis:");

for (const item of sorted) {
  console.log(`${item.token}: ${item.probability * 100}%`);
}

console.log("Resposta escolhida:", context + sorted[0].token);