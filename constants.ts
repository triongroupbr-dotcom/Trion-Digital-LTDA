
import { Question } from "./types";

export const QUESTIONS: Question[] = [
  {
    id: 1,
    text: "Qual a sua idade?",
    options: ["18 a 29 anos", "30 a 39 anos", "40 a 49 anos", "50+ anos"],
    responses: ["Mentiroso.", "Ainda há esperança.", "Você sabe o que é dor.", "Perfeito. Você está pronto."],
  },
  {
    id: 2,
    text: "Você está solteiro?",
    options: ["✅ Sim", "❌ Não"],
    responses: ["Foco total.", "Entendido."],
  },
  {
    id: 3,
    text: "Você tem alguém em mente que queira conquistar?",
    options: ["Sim, tem alguém que eu gosto ", "Quero reconquistar uma ex", "Apenas quero sair com mais mulheres", "Não sei ainda"],
    responses: ["Santo demais.", "Quase lá.", "Você tem potencial.", "Bem-vindo ao lado negro."],
  },
  {
    id: 4,
    text: "Você gosta de dominar ou ser dominado?",
    options: ["Nenhum dos dois", "Ser dominado", "Dominar", "Dominar completamente"],
    responses: ["Ingênuo.", "Fraco.", "Interessante.", "Você entendeu o jogo."],
  },
  {
    id: 5,
    text: "Se a mulher que você gosta postasse essa foto no Instagram, como você responderia?",
    options: [
      "Mandaria um \"Oi\"",
      "Faria um elogio",
      "Chamaria ela pra sair",
      "Reagiria com um emoji 🔥",
      "Não saberia o que dizer (passaria o storie)"
    ],
    responses: ["Básico demais.", "Previsível.", "Ousado.", "Preguiçoso.", "Invisível."],
  },
  {
    id: 6,
    text: "Onde você costuma conversar com ela(s)?",
    options: ["Instagram", "WhatsApp", "Tinder", "Outros"],
    responses: ["Teimoso.", "Cauteloso.", "Inteligente.", "Devoto absoluto."],
  },
  {
    id: 7,
    text: "Você merece esse acesso ou ainda é um pegador Fraco?",
    options: ["Sou Fraco", "Não sei", "Mereço", "SOU PEGADOR"],
    responses: ["Pelo menos é honesto.", "Indeciso.", "Confiante.", "APROVADO."],
  },
  {
    id: 8,
    text: "Você quer ter acesso vitalício ou só ficar vendo vídeo de mulher no tiktok e não pegar nenhuma?",
    options: ["Prefiro não pegar mulher", "Não sei", "Acesso vitalício", "DOMINAÇÃO TOTAL"],
    responses: ["Perdido.", "Confuso.", "Focado.", "MENTALIDADE BLACK."],
  },
  {
    id: 9,
    text: "Quer marcar encontros reais essa semana?",
    options: ["Nunca", "Talvez", "Sim", "EU QUERO"],
    responses: ["Moralista.", "Hesitante.", "Pragmático.", "VERDADEIRO BLACK."],
  },
];
