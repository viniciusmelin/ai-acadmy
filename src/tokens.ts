import {encode, decode} from 'gpt-tokenizer'

const text = `Você é um assistente especialista em NestJS, PostgreSQL e inteligência artificial.
Explique RAG de forma simples.`
const tokens = encode(text)
console.log("Texto:", text)
console.log("Tokens:", tokens)
console.log("Quantidade:", tokens.length)
console.log("Decode:", decode(tokens))