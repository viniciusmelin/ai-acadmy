
// tipo de atenção para explicar o significado de um token em um contexto específico
type AttentionScore = {
    token: string;
    score: number;
};


// função que recebe um token alvo e um contexto (array de tokens) 
// e retorna uma lista de tokens com suas respectivas pontuações de atenção
function explainTokenMeaning(targetToken: string, context: string[]): AttentionScore[] {

    // palavras relacionadas a finanças e assentos para aumentar a pontuação de atenção  
    const financialWords = ["aprovou", "financiamento", "crédito", "dinheiro"];

    // palavras relacionadas a assentos para aumentar a pontuação de atenção
    const seatWords = ["sentei", "praça", "madeira", "assento"];

    // mapeia cada token do contexto para um objeto com o token e sua pontuação de atenção
    return context.map((token) => {
        const normalized = token.toLowerCase();

        let score = 0.1;

        if (financialWords.includes(normalized)) {
            score += 0.8;
        }

        if (seatWords.includes(normalized)) {
            score += 0.6;
        }

        if (token === targetToken) {
            score += 1;
        }

        return {
            token,
            score,
        };
    });
}

const sentence1 = ["O", "banco", "aprovou", "o", "financiamento"];
const sentence2 = ["Sentei", "no", "banco", "da", "praça"];

console.log("Contexto financeiro:");
console.table(explainTokenMeaning("banco", sentence1));

console.log("Contexto assento:");
console.table(explainTokenMeaning("banco", sentence2));