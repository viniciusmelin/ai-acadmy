import OpenAI from "openai";

type Document = {
  id: number;
  content: string;
  embedding?: number[];
};


const client = new OpenAI({
  baseURL: "http://localhost:1234/v1",
  apiKey: "lm-studio",
});


const EMBEDDING_MODEL = "text-embedding-nomic-embed-text-v1.5@f32";
const CHAT_MODEL = "mistralai/ministral-3-3b"; 
const documents: Document[] = [
  { id: 1, content: "NestJS é um framework Node.js para backend escalável." },
  { id: 2, content: "PostgreSQL é um banco de dados relacional poderoso." },
  { id: 3, content: "Redis é usado para cache e filas como BullMQ." },
  { id: 4, content: "RAG combina busca de contexto com LLM." },
  { id: 5, content: "Embeddings transformam texto em vetores numéricos." },
];


/**
 * Cria embedding para PERGUNTA
 * Prefixo melhora qualidade do modelo nomic
 */
async function createQueryEmbedding(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: `search_query: ${text}`,
    encoding_format: "float"
  });

  return response.data[0].embedding;
}


/**
 * Cria embedding para DOCUMENTO
 */
async function createDocumentEmbedding(text: string): Promise<number[]> {
  const response = await client.embeddings.create({
    model: EMBEDDING_MODEL,
    input: `search_document: ${text}`,
    encoding_format: "float"
  });

  return response.data[0].embedding;
}


/**
 * Similaridade de cosseno
 * Mede o quão parecidos dois vetores são
 */
function cosineSimilarity(a: number[], b: number[]): number {
  const dot = a.reduce((sum, value, i) => sum + value * b[i], 0);

  const magA = Math.sqrt(a.reduce((sum, value) => sum + value * value, 0));
  const magB = Math.sqrt(b.reduce((sum, value) => sum + value * value, 0));

  return dot / (magA * magB);
}

/**
 * Indexa documentos (gera embeddings uma vez)
 */
async function indexDocuments() {
  console.log("Indexando documentos...");

  for (const doc of documents) {
    doc.embedding = await createDocumentEmbedding(doc.content);
  }

  console.log("Indexação concluída\n");
}

/**
 * Busca semântica
 */
async function search(query: string) {
  const queryEmbedding = await createQueryEmbedding(query);

  const results = documents.map((doc) => ({
    id: doc.id,
    content: doc.content,
    similarity: cosineSimilarity(queryEmbedding, doc.embedding!),
  }));

  return results.sort((a, b) => b.similarity - a.similarity);
}

// /**
//  * Execução principal
//  */
// async function main() {
//   await indexDocuments();

//   const query = "Como melhorar performance com cache?";

//   const results = await search(query);

//   console.log("Pergunta:", query);
//   console.table(
//     results.map((r) => ({
//       id: r.id,
//       similarity: r.similarity.toFixed(4),
//       content: r.content,
//     })),
//   );
// }

async function generateAnswer(query: string, context: string): Promise<string> {
  const response = await client.chat.completions.create({
    model: CHAT_MODEL,
    messages: [
      {
        role: "system",
        content: `
Você é um especialista em backend e performance.

Regras:
- Responda usando SOMENTE o contexto fornecido
- Seja direto e técnico
- Se não souber, diga "não encontrei no contexto"
        `.trim(),
      },
      {
        role: "user",
        content: `
Pergunta:
${query}

Contexto:
${context}

Resposta:
        `.trim(),
      },
    ],
    temperature: 0.2,
  });

  return response.choices[0]?.message?.content ?? "";
}

async function main() {
  await indexDocuments();

  const query = "Como melhorar performance com cache?";

  const results = await search(query);

  const topResults = results.slice(0, 3);

const context = topResults
  .map(
    (r, i) => `
[${i + 1}] (score: ${r.similarity.toFixed(2)})
${r.content}
`.trim(),
  )
  .join("\n\n");

  console.log("Pergunta:", query);

  console.log("\nContexto recuperado:");
  console.log(context);

  const answer = await generateAnswer(query, context);

  console.log("\nResposta do RAG:");
  console.log(answer);
}
main();