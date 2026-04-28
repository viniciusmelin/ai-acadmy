type Document = {
  id: number;
  content: string;
};

const documents: Document[] = [
  { id: 1, content: "NestJS é um framework Node.js para backend escalável." },
  { id: 2, content: "PostgreSQL é um banco de dados relacional poderoso." },
  { id: 3, content: "Redis é usado para cache e filas como BullMQ." },
  { id: 4, content: "RAG combina busca de contexto com LLM." },
  { id: 5, content: "Embeddings transformam texto em vetores numéricos." },
];


/// tokeniza o texto em palavras individuais, convertendo 
// para minúsculas e removendo pontuações    
function tokenize(text: string): string[] {
  return text.toLowerCase().split(/\W+/);
}

// similaridade simples baseada na contagem de tokens compartilhados 
// entre a consulta e o documento

function similarity(a: string, b: string): number {
  const tokensA = new Set(tokenize(a));
  const tokensB = new Set(tokenize(b));
console.log("Tokens A:", tokensA);
console.log("Tokens B:", tokensB);
  const intersection = [...tokensA].filter((t) => tokensB.has(t));
  return intersection.length;
}

// search é a função principal que recebe uma consulta, calcula a similaridade
// entre a consulta e cada documento, e retorna os documentos ordenados por relevância
function search(query: string) {
  const results = documents.map((doc) => ({
    ...doc,
    score: similarity(query, doc.content),
  }));

  return results.sort((a, b) => b.score - a.score);
}

const query = "O que é RAG?";

const results = search(query);

console.log("Pergunta:", query);
console.log("\nResultados:");

console.table(
  results.map((r) => ({
    id: r.id,
    score: r.score,
    content: r.content,
  })),
);